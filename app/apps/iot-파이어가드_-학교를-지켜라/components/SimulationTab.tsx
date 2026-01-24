import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, AlertTriangle, ShieldCheck, Flame, Settings } from 'lucide-react';
import { Difficulty } from '../types';

interface SimulationTabProps {
  onSuccess: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onSuccess }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [temperature, setTemperature] = useState<number>(25);
  const [threshold, setThreshold] = useState<number>(50);
  const [smokeDetected, setSmokeDetected] = useState<boolean>(false);
  const [customAlert, setCustomAlert] = useState<string>("화재 발생! 대피하세요!");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Determine if alarm should trigger based on difficulty logic
  const isAlarmActive = useMemo(() => {
    if (difficulty === 'EASY' || difficulty === 'NORMAL') {
      return temperature >= threshold;
    } else {
      // HARD mode: Needs both heat AND smoke
      return temperature >= threshold && smokeDetected;
    }
  }, [temperature, threshold, smokeDetected, difficulty]);

  useEffect(() => {
    if (isAlarmActive) {
      onSuccess();
    }
  }, [isAlarmActive, onSuccess]);

  // Default threshold for Easy mode
  useEffect(() => {
    if (difficulty === 'EASY') {
      setThreshold(50);
    }
  }, [difficulty]);

  return (
    <div className={`h-full flex flex-col md:flex-row gap-6 p-4 max-w-6xl mx-auto transition-colors duration-500 ${isAlarmActive ? 'bg-red-50' : 'bg-transparent'}`}>
      
      {/* Control Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              제어 패널 (Control Panel)
            </h2>
            <select 
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                setSmokeDetected(false); // reset smoke on change
              }}
              className="bg-slate-100 text-slate-700 text-sm font-medium py-1 px-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="EASY">난이도: 쉬움 (온도)</option>
              <option value="NORMAL">난이도: 보통 (임계값 설정)</option>
              <option value="HARD">난이도: 도전 (복합 조건)</option>
            </select>
          </div>

          <div className="space-y-8">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-600">현재 온도</label>
                <span className={`text-lg font-bold ${temperature >= threshold ? 'text-red-600' : 'text-blue-600'}`}>
                  {temperature}°C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0°C</span>
                <span>50°C</span>
                <span>100°C</span>
              </div>
            </div>

            {/* Threshold Slider (Disabled in Easy) */}
            <div className={`transition-opacity duration-300 ${difficulty === 'EASY' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-slate-600">화재 인식 온도 (임계값)</label>
                <span className="text-lg font-bold text-slate-700">{threshold}°C</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
              <p className="text-xs text-slate-500 mt-2">
                {difficulty === 'EASY' 
                  ? "쉬움 모드에서는 임계값이 50°C로 고정됩니다." 
                  : "이 온도 이상이 되면 경보가 울립니다."}
              </p>
            </div>

            {/* Smoke Toggle (Hard mode only) */}
            {difficulty === 'HARD' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className={`w-5 h-5 ${smokeDetected ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="font-semibold text-slate-700">연기 감지 센서</span>
                  </div>
                  <button
                    onClick={() => setSmokeDetected(!smokeDetected)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${smokeDetected ? 'bg-orange-500' : 'bg-slate-200'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${smokeDetected ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  도전 모드에서는 <strong>온도</strong>와 <strong>연기</strong>가 모두 감지되어야 경보가 울립니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Code View */}
        <div className="bg-slate-900 rounded-xl p-6 shadow-lg font-mono text-sm overflow-hidden border border-slate-700">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-400 ml-2">logic.ts</span>
          </div>
          <div className="text-slate-300">
            <p><span className="text-purple-400">const</span> <span className="text-blue-400">temperature</span> = <span className="text-green-400">{temperature}</span>;</p>
            <p><span className="text-purple-400">const</span> <span className="text-blue-400">threshold</span> = <span className="text-green-400">{threshold}</span>;</p>
            {difficulty === 'HARD' && (
               <p><span className="text-purple-400">const</span> <span className="text-blue-400">isSmoke</span> = <span className="text-green-400">{smokeDetected.toString()}</span>;</p>
            )}
            <br/>
            <p><span className="text-slate-500">// 감지 로직</span></p>
            <p>
              <span className="text-purple-400">if</span> (
              {difficulty === 'HARD' ? (
                <span>
                  <span className="text-blue-400">temperature</span> &gt;= <span className="text-blue-400">threshold</span> <span className="text-red-400">&&</span> <span className="text-blue-400">isSmoke</span>
                </span>
              ) : (
                <span>
                  <span className="text-blue-400">temperature</span> &gt;= <span className="text-blue-400">threshold</span>
                </span>
              )}
              ) {'{'}
            </p>
            <p className="pl-4">
              <span className="text-yellow-400">status</span> = <span className="text-green-400">"DANGER"</span>;
            </p>
            <p className="pl-4">
              <span className="text-yellow-400">triggerAlarm</span>();
            </p>
            <p>{'}'} <span className="text-purple-400">else</span> {'{'}</p>
            <p className="pl-4">
              <span className="text-yellow-400">status</span> = <span className="text-green-400">"SAFE"</span>;
            </p>
            <p>{'}'}</p>
          </div>
        </div>
      </div>

      {/* Visual Feedback Area */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div className={`flex-1 rounded-2xl shadow-lg border p-8 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden ${
          isAlarmActive 
            ? 'bg-red-600 border-red-700 siren-light' 
            : 'bg-white border-slate-200'
        }`}>
          {/* Custom Message Config */}
          <div className="absolute top-4 right-4 z-10">
            {isEditMode ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customAlert} 
                  onChange={(e) => setCustomAlert(e.target.value)}
                  className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-800"
                  placeholder="경고 메시지 입력"
                />
                <button onClick={() => setIsEditMode(false)} className="text-xs bg-green-500 text-white px-2 rounded">저장</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditMode(true)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${isAlarmActive ? 'bg-red-700 text-white border-red-500' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                메시지 변경
              </button>
            )}
          </div>

          <div className="relative z-10">
            {isAlarmActive ? (
              <>
                <div className="animate-pulse-fast mb-6">
                  <AlertTriangle className="w-32 h-32 text-white mx-auto" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 animate-bounce">
                  {customAlert}
                </h2>
                <p className="text-white/80 font-medium text-lg">
                  설정 온도({threshold}°C) 초과!
                </p>
                <div className="mt-8 flex justify-center">
                   <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                     <Volume2 className="w-12 h-12 text-white animate-pulse" />
                   </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6 transition-all duration-500 transform hover:scale-105">
                  <ShieldCheck className="w-32 h-32 text-green-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-slate-700 mb-2">
                  상태: 안전함
                </h2>
                <p className="text-slate-500">
                  현재 온도가 설정값보다 낮습니다.<br/>
                  시스템이 정상 작동 중입니다.
                </p>
              </>
            )}
          </div>

          {/* Background overlay for heat visualization */}
          <div 
            className="absolute bottom-0 left-0 w-full bg-red-500/10 transition-all duration-300 pointer-events-none"
            style={{ height: `${temperature}%` }}
          />
        </div>

        {/* Status Data */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
             <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">System Status</div>
             <div className={`text-lg font-bold mt-1 ${isAlarmActive ? 'text-red-600' : 'text-green-600'}`}>
               {isAlarmActive ? 'CRITICAL' : 'MONITORING'}
             </div>
           </div>
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
             <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sensor Input</div>
             <div className="text-lg font-bold text-slate-800 mt-1">
               {temperature}°C
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
