import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '../ui/Card';
import { SensorType, SimulationConfig, TimePoint } from '../../types';
import { Play, Pause, RotateCcw, Lightbulb, Zap, Shield, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getSimulationFeedback } from '../../services/gemini';

interface SimulationTabProps {
  onDayComplete: () => void;
}

export const SimulationTab: React.FC<SimulationTabProps> = ({ onDayComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(12); // 0-24 Float
  const [config, setConfig] = useState<SimulationConfig>({
    luxThreshold: 300,
    sensorType: SensorType.PHOTO_ONLY,
  });
  
  // Simulation Data History for Chart
  const [history, setHistory] = useState<TimePoint[]>([]);
  const [realtimeStats, setRealtimeStats] = useState({ safety: 100, energy: 100 });
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Constants
  const DAY_DURATION_MS = 10000; // 10 seconds for 24 hours
  const TICK_RATE_MS = 100;
  const HOURS_PER_TICK = 24 / (DAY_DURATION_MS / TICK_RATE_MS);

  const calculateEnvironment = (hour: number) => {
    // Lux calculation: Parabola centered at 12 (noon)
    // Noon ~ 1000 lux, Midnight ~ 0 lux
    let lux = Math.max(0, 1000 - 25 * Math.pow(hour - 12, 2));
    
    // Traffic calculation: Peaks at 8am and 6pm (18:00)
    // Base traffic low at night
    const morningPeak = Math.max(0, 100 - 20 * Math.pow(hour - 8, 2));
    const eveningPeak = Math.max(0, 100 - 20 * Math.pow(hour - 18, 2));
    const baseTraffic = hour > 6 && hour < 22 ? 20 : 5;
    let traffic = Math.min(100, baseTraffic + morningPeak + eveningPeak);
    
    return { lux, traffic };
  };

  const calculateStatus = useCallback((hour: number, env: {lux: number, traffic: number}) => {
    let isLightOn = false;
    let powerConsumption = 0;
    
    // Logic: Light turns on if ambient lux is below threshold
    if (env.lux < config.luxThreshold) {
      if (config.sensorType === SensorType.PHOTO_ONLY) {
        isLightOn = true;
      } else {
        // Photo + Motion: Only on if traffic > 10 (arbitrary motion threshold)
        if (env.traffic > 10) {
          isLightOn = true;
        }
      }
    }

    if (isLightOn) powerConsumption = 100;

    // Scoring Logic
    // Safety: If traffic exists but light is OFF -> Danger!
    let safetyPenalty = 0;
    if (env.traffic > 10 && !isLightOn && env.lux < 50) {
      safetyPenalty = env.traffic * 2; // High traffic in dark = big penalty
    }
    
    // Energy: If light is ON -> consume energy
    let energyPenalty = 0;
    if (isLightOn) {
      energyPenalty = 20; // Base cost
      // If motion sensor is used and light is ON while nobody is there (shouldn't happen with logic above but good for robustness)
      if (config.sensorType === SensorType.PHOTO_MOTION && env.traffic <= 10) {
         energyPenalty += 50; 
      }
      // If light is on but it's bright enough naturally
      if (env.lux > config.luxThreshold) {
        energyPenalty += 50;
      }
    }

    return { isLightOn, powerConsumption, safetyPenalty, energyPenalty };
  }, [config]);

  // Game Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + HOURS_PER_TICK;
          
          if (next >= 24) {
            // End of day
            setIsRunning(false);
            onDayComplete();
            fetchAiFeedback(); // Get feedback at end of day
            return 24; 
          }
          return next;
        });
      }, TICK_RATE_MS);
    }

    return () => clearInterval(interval);
  }, [isRunning, HOURS_PER_TICK, onDayComplete]);

  // Update Data & Stats based on Time
  useEffect(() => {
    const env = calculateEnvironment(currentTime);
    const status = calculateStatus(currentTime, env);

    const newPoint: TimePoint = {
      hour: currentTime,
      lux: env.lux,
      traffic: env.traffic,
      power: status.powerConsumption,
      isLightOn: status.isLightOn
    };

    if (currentTime === 0) {
      setHistory([]);
      setRealtimeStats({ safety: 100, energy: 100 });
      setAiFeedback("");
    } else {
      setHistory(prev => {
        // Limit history size for performance if needed, but 24h simulation is small
        return [...prev, newPoint];
      });

      setRealtimeStats(prev => ({
        safety: Math.max(0, prev.safety - (status.safetyPenalty * 0.05)), // Decay factor
        energy: Math.max(0, prev.energy - (status.energyPenalty * 0.05))
      }));
    }
  }, [currentTime, calculateStatus]);

  const fetchAiFeedback = async () => {
    setLoadingFeedback(true);
    const feedback = await getSimulationFeedback(realtimeStats.safety, realtimeStats.energy, config);
    setAiFeedback(feedback);
    setLoadingFeedback(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setHistory([]);
    setRealtimeStats({ safety: 100, energy: 100 });
    setAiFeedback("");
  };

  // Visuals
  const skyColor = () => {
    if (currentTime < 6 || currentTime > 20) return 'bg-slate-900'; // Night (Keep Dark)
    if (currentTime < 8 || currentTime > 18) return 'bg-orange-900'; // Dawn/Dusk (Keep Dark/Rich)
    return 'bg-sky-400'; // Day (Brighter)
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-fadeIn">
      {/* Simulation Viewport */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-300 shadow-xl bg-slate-900">
        {/* Dynamic Sky Background */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${skyColor()}`}>
          {/* Simple Sun/Moon animation could go here */}
          <div 
             className="absolute top-10 left-10 w-16 h-16 rounded-full bg-yellow-300 blur-xl transition-all duration-100"
             style={{ 
               transform: `translate(${currentTime * 40}%, ${Math.pow(currentTime - 12, 2) * 2}px)`,
               opacity: currentTime > 6 && currentTime < 18 ? 1 : 0
             }}
          />
        </div>

        {/* City Silhouette (SVG) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center px-4">
           {/* Simple buildings */}
           <div className="w-16 h-24 bg-slate-800 mx-1"></div>
           <div className="w-20 h-32 bg-slate-800 mx-1"></div>
           <div className="w-12 h-16 bg-slate-800 mx-1"></div>
           <div className="w-24 h-28 bg-slate-800 mx-1"></div>
           <div className="w-16 h-20 bg-slate-800 mx-1"></div>
        </div>

        {/* Streetlight Visuals */}
        <div className="absolute bottom-0 left-0 right-0 h-full flex justify-around items-end pb-8 px-10">
          {[1, 2, 3].map((id) => {
             // Check if light is ON based on latest history point
             const isLightOn = history.length > 0 ? history[history.length - 1].isLightOn : false;
             return (
               <div key={id} className="relative flex flex-col items-center">
                  {/* Light Cone */}
                  <div className={`absolute bottom-20 w-32 h-32 bg-yellow-400/30 blur-2xl rounded-full transition-opacity duration-300 ${isLightOn ? 'opacity-100' : 'opacity-0'}`} />
                  {/* Pole */}
                  <div className="w-2 h-32 bg-slate-600"></div>
                  {/* Lamp Head */}
                  <div className={`w-8 h-4 rounded-t-full ${isLightOn ? 'bg-yellow-300 shadow-[0_0_20px_rgba(253,224,71,0.8)]' : 'bg-slate-700'}`}></div>
               </div>
             )
          })}
        </div>

        {/* Info Overlay */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded border border-slate-200 text-xs text-right shadow-sm">
          <div className="text-xl font-mono text-slate-900">{Math.floor(currentTime)}:00</div>
          <div className="text-yellow-600 font-bold">Lux: {Math.floor(calculateEnvironment(currentTime).lux)}</div>
          <div className="text-blue-600 font-bold">Traffic: {Math.floor(calculateEnvironment(currentTime).traffic)}</div>
        </div>
      </div>

      {/* Controls & Dashboard */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Control Panel */}
        <Card title="설계 제어판" className="lg:col-span-1 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">센서 종류 선택</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setConfig({...config, sensorType: SensorType.PHOTO_ONLY})}
                className={`flex-1 py-2 rounded text-sm transition-colors border ${config.sensorType === SensorType.PHOTO_ONLY ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                disabled={isRunning}
              >
                조도 단독
              </button>
              <button 
                onClick={() => setConfig({...config, sensorType: SensorType.PHOTO_MOTION})}
                className={`flex-1 py-2 rounded text-sm transition-colors border ${config.sensorType === SensorType.PHOTO_MOTION ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'}`}
                disabled={isRunning}
              >
                조도 + 모션
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">점등 기준 밝기 (Lux): {config.luxThreshold}</label>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              step="50"
              value={config.luxThreshold}
              onChange={(e) => setConfig({...config, luxThreshold: Number(e.target.value)})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
              disabled={isRunning}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>어두울 때 켜짐 (0)</span>
              <span>밝을 때 켜짐 (1000)</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button 
              onClick={() => { if(!isRunning && currentTime < 24) setIsRunning(true); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded font-bold transition-all shadow-md ${isRunning ? 'bg-slate-200 text-slate-400' : 'bg-green-600 hover:bg-green-500 text-white shadow-green-500/30'}`}
              disabled={isRunning || currentTime >= 24}
            >
              <Play size={18} /> 시뮬레이션 시작
            </button>
            {isRunning ? (
              <button onClick={() => setIsRunning(false)} className="px-4 bg-yellow-500 hover:bg-yellow-400 rounded text-white shadow-md">
                <Pause size={18} />
              </button>
            ) : (
              <button onClick={handleReset} className="px-4 bg-red-500 hover:bg-red-400 rounded text-white shadow-md">
                <RotateCcw size={18} />
              </button>
            )}
          </div>
        </Card>

        {/* Real-time Graph & Score */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <div className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Shield size={14}/> 시민 안전 점수</div>
                   <div className={`text-2xl font-bold ${realtimeStats.safety < 50 ? 'text-red-500' : 'text-green-600'}`}>
                     {Math.floor(realtimeStats.safety)}
                   </div>
                </div>
                {/* Mini bar */}
                <div className="h-16 w-2 bg-slate-100 rounded-full relative overflow-hidden">
                   <div className="absolute bottom-0 w-full bg-green-500 transition-all duration-300" style={{ height: `${realtimeStats.safety}%` }}></div>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                   <div className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Zap size={14}/> 에너지 절약 점수</div>
                   <div className={`text-2xl font-bold ${realtimeStats.energy < 50 ? 'text-red-500' : 'text-blue-600'}`}>
                     {Math.floor(realtimeStats.energy)}
                   </div>
                </div>
                 <div className="h-16 w-2 bg-slate-100 rounded-full relative overflow-hidden">
                   <div className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300" style={{ height: `${realtimeStats.energy}%` }}></div>
                </div>
             </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-64">
            <h4 className="text-sm font-semibold text-slate-600 mb-4">실시간 전력 소모량 (W)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="hour" type="number" domain={[0, 24]} tickCount={13} stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[0, 150]} stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                  labelStyle={{ color: '#64748b' }}
                />
                <ReferenceLine x={config.luxThreshold / 40} stroke="#ef4444" strokeDasharray="3 3" /> 
                <Line type="step" dataKey="power" stroke="#f59e0b" strokeWidth={2} dot={false} animationDuration={300} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Feedback Section */}
      {(currentTime >= 24 || aiFeedback) && (
        <Card className="border-sky-200 bg-sky-50 animate-slideUp">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-sky-500 rounded-full text-white shadow-lg shadow-sky-500/20">
               <Sparkles size={24} />
             </div>
             <div className="flex-1">
               <h3 className="text-lg font-bold text-sky-700 mb-2">AI 수석 엔지니어의 피드백</h3>
               {loadingFeedback ? (
                 <div className="flex items-center gap-2 text-slate-500">
                    <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                    분석 중입니다...
                 </div>
               ) : (
                 <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                   {aiFeedback || "시뮬레이션을 완료하면 피드백을 받을 수 있습니다."}
                 </p>
               )}
             </div>
          </div>
        </Card>
      )}
    </div>
  );
};