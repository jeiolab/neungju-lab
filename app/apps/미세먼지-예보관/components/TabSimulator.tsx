import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SimulationState, ModelType, DailyMission } from '../types';
import { Slider } from './ui/Slider';
import { Button } from './ui/Button';
import { Car, Factory, Wind, Droplets, Info, BrainCircuit, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getEnvironmentalAdvice } from '../services/geminiService';

interface TabSimulatorProps {
  onMissionComplete: () => void;
  mission: DailyMission;
  stats: { missionsSolved: number };
}

export const TabSimulator: React.FC<TabSimulatorProps> = ({ onMissionComplete, mission, stats }) => {
  const [state, setState] = useState<SimulationState>({
    traffic: 50,
    factoryRate: 50,
    windSpeed: 5,
    humidity: 50
  });

  const [model, setModel] = useState<ModelType>(ModelType.LINEAR_REGRESSION);
  const [history, setHistory] = useState<{ time: string; pm25: number }[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string>("슬라이더를 조절하여 미세먼지 농도를 확인해보세요.");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Core Logic: The Formula
  // PM2.5 = (Traffic * 0.5) + (Factory * 0.8) - (Wind * 2) - (Humidity * 0.3)
  const calculatePM25 = useCallback((s: SimulationState, m: ModelType) => {
    let value = 0;
    if (m === ModelType.LINEAR_REGRESSION) {
      value = (s.traffic * 0.5) + (s.factoryRate * 0.8) - (s.windSpeed * 2) - (s.humidity * 0.3);
    } else {
      // Simple Average Model: Naive approach, ignores wind/humidity largely
      // Just averages the "polluters" and ignores the "cleansers" to show poor accuracy
      value = (s.traffic + s.factoryRate) / 1.5; 
    }
    return Math.max(0, Math.round(value));
  }, []);

  const currentPM25 = useMemo(() => calculatePM25(state, model), [state, model, calculatePM25]);

  // Update Chart History
  useEffect(() => {
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setHistory(prev => {
      const newHistory = [...prev, { time: timeLabel, pm25: currentPM25 }];
      return newHistory.slice(-20); // Keep last 20 points
    });
  }, [currentPM25]);

  // Check Mission Logic
  useEffect(() => {
    if (!mission.solved) {
        // Mission logic: Target PM2.5 < mission.target
        // And check if user is manipulating the correct variables (Mission usually asks to lower Traffic)
        // Here we just check the result for simplicity in this demo
        if (currentPM25 <= mission.targetPM25 && model === ModelType.LINEAR_REGRESSION) {
             onMissionComplete();
        }
    }
  }, [currentPM25, mission, onMissionComplete, model]);

  // Get AI Advice (Debounced manually or on button click to save quota, here on button for explicit interaction)
  const handleAskAI = async () => {
    setIsLoadingAdvice(true);
    const advice = await getEnvironmentalAdvice(currentPM25, state);
    setAiAdvice(advice);
    setIsLoadingAdvice(false);
  };

  const getAirQualityLabel = (val: number) => {
    if (val <= 15) return { text: "좋음", color: "text-emerald-600", bg: "bg-emerald-100" };
    if (val <= 35) return { text: "보통", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (val <= 75) return { text: "나쁨", color: "text-orange-600", bg: "bg-orange-100" };
    return { text: "매우 나쁨", color: "text-red-600", bg: "bg-red-100" };
  };

  const quality = getAirQualityLabel(currentPM25);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Left Column: Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">예측 모델 선택</h3>
                <div className="group relative">
                    <Info size={18} className="text-slate-400 cursor-help"/>
                    <div className="absolute left-0 bottom-6 w-64 bg-slate-800 text-white text-xs p-2 rounded hidden group-hover:block z-10">
                        선형 회귀 모델은 모든 센서를 사용하여 정확하지만 비용이 듭니다. 단순 평균 모델은 일부 센서만 사용하여 부정확합니다.
                    </div>
                </div>
            </div>
            
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
                <button 
                    onClick={() => setModel(ModelType.LINEAR_REGRESSION)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${model === ModelType.LINEAR_REGRESSION ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    선형 회귀 분석
                </button>
                <button 
                    onClick={() => setModel(ModelType.SIMPLE_AVERAGE)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${model === ModelType.SIMPLE_AVERAGE ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    단순 평균
                </button>
            </div>
            
            {model === ModelType.SIMPLE_AVERAGE && (
                <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100 mb-4">
                    ⚠️ 경고: 이 모델은 비용 절감을 위해 풍속 및 습도 센서를 사용하지 않습니다. 정확도가 낮습니다.
                </div>
            )}

            <div className="space-y-1">
                <Slider 
                    label="교통량" 
                    value={state.traffic} 
                    min={0} max={100} 
                    onChange={(v) => setState(prev => ({...prev, traffic: v}))}
                    icon={<Car size={16} className="text-slate-500"/>}
                    colorClass="accent-red-500"
                />
                 <Slider 
                    label="공장 가동률" 
                    value={state.factoryRate} 
                    min={0} max={100} 
                    onChange={(v) => setState(prev => ({...prev, factoryRate: v}))}
                    icon={<Factory size={16} className="text-slate-500"/>}
                    colorClass="accent-red-500"
                    disabled={!!mission && !mission.solved && mission.fixedFactory !== undefined} // Lock if part of mission constraint
                />
                 <Slider 
                    label="풍속" 
                    value={state.windSpeed} 
                    min={0} max={20} unit="m/s"
                    onChange={(v) => setState(prev => ({...prev, windSpeed: v}))}
                    icon={<Wind size={16} className="text-slate-500"/>}
                    colorClass="accent-emerald-500"
                    disabled={model === ModelType.SIMPLE_AVERAGE}
                />
                 <Slider 
                    label="습도" 
                    value={state.humidity} 
                    min={0} max={100} unit="%"
                    onChange={(v) => setState(prev => ({...prev, humidity: v}))}
                    icon={<Droplets size={16} className="text-slate-500"/>}
                    colorClass="accent-emerald-500"
                    disabled={model === ModelType.SIMPLE_AVERAGE}
                />
            </div>
        </div>

        {/* Mission Card */}
        <div className={`p-5 rounded-xl border transition-all ${mission.solved ? 'bg-emerald-50 border-emerald-200' : 'bg-indigo-50 border-indigo-200'}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold ${mission.solved ? 'text-emerald-800' : 'text-indigo-800'}`}>
                    {mission.solved ? '🎉 미션 성공!' : '🎯 오늘의 미션'}
                </h3>
            </div>
            <p className="text-sm text-slate-700 mb-3">{mission.description}</p>
            {!mission.solved && (
                <div className="text-xs font-mono bg-white/50 p-2 rounded text-indigo-900">
                    목표 미세먼지: {mission.targetPM25} 이하 <br/>
                    (힌트: 교통량을 줄여보세요!)
                </div>
            )}
        </div>
      </div>

      {/* Right Column: Visualization */}
      <div className="lg:col-span-2 space-y-6">
        {/* Big Number Display */}
        <div className="grid grid-cols-2 gap-4">
            <div className={`col-span-1 rounded-xl p-6 flex flex-col items-center justify-center border-2 ${quality.bg} ${quality.color} border-current`}>
                <span className="text-sm font-semibold uppercase tracking-wider opacity-80">예측 미세먼지 농도</span>
                <span className="text-5xl font-black my-2">{currentPM25}</span>
                <span className="text-lg font-bold">µg/m³ • {quality.text}</span>
            </div>
            
            <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BrainCircuit size={16}/> AI 행동 가이드
                    </h4>
                    <p className="text-slate-800 text-sm leading-relaxed min-h-[60px]">
                        "{aiAdvice}"
                    </p>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleAskAI} disabled={isLoadingAdvice}>
                        {isLoadingAdvice ? '분석 중...' : '새로운 조언 받기'}
                    </Button>
                </div>
            </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-80">
            <h3 className="font-bold text-slate-800 mb-4">실시간 예측 모니터링</h3>
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                      />
                      <YAxis 
                          domain={[0, 150]} 
                          tick={{ fontSize: 12, fill: '#64748b' }}
                          label={{ value: '미세먼지 (µg/m³)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                      />
                      <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'white' }}
                          formatter={(value: any) => [`${value} µg/m³`, '미세먼지']}
                          labelFormatter={(label) => `시간: ${label}`}
                      />
                      <ReferenceLine 
                          y={mission.targetPM25} 
                          label={{ value: "목표치", position: "top", fill: "#10b981", fontSize: 12 }} 
                          stroke="#10b981" 
                          strokeDasharray="3 3" 
                      />
                      <Line 
                          type="monotone" 
                          dataKey="pm25" 
                          stroke={model === ModelType.LINEAR_REGRESSION ? "#2563eb" : "#9333ea"} 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: model === ModelType.LINEAR_REGRESSION ? "#2563eb" : "#9333ea" }}
                          activeDot={{ r: 6 }}
                          animationDuration={300}
                          name="미세먼지"
                      />
                  </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <p className="text-lg mb-2">슬라이더를 조절하여 데이터를 확인하세요</p>
                  <p className="text-sm">실시간으로 미세먼지 농도가 그래프에 표시됩니다</p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};