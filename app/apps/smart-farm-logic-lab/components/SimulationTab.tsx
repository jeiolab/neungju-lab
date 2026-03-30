import React, { useState, useEffect, useMemo } from 'react';
import { ActionType, EnvironmentState, SimulationRule } from '../types';

const SimulationTab: React.FC = () => {
  // Environment Input State
  const [temp, setTemp] = useState<number>(25);
  const [humidity, setHumidity] = useState<number>(50);
  
  // Logic Configuration State
  const [highTempLimit, setHighTempLimit] = useState<number>(30);
  const [highTempAction, setHighTempAction] = useState<ActionType>(ActionType.FAN_ON);
  
  const [lowTempLimit, setLowTempLimit] = useState<number>(15);
  const [lowTempAction, setLowTempAction] = useState<ActionType>(ActionType.HEATER_ON);

  // System State (Output)
  const [systemState, setSystemState] = useState<EnvironmentState>({
    temperature: 25,
    humidity: 50,
    isWindowOpen: false,
    isFanOn: false,
    isHeaterOn: false,
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [energyBadge, setEnergyBadge] = useState<boolean>(false);

  // Simulation Logic Loop
  useEffect(() => {
    let newFanState = false;
    let newHeaterState = false;
    let newWindowOpen = false;
    let feedback = null;

    // High Temp Logic
    if (temp >= highTempLimit) {
      if (highTempAction === ActionType.FAN_ON) newFanState = true;
      if (highTempAction === ActionType.WINDOW_OPEN) newWindowOpen = true;
    }

    // Low Temp Logic
    if (temp <= lowTempLimit) {
      if (lowTempAction === ActionType.HEATER_ON) newHeaterState = true;
      if (lowTempAction === ActionType.WINDOW_OPEN) newWindowOpen = true; // Unusual but possible logic
    }

    // Conflict Check & Physics
    if (newHeaterState && newFanState) {
      feedback = "경고: 히터와 팬이 동시에 켜져 있습니다! 에너지가 낭비됩니다.";
    }
    if (newHeaterState && temp > 30) {
      feedback = "경고: 온도가 높은데 히터가 켜졌습니다! 작물이 위험합니다.";
    }
    if (newFanState && temp < 10) {
      feedback = "경고: 추운 날씨에 팬을 돌리면 작물이 얼 수 있습니다.";
    }

    // Badge Logic
    const efficient = !feedback && !(newHeaterState && newWindowOpen);
    setEnergyBadge(efficient);

    setFeedbackMessage(feedback);
    setSystemState({
      temperature: temp,
      humidity: humidity,
      isWindowOpen: newWindowOpen,
      isFanOn: newFanState,
      isHeaterOn: newHeaterState,
    });

  }, [temp, humidity, highTempLimit, highTempAction, lowTempLimit, lowTempAction]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls & Logic Panel */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-emerald-500">🎛️</span> 환경 변수 조절 (입력)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">현재 온도</label>
                <span className={`text-sm font-bold ${temp > 35 ? 'text-red-500' : temp < 10 ? 'text-blue-500' : 'text-gray-700'}`}>{temp}°C</span>
              </div>
              <input 
                type="range" min="-10" max="50" value={temp} 
                onChange={(e) => setTemp(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">현재 습도</label>
                <span className="text-sm font-bold text-blue-600">{humidity}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={humidity} 
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-2 border-indigo-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-indigo-500">🧠</span> 제어 로직 설계 (규칙)
          </h3>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-purple-600 font-bold">IF</span>
              <span>( 온도 {'>='} </span>
              <input 
                type="number" 
                value={highTempLimit}
                onChange={(e) => setHighTempLimit(Number(e.target.value))}
                className="w-16 p-1 border rounded text-center"
              />
              <span>)</span>
              <span className="text-purple-600 font-bold">THEN</span>
              <select 
                value={highTempAction}
                onChange={(e) => setHighTempAction(e.target.value as ActionType)}
                className="p-1 border rounded bg-slate-50"
              >
                <option value={ActionType.NONE}>아무것도 안 함</option>
                <option value={ActionType.FAN_ON}>팬 켜기</option>
                <option value={ActionType.WINDOW_OPEN}>창문 열기</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-purple-600 font-bold">ELSE IF</span>
              <span>( 온도 {'<='} </span>
              <input 
                type="number" 
                value={lowTempLimit}
                onChange={(e) => setLowTempLimit(Number(e.target.value))}
                className="w-16 p-1 border rounded text-center"
              />
              <span>)</span>
              <span className="text-purple-600 font-bold">THEN</span>
              <select 
                 value={lowTempAction}
                 onChange={(e) => setLowTempAction(e.target.value as ActionType)}
                 className="p-1 border rounded bg-slate-50"
              >
                <option value={ActionType.NONE}>아무것도 안 함</option>
                <option value={ActionType.HEATER_ON}>히터 켜기</option>
                <option value={ActionType.WINDOW_OPEN}>창문 열기</option>
              </select>
            </div>
          </div>
        </div>

        {feedbackMessage && (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-bold">로직 오류 발생</p>
                <p className="text-sm text-red-600">{feedbackMessage}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Dashboard */}
      <div className="flex-1 bg-slate-800 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L2 22h20L12 2zm0 3.5L18.5 19h-13L12 5.5z"/>
           </svg>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
               <h2 className="text-2xl font-bold tracking-wider">스마트팜 운영 시스템</h2>
               <p className="text-slate-400 text-sm">시스템 상태: {feedbackMessage ? '경고' : '정상'}</p>
             </div>
             {energyBadge && (
               <div className="flex flex-col items-center animate-bounce">
                 <div className="bg-yellow-400 text-slate-900 rounded-full p-2 w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white">
                    ⚡
                 </div>
                 <span className="text-xs text-yellow-300 font-bold mt-1">에너지 절약</span>
               </div>
             )}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
            
            {/* House Visualization */}
            <div className="relative w-64 h-48 border-4 border-white/20 rounded-lg bg-white/5 backdrop-blur-sm flex items-center justify-center">
               {/* Temp Display in House */}
               <div className="absolute top-2 left-2 text-xs text-slate-300 font-mono">
                  SENSORS:<br/>
                  T: {systemState.temperature}°C<br/>
                  H: {systemState.humidity}%
               </div>

               {/* Heater Element */}
               <div className={`transition-all duration-500 absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 rounded-full ${systemState.isHeaterOn ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-slate-600'}`}></div>
               {systemState.isHeaterOn && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-red-400 font-bold animate-pulse">HEATING</div>
               )}

               {/* Fan Element */}
               <div className="absolute top-4 right-4">
                  <svg className={`w-12 h-12 text-blue-400 ${systemState.isFanOn ? 'spin-fast' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                     <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
               </div>

               {/* Window Element */}
               <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 transition-all duration-700 ${systemState.isWindowOpen ? 'bg-cyan-300 rotate-y-45 ml-[-4px] shadow-[0_0_10px_cyan]' : 'bg-slate-500'}`}></div>
               {systemState.isWindowOpen && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 text-xs font-mono">WINDOW OPEN</div>}
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full px-8">
              <div className={`text-center p-2 rounded ${systemState.isFanOn ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                FAN
              </div>
              <div className={`text-center p-2 rounded ${systemState.isHeaterOn ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                HEATER
              </div>
              <div className={`text-center p-2 rounded ${systemState.isWindowOpen ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                WINDOW
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;