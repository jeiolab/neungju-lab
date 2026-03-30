import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, YAxis, XAxis, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Lightbulb, Zap, Volume2, Save, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { TuningRecord, SimulationStats } from '../types';
import * as storageService from '../services/storageService';

interface SimulationTabProps {
  onBadgeUpdate: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onBadgeUpdate }) => {
  // Settings
  const [threshold, setThreshold] = useState(100);
  const [debounce, setDebounce] = useState(0.5); // seconds

  // State
  const [lightOn, setLightOn] = useState(false);
  const [data, setData] = useState<{ time: number; value: number }[]>([]);
  const [stats, setStats] = useState<SimulationStats>({ toggles: 0, falsePositives: 0, failedNegatives: 0, attempts: 0 });
  const [feedback, setFeedback] = useState<string>("시뮬레이션을 시작하여 전등을 켜보세요.");
  const [isRunning, setIsRunning] = useState(true);
  
  // Refs for loop logic
  const lastToggleTimeRef = useRef<number>(0);
  const audioValueRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const noiseModeRef = useRef<boolean>(false);

  // Constants
  const MAX_DATA_POINTS = 50;
  
  // Logic to process sensor data
  const processSensorData = useCallback((sensorValue: number) => {
    const now = Date.now();
    const timeSinceLastToggle = (now - lastToggleTimeRef.current) / 1000;
    
    // Check Threshold
    if (sensorValue >= threshold) {
        // Check Debounce
        if (timeSinceLastToggle >= debounce) {
             setLightOn(prev => !prev);
             lastToggleTimeRef.current = now;
             
             // Update Stats
             setStats(prev => ({
                 ...prev,
                 toggles: prev.toggles + 1,
                 // If it was noise mode, it's a false positive
                 falsePositives: noiseModeRef.current ? prev.falsePositives + 1 : prev.falsePositives
             }));
             noiseModeRef.current = false; // Reset noise mode flag after trigger
             return true; // Triggered
        } else {
             // Debounce blocked it
             return false;
        }
    } else {
        // Below threshold
        if (!noiseModeRef.current && sensorValue > 50) {
            // If it was a clap attempt but failed (implied by high-ish value but < threshold)
            // Ideally we track intent, but for simulation simple threshold check is fine.
        }
    }
    return false;
  }, [threshold, debounce]);

  // Simulation Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      timeRef.current += 1;
      
      // Decay audio value
      if (audioValueRef.current > 10) {
        audioValueRef.current = Math.max(0, audioValueRef.current * 0.8);
      } else {
          // Ambient jitter
          audioValueRef.current = Math.random() * 10; 
      }

      const currentValue = Math.floor(audioValueRef.current);
      processSensorData(currentValue);

      setData(prev => {
        const newData = [...prev, { time: timeRef.current, value: currentValue }];
        if (newData.length > MAX_DATA_POINTS) newData.shift();
        return newData;
      });

    }, 100); // 100ms refresh rate

    return () => clearInterval(interval);
  }, [isRunning, processSensorData]);

  // Actions
  const handleClap = () => {
    noiseModeRef.current = false;
    audioValueRef.current = 200 + Math.random() * 55; // 200~255
    setStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));
    
    // Check immediately for "failed negative" (sound generated but didnt toggle)
    // We defer this check slightly to let the loop catch it, or check logically here:
    // This is a UI simplified check for feedback
    setTimeout(() => {
       if (audioValueRef.current < threshold) {
           setStats(prev => ({ ...prev, failedNegatives: prev.failedNegatives + 1 }));
       }
    }, 150);
  };

  const handleNoise = () => {
    noiseModeRef.current = true;
    audioValueRef.current = 80 + Math.random() * 70; // 80~150
  };

  // Generate Feedback Analysis
  useEffect(() => {
      let msg = "";
      const totalEvents = stats.toggles + stats.failedNegatives + stats.falsePositives;
      
      if (totalEvents === 0) {
          msg = "준비 완료: '손뼉'을 치거나 '소음'을 발생시켜보세요.";
      } else if (stats.falsePositives > 0) {
          msg = "⚠️ 오작동 발생! 소음에 전등이 반응했습니다. -> 임계값을 더 높여야 합니다.";
      } else if (stats.failedNegatives > 0) {
          msg = "⚠️ 반응 실패! 손뼉 소리를 인식하지 못했습니다. -> 임계값을 낮춰보세요.";
      } else if (stats.toggles > 1 && debounce < 0.2) {
          msg = "💡 전등이 너무 자주 깜빡이나요? -> 디바운스 시간을 늘려 연속 입력을 방지하세요.";
      } else {
          msg = "✅ 아주 좋습니다! 안정적으로 작동하고 있습니다.";
      }
      setFeedback(msg);
      
      // Check Badge Condition
      if (stats.toggles >= 10 && stats.falsePositives === 0) {
          // Trigger badge update in parent if not already earned logic (handled in parent/service)
          // Simple local check:
          const badges = storageService.getBadges();
          if (badges && !badges.find(b => b.id === 'zero_malfunction')?.earned) {
              onBadgeUpdate();
          }
      }

  }, [stats, debounce, threshold, onBadgeUpdate]);

  const saveSettings = () => {
      const record: TuningRecord = {
          id: Date.now().toString(),
          name: `설정 #${storageService.getTunings().length + 1}`,
          threshold,
          debounce,
          successRate: stats.attempts > 0 ? ((stats.toggles - stats.falsePositives) / stats.attempts * 100) : 0,
          falseTriggers: stats.falsePositives,
          timestamp: Date.now()
      };
      storageService.saveTuning(record);
      storageService.updateStreak();
      alert("현재 설정이 '나의 최적 설정'에 저장되었습니다!");
  };

  const resetStats = () => {
      setStats({ toggles: 0, falsePositives: 0, failedNegatives: 0, attempts: 0 });
      setData([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold text-slate-700 flex items-center gap-2">
                   <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 기준 소리 (Threshold)
                </label>
                <span className="text-blue-600 font-bold">{threshold}</span>
              </div>
              <input 
                type="range" min="50" max="180" value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">이 값보다 큰 소리에만 반응합니다.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                 <label className="font-semibold text-slate-700 flex items-center gap-2">
                   <span className="w-2 h-2 bg-purple-500 rounded-full"></span> 디바운스 (Debounce)
                </label>
                <span className="text-purple-600 font-bold">{debounce}초</span>
              </div>
              <input 
                type="range" min="0" max="2.0" step="0.1" value={debounce}
                onChange={(e) => setDebounce(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <p className="text-xs text-slate-500 mt-1">연속 반응을 막기 위한 대기 시간입니다.</p>
            </div>
            
             {/* Weak Concept Recommendation (Conditional) */}
             {debounce < 0.1 && (
                 <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-sm text-orange-800 flex items-start gap-2 animate-pulse">
                     <AlertTriangle size={16} className="mt-0.5" />
                     <span>디바운스가 너무 짧으면 '따닥'하고 두 번 켜질 수 있어요! 개념 복습이 필요할까요?</span>
                 </div>
             )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 justify-center">
             <button 
                onClick={handleClap}
                className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transform active:scale-95 transition flex items-center justify-center gap-2"
             >
                <Zap size={24} /> 👏 손뼉 치기 (입력)
             </button>
             <button 
                onClick={handleNoise}
                className="py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold shadow-sm transform active:scale-95 transition flex items-center justify-center gap-2"
             >
                <Volume2 size={24} /> 🗣️ 주변 소음 (방해)
             </button>
          </div>
        </div>
      </div>

      {/* Main Visual: Graph & Bulb */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 h-80 relative">
            <h3 className="text-sm font-semibold text-slate-500 mb-2">실시간 센서 데이터 (0 ~ 255)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" hide type="number" domain={['auto', 'auto']} />
                    <YAxis domain={[0, 260]} hide />
                    
                    {/* Threshold Line */}
                    <ReferenceLine y={threshold} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: '임계값', fill: '#3b82f6', fontSize: 12, position: 'right' }} />
                    
                    {/* Data Line */}
                    <Line type="monotone" dataKey="value" stroke="#64748b" strokeWidth={3} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Bulb Status */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className={`transition-all duration-300 ${lightOn ? 'drop-shadow-[0_0_35px_rgba(250,204,21,0.8)]' : ''}`}>
                <Lightbulb size={100} className={lightOn ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} />
            </div>
            <div className="mt-6">
                <span className={`text-2xl font-bold ${lightOn ? "text-yellow-400" : "text-slate-400"}`}>
                    {lightOn ? "ON (켜짐)" : "OFF (꺼짐)"}
                </span>
            </div>
            
            {/* Debounce Indicator */}
            {Date.now() - lastToggleTimeRef.current < debounce * 1000 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-full animate-pulse">
                    ⏳ 대기 중 (Debounce)
                </div>
            )}
        </div>
      </div>

      {/* Stats & Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                  <Play size={20} className="text-indigo-600" />
              </div>
              <div>
                  <h4 className="font-bold text-indigo-900 mb-1">피드백 리포트</h4>
                  <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">{feedback}</p>
              </div>
          </div>
          
          <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-700 text-sm">시뮬레이션 결과</h4>
              <div className="flex justify-between text-sm">
                  <span className="text-slate-500">전등 전환</span>
                  <span className="font-mono font-bold">{stats.toggles}회</span>
              </div>
              <div className="flex justify-between text-sm">
                  <span className="text-red-500">오작동(소음)</span>
                  <span className="font-mono font-bold text-red-600">{stats.falsePositives}회</span>
              </div>
              
              <div className="flex gap-2 mt-2">
                 <button onClick={saveSettings} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1">
                     <Save size={14} /> 설정 저장
                 </button>
                 <button onClick={resetStats} className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-lg">
                     <RotateCcw size={14} />
                 </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SimulationTab;