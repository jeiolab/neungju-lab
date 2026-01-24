import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Wind, Lightbulb } from 'lucide-react';

const TabSimulation: React.FC = () => {
  const [lux, setLux] = useState<number>(300);
  const [temp, setTemp] = useState<number>(24);
  const [isBlindsClosed, setIsBlindsClosed] = useState<boolean>(false);
  const [isAcOn, setIsAcOn] = useState<boolean>(false);
  const [isLightOn, setIsLightOn] = useState<boolean>(false);

  // Simulation Logic
  useEffect(() => {
    // If it's too bright (> 700 lux), close blinds.
    // If it's too dark (< 200 lux), turn on lights.
    if (lux > 700) {
      setIsBlindsClosed(true);
      setIsLightOn(false);
    } else if (lux < 200) {
      setIsBlindsClosed(false);
      setIsLightOn(true);
    } else {
      setIsBlindsClosed(false);
      setIsLightOn(false);
    }

    // If temp > 28, turn AC on.
    if (temp > 28) {
      setIsAcOn(true);
    } else {
      setIsAcOn(false);
    }
  }, [lux, temp]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">우리 반 교실 자동화 실험실</h2>
        <p className="text-slate-600">
          센서 값을 조절하여 교실의 액추에이터(블라인드, 에어컨, 전등)가 어떻게 반응하는지 관찰해보세요.
          <br/>
          <span className="text-sm text-indigo-600 font-medium">Tip: 온도를 높이거나 빛을 아주 밝게/어둡게 조절해보세요.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded">INPUT</span>
            센서 데이터 조절
          </h3>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-2 text-slate-700 font-medium">
                <Sun className="w-5 h-5 text-orange-500" /> 조도 센서 (Lux)
              </label>
              <span className="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-md min-w-[60px] text-center">
                {lux}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={lux}
              onChange={(e) => setLux(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>어두움 (밤)</span>
              <span>밝음 (낮)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center gap-2 text-slate-700 font-medium">
                <Thermometer className="w-5 h-5 text-red-500" /> 온도 센서 (°C)
              </label>
              <span className="text-slate-900 font-bold bg-slate-100 px-3 py-1 rounded-md min-w-[60px] text-center">
                {temp}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="1"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
             <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>시원함</span>
              <span>더움</span>
            </div>
          </div>
        </div>

        {/* Visualization Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 relative min-h-[400px]">
           <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded">OUTPUT</span>
            교실 상태 모니터링
          </h3>

          {/* Room visual */}
          <div className="relative w-full h-64 bg-slate-100 border-2 border-slate-300 rounded-lg overflow-hidden flex flex-col items-center justify-center transition-colors duration-700"
               style={{ backgroundColor: isLightOn ? '#fffbeb' : '#f1f5f9' }}
          >
            {/* Window & Blinds */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-sky-200 border-4 border-slate-400 rounded-lg overflow-hidden">
               <div className={`w-full bg-slate-600 transition-all duration-1000 ease-in-out absolute top-0 left-0 ${isBlindsClosed ? 'h-full opacity-90' : 'h-0 opacity-0'}`}></div>
               {/* Sun visualization through window */}
               {!isBlindsClosed && lux > 500 && (
                   <div className="absolute top-1 right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
               )}
            </div>
            <div className="absolute top-28 right-8 text-xs font-bold text-slate-500 text-center w-16">
                {isBlindsClosed ? '블라인드 닫힘' : '블라인드 열림'}
            </div>

            {/* AC Unit */}
            <div className="absolute top-4 left-4 w-28 h-16 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-between px-2 shadow-sm">
                <div className="flex flex-col gap-1">
                    <div className="w-12 h-1 bg-slate-200 rounded"></div>
                    <div className="w-12 h-1 bg-slate-200 rounded"></div>
                    <div className="w-12 h-1 bg-slate-200 rounded"></div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAcOn ? 'bg-blue-100 text-blue-500 animate-spin-slow' : 'bg-slate-100 text-slate-300'}`}>
                    <Wind className="w-5 h-5" />
                </div>
            </div>
            <div className={`absolute top-20 left-4 text-xs font-bold w-28 text-center transition-colors ${isAcOn ? 'text-blue-600' : 'text-slate-400'}`}>
                {isAcOn ? '에어컨 작동 중' : '에어컨 대기'}
            </div>

             {/* Light Bulb */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <Lightbulb className={`w-12 h-12 transition-colors duration-300 ${isLightOn ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]' : 'text-slate-300'}`} />
                 <span className="text-xs font-bold text-slate-500 mt-2">{isLightOn ? '전등 켜짐' : '전등 꺼짐'}</span>
             </div>

             {/* Logic Visualization Overlay */}
             <div className="absolute bottom-2 left-0 w-full px-4">
                <div className="bg-black/5 p-2 rounded text-[10px] font-mono text-slate-600">
                    <div className={isBlindsClosed ? 'text-indigo-600 font-bold' : ''}>IF (Lux &gt; 700) THEN Close_Blinds()</div>
                    <div className={isLightOn ? 'text-indigo-600 font-bold' : ''}>IF (Lux &lt; 200) THEN Turn_On_Lights()</div>
                    <div className={isAcOn ? 'text-red-600 font-bold' : ''}>IF (Temp &gt; 28) THEN Turn_On_AC()</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;