import React, { useState, useEffect, useMemo } from 'react';
import { SimulationConfig } from '../types';
import { Play, RotateCcw, CloudRain, Sun, Bus, Footprints, Car } from 'lucide-react';

interface Props {
  onComplete: (success: boolean, points: number) => void;
}

export const SimulationTab: React.FC<Props> = ({ onComplete }) => {
  const [config, setConfig] = useState<SimulationConfig>({
    startTime: 480, // 8:00 AM
    budget: 3000,
    isRaining: false,
    busWaitTime: 10,
    walkTime: 30,
    lateThreshold: 510 // 8:30 AM
  });

  const [result, setResult] = useState<{
    method: 'taxi' | 'bus' | 'walk';
    arrivalTime: number;
    cost: number;
    path: string[];
    isLate: boolean;
  } | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [simTime, setSimTime] = useState(config.startTime);

  // Constants
  const TAXI_COST = 5000;
  const TAXI_TIME = 10;
  const BUS_COST = 1200;
  const BUS_TIME = 20;

  // Logic to determine transport
  const decision = useMemo(() => {
    if (config.isRaining && config.budget >= TAXI_COST) {
      return { type: 'taxi', reason: '비가 오고 택시비 충분', cost: TAXI_COST, duration: TAXI_TIME };
    } else {
      // Check bus condition: If walking takes too long OR (Wait+Ride is faster than Walk) ? 
      // Simplified Logic from prompt: "Condition & Repetition"
      // Let's interpret "Optimized Route":
      // Priority: Taxi (if rain) -> Bus (if afford & faster than walk) -> Walk
      
      const busTotalTime = config.busWaitTime + BUS_TIME;
      
      // Let's use a logic that makes sense for the lesson:
      // if (rain and rich) -> taxi
      // elif (time_tight and afford_bus) -> bus
      // else -> walk
      
      const timeUntilSchool = config.lateThreshold - config.startTime;
      const isTimeTight = timeUntilSchool < config.walkTime; // Walking will make you late or close call
      
      if (isTimeTight && config.budget >= BUS_COST) {
          return { type: 'bus', reason: '시간 촉박 & 버스비 있음', cost: BUS_COST, duration: busTotalTime };
      }
      
      return { type: 'walk', reason: '다른 조건 불만족 (걷기)', cost: 0, duration: config.walkTime };
    }
  }, [config]);

  const runSimulation = () => {
    setIsRunning(true);
    setSimTime(config.startTime);
    setResult(null);
  };

  useEffect(() => {
    if (!isRunning) return;

    const targetTime = config.startTime + decision.duration;
    
    // Simulate time passing loop
    const interval = setInterval(() => {
      setSimTime((prev) => {
        if (prev >= targetTime) {
          clearInterval(interval);
          setIsRunning(false);
          const isLate = prev > config.lateThreshold;
          
          setResult({
            method: decision.type as any,
            arrivalTime: prev,
            cost: decision.cost,
            path: ['Start', decision.type, 'School'],
            isLate
          });

          // Calculate points: Late penalty (-50), Cost saving (+1 per 100won left), Base (+100)
          let pts = 100;
          if (isLate) pts -= 50;
          pts += Math.floor((config.budget - decision.cost) / 100);
          
          onComplete(!isLate, pts > 0 ? pts : 0);
          return prev;
        }
        return prev + 1; // Increment 1 minute
      });
    }, 50); // Speed of simulation

    return () => clearInterval(interval);
  }, [isRunning, config, decision, onComplete]);

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-slate-800">1. 상황 설정 (입력)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">출발 시각 {formatTime(config.startTime)}</label>
              <input 
                type="range" min="450" max="510" step="5" 
                value={config.startTime}
                onChange={(e) => setConfig({...config, startTime: Number(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">내 지갑: {config.budget}원</label>
              <input 
                type="number" step="100"
                value={config.budget}
                onChange={(e) => setConfig({...config, budget: Number(e.target.value)})}
                className="w-full mt-1 p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between bg-slate-50 p-3 rounded">
                <span className="text-sm font-medium flex items-center gap-2">
                  {config.isRaining ? <CloudRain className="text-blue-500" /> : <Sun className="text-orange-500" />}
                  날씨: {config.isRaining ? '비옴' : '맑음'}
                </span>
                <button 
                  onClick={() => setConfig({...config, isRaining: !config.isRaining})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.isRaining ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${config.isRaining ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
             <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block text-xs text-slate-400">도보 소요</span>
                  <span className="font-bold">{config.walkTime}분</span>
                </div>
                <div className="bg-slate-50 p-2 rounded">
                  <span className="block text-xs text-slate-400">버스 대기</span>
                  <span className="font-bold">{config.busWaitTime}분</span>
                </div>
             </div>
          </div>
        </div>
        
        <button 
          onClick={runSimulation}
          disabled={isRunning}
          className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isRunning ? '시뮬레이션 중...' : '시뮬레이션 시작 (Run)'}
          {!isRunning && <Play size={18} fill="currentColor" />}
        </button>
      </div>

      {/* Logic Flow Visualization */}
      <div className="bg-slate-800 text-white p-5 rounded-xl shadow-inner font-mono text-sm relative overflow-hidden">
        <h3 className="text-xs font-bold text-slate-400 mb-3 border-b border-slate-600 pb-2">CODE FLOW VISUALIZER</h3>
        
        <div className={`transition-opacity duration-300 ${isRunning || result ? 'opacity-100' : 'opacity-50'}`}>
           <div className={`p-2 rounded mb-1 transition-colors ${decision.type === 'taxi' ? 'bg-green-900/50 border-l-4 border-green-500' : 'text-slate-500'}`}>
             <span className="text-purple-400">if</span> (isRaining <span className="text-yellow-300">and</span> budget &ge; 5000):<br/>
             &nbsp;&nbsp;method = <span className="text-green-400">'Taxi'</span>
           </div>
           
           <div className={`p-2 rounded mb-1 transition-colors ${decision.type === 'bus' ? 'bg-green-900/50 border-l-4 border-green-500' : 'text-slate-500'}`}>
             <span className="text-purple-400">elif</span> (time_tight <span className="text-yellow-300">and</span> budget &ge; 1200):<br/>
             &nbsp;&nbsp;method = <span className="text-green-400">'Bus'</span>
           </div>

           <div className={`p-2 rounded transition-colors ${decision.type === 'walk' ? 'bg-green-900/50 border-l-4 border-green-500' : 'text-slate-500'}`}>
             <span className="text-purple-400">else</span>:<br/>
             &nbsp;&nbsp;method = <span className="text-green-400">'Walk'</span>
           </div>

           <div className="mt-4 pt-4 border-t border-slate-700">
             <span className="text-purple-400">while</span> current_time &lt; arrival_time:<br/>
             &nbsp;&nbsp;current_time += 1 <span className="text-slate-500"># Current: {formatTime(simTime)}</span>
           </div>
        </div>
      </div>

      {/* Result Feedback */}
      {result && (
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-indigo-500 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                {result.method === 'taxi' && <Car size={32} />}
                {result.method === 'bus' && <Bus size={32} />}
                {result.method === 'walk' && <Footprints size={32} />}
             </div>
             <div>
                <h4 className="font-bold text-xl">
                  {formatTime(result.arrivalTime)} 도착
                  {result.isLate ? <span className="ml-2 text-red-500 text-sm">(지각! 😱)</span> : <span className="ml-2 text-green-600 text-sm">(세이프! 😎)</span>}
                </h4>
                <p className="text-slate-500 text-sm">소요비용: {result.cost}원</p>
             </div>
          </div>

          <div className="space-y-2 bg-slate-50 p-4 rounded text-sm">
            <p className="flex items-start gap-2">
              <span className="font-bold min-w-[30px] text-indigo-600">결과:</span>
              <span>지금 조건에서 <span className="font-bold underline">{decision.reason}</span>(이)라 {result.method === 'taxi' ? '택시' : result.method === 'bus' ? '버스' : '걷기'}를 선택했어요.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold min-w-[30px] text-orange-600">변화:</span>
              <span>
                {decision.type === 'walk' && '만약 돈이 더 있거나 시간이 촉박했다면 버스를 탔을 거예요.'}
                {decision.type === 'bus' && '만약 비가 오고 돈이 5000원 이상이었다면 택시를 탔을 거예요.'}
                {decision.type === 'taxi' && '비가 그치면 돈을 아끼기 위해 버스나 걷기를 선택했을 거예요.'}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold min-w-[30px] text-green-600">핵심:</span>
              <span>프로그램은 <span className="font-bold">선택 구조(if-elif)</span>를 통해 조건에 맞는 딱 하나의 길만 실행합니다.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
