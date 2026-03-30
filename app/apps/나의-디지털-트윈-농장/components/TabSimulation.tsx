import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FarmState, SimulationLog, ScenarioType } from '../types';
import { INITIAL_FARM_STATE, OPTIMAL_TEMP_MIN, OPTIMAL_TEMP_MAX, OPTIMAL_HUM_MIN, OPTIMAL_HUM_MAX } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Thermometer, Droplets, Utensils, Activity, Radio, Cpu, RefreshCcw } from 'lucide-react';
import { getFarmConsultation } from '../services/geminiService';

interface TabSimulationProps {
  onScoreUpdate: (score: number) => void;
  onScenarioSuccess: () => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ onScoreUpdate, onScenarioSuccess }) => {
  const [stats, setStats] = useState<FarmState>(INITIAL_FARM_STATE);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [scenario, setScenario] = useState<ScenarioType>(ScenarioType.NONE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("시뮬레이션을 시작하고 AI 컨설턴트에게 조언을 구해보세요.");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Core Simulation Engine
  const runSimulationTick = useCallback(() => {
    setStats((prev) => {
      let tempEffect = 0;
      let humEffect = 0;
      let feedEffect = 0;
      
      // Temperature Impact (Optimal: 18-24)
      if (prev.temperature < OPTIMAL_TEMP_MIN) tempEffect = (OPTIMAL_TEMP_MIN - prev.temperature) * 2;
      else if (prev.temperature > OPTIMAL_TEMP_MAX) tempEffect = (prev.temperature - OPTIMAL_TEMP_MAX) * 2;

      // Humidity Impact (Optimal: 50-70)
      if (prev.humidity < OPTIMAL_HUM_MIN) humEffect = (OPTIMAL_HUM_MIN - prev.humidity) * 0.5;
      else if (prev.humidity > OPTIMAL_HUM_MAX) humEffect = (prev.humidity - OPTIMAL_HUM_MAX) * 0.5;

      // Feed Impact (Optimal ~50kg for this scale)
      if (prev.feedAmount < 40) feedEffect = (40 - prev.feedAmount) * 1.5;
      else if (prev.feedAmount > 70) feedEffect = (prev.feedAmount - 70) * 1; // Overfeeding

      // Scenario Impact
      let scenarioDamage = 0;
      if (scenario === ScenarioType.HEATWAVE) {
         // Heatwave increases temp naturally if not countered, deals damage if temp is high
         if (prev.temperature > 26) scenarioDamage += 2;
      } else if (scenario === ScenarioType.DISEASE) {
         // Disease drains health unless sensor sensitivity is high enough to catch it early
         if (prev.sensorSensitivity < 70) scenarioDamage += 3;
         else scenarioDamage += 0.5; // Managed but still some impact
      }

      // Calculate new Health & Productivity
      const healthDrop = tempEffect + humEffect + feedEffect + scenarioDamage;
      const newHealth = Math.max(0, Math.min(100, prev.pigHealth - (healthDrop * 0.1) + (healthDrop === 0 ? 0.5 : 0)));
      
      // Productivity follows health but lags slightly
      const newProductivity = Math.max(0, Math.min(100, (newHealth * 0.8) + (prev.sensorSensitivity * 0.1) + (prev.feedAmount >= 45 && prev.feedAmount <= 60 ? 10 : 0)));

      // Scenario Resolution Check
      if (scenario === ScenarioType.HEATWAVE && prev.temperature <= 24 && prev.day > 5) {
         // Heatwave resolved logic handled in effect
      }

      return {
        ...prev,
        pigHealth: newHealth,
        productivity: newProductivity,
        day: prev.day + 1,
        // Natural drift for Heatwave scenario
        temperature: scenario === ScenarioType.HEATWAVE ? Math.min(40, prev.temperature + 0.05) : prev.temperature
      };
    });
  }, [scenario]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(runSimulationTick, 1000); // 1 sec = 1 day
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, runSimulationTick]);

  // Log Updates
  useEffect(() => {
    setLogs(prev => [...prev.slice(-19), { day: stats.day, health: Math.round(stats.pigHealth), productivity: Math.round(stats.productivity) }]);
    onScoreUpdate(stats.productivity);
  }, [stats.day, stats.pigHealth, stats.productivity, onScoreUpdate]);

  // Handle Scenario Success
  useEffect(() => {
      if (scenario !== ScenarioType.NONE) {
          if (stats.pigHealth > 80 && stats.productivity > 80) {
              // Maintaining good stats during crisis counts as success over time
              // Logic simplified for UX: manual success trigger or sustained health
          }
      }
  }, [scenario, stats.pigHealth, stats.productivity]);


  const handleAiConsult = async () => {
    setIsLoadingAdvice(true);
    const advice = await getFarmConsultation(stats, scenario);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const triggerScenario = (type: ScenarioType) => {
    setScenario(type);
    setIsPlaying(true); // Auto start
    if (type === ScenarioType.HEATWAVE) {
        setStats(prev => ({ ...prev, temperature: 28 })); // Jump start heat
    } else if (type === ScenarioType.DISEASE) {
        setStats(prev => ({...prev, pigHealth: 85 })); // Initial hit
    }
    // Reset scenario after some time or manually? Let's keep it manual resolution via user improving stats
  };

  const resolveScenario = () => {
      if (stats.pigHealth > 85) {
          onScenarioSuccess();
          setScenario(ScenarioType.NONE);
          alert("위기 상황을 훌륭하게 극복했습니다! 배지 포인트가 적립되었습니다.");
      } else {
          alert("아직 농장 상태가 불안정합니다. 건강도를 85 이상으로 올린 후 상황을 종료하세요.");
      }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      
      {/* LEFT: Virtual Control (Digital Twin Input) */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <Cpu className="mr-2 text-indigo-500" /> 가상 축사 제어 (Digital Control)
            </h2>
            <div className="flex space-x-2">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 rounded-lg font-bold text-white transition ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {isPlaying ? '일시정지' : '시뮬레이션 시작'}
                </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Controls */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center text-slate-700 font-medium"><Thermometer className="w-4 h-4 mr-1"/> 온도 설정 (°C)</label>
                <span className={`font-bold ${stats.temperature < 18 || stats.temperature > 24 ? 'text-red-500' : 'text-slate-900'}`}>{stats.temperature.toFixed(1)}°C</span>
              </div>
              <input 
                type="range" min="10" max="40" step="0.5" 
                value={stats.temperature} 
                onChange={(e) => setStats({...stats, temperature: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10°C</span><span>적정 22°C</span><span>40°C</span></div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center text-slate-700 font-medium"><Droplets className="w-4 h-4 mr-1"/> 습도 설정 (%)</label>
                <span className={`font-bold ${stats.humidity < 50 || stats.humidity > 70 ? 'text-red-500' : 'text-slate-900'}`}>{stats.humidity.toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="20" max="100" 
                value={stats.humidity} 
                onChange={(e) => setStats({...stats, humidity: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center text-slate-700 font-medium"><Utensils className="w-4 h-4 mr-1"/> 사료 공급량 (kg)</label>
                <span className="font-bold text-slate-900">{stats.feedAmount.toFixed(0)}kg</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={stats.feedAmount} 
                onChange={(e) => setStats({...stats, feedAmount: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center text-slate-700 font-medium"><Radio className="w-4 h-4 mr-1"/> IoT 센서 민감도 (%)</label>
                <span className="font-bold text-slate-900">{stats.sensorSensitivity}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={stats.sensorSensitivity} 
                onChange={(e) => setStats({...stats, sensorSensitivity: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <p className="text-xs text-slate-500 mt-1">민감도가 높으면 질병/이상 징후를 빨리 발견하지만 시스템 부하가 늘어날 수 있습니다.</p>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">⚠️ 시나리오 테스트</h3>
            <div className="flex gap-3">
                <button 
                    onClick={() => triggerScenario(ScenarioType.HEATWAVE)}
                    disabled={scenario !== ScenarioType.NONE}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-medium text-sm transition disabled:opacity-50"
                >
                    🔥 폭염 경보 발생
                </button>
                <button 
                    onClick={() => triggerScenario(ScenarioType.DISEASE)}
                    disabled={scenario !== ScenarioType.NONE}
                    className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 py-3 rounded-xl font-medium text-sm transition disabled:opacity-50"
                >
                    🦠 질병 징후 포착
                </button>
            </div>
            {scenario !== ScenarioType.NONE && (
                <div className="mt-4 p-4 bg-slate-800 text-white rounded-xl flex justify-between items-center animate-pulse">
                    <div>
                        <p className="font-bold text-sm">
                            {scenario === ScenarioType.HEATWAVE ? "현재 폭염 경보 발령 중!" : "질병 징후가 포착되었습니다!"}
                        </p>
                        <p className="text-xs text-slate-300">수치를 조절하여 정상화하세요.</p>
                    </div>
                    <button 
                        onClick={resolveScenario}
                        className="bg-white text-slate-900 px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-100"
                    >
                        상황 종료 시도
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* RIGHT: Real-World Feedback (Dashboard) */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-r-4 border-r-green-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              <span className="flex items-center"><Activity className="mr-2 text-green-600" /> 실제 농장 반응 (Real-time)</span>
              <span className="text-sm font-normal text-slate-500">Day {stats.day}</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-slate-500 text-sm mb-1">돼지 건강도</p>
                    <p className={`text-3xl font-bold ${stats.pigHealth < 80 ? 'text-red-500' : 'text-green-600'}`}>
                        {Math.round(stats.pigHealth)}
                        <span className="text-sm ml-1">/100</span>
                    </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-slate-500 text-sm mb-1">생산성 지수</p>
                    <p className={`text-3xl font-bold ${stats.productivity < 80 ? 'text-amber-500' : 'text-blue-600'}`}>
                        {Math.round(stats.productivity)}
                        <span className="text-sm ml-1">/100</span>
                    </p>
                </div>
            </div>

            {/* Alert Box */}
            {(stats.pigHealth < 80 || stats.productivity < 80) && (
                 <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                    주의: 농장 상태가 최적 범위를 벗어났습니다. 설정을 조정하세요.
                 </div>
            )}

            {/* Chart */}
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={logs}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" hide />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="health" stroke="#16a34a" strokeWidth={2} dot={false} name="건강도" />
                        <Line type="monotone" dataKey="productivity" stroke="#2563eb" strokeWidth={2} dot={false} name="생산성" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* AI Consultant */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                    🤖 AI 스마트팜 컨설턴트
                </h3>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl min-h-[100px] mb-4 text-sm leading-relaxed border border-white/20">
                    {isLoadingAdvice ? (
                        <div className="flex items-center justify-center h-full">
                            <RefreshCcw className="animate-spin mr-2" /> 분석 중...
                        </div>
                    ) : aiAdvice}
                </div>
                <button 
                    onClick={handleAiConsult}
                    disabled={isLoadingAdvice}
                    className="w-full bg-white text-indigo-700 font-bold py-2 rounded-lg hover:bg-indigo-50 transition shadow-md disabled:opacity-70"
                >
                    현재 상태 분석 요청하기
                </button>
            </div>
            {/* Decor */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;