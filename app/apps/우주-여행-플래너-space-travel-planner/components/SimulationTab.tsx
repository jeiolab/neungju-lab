import React, { useState, useEffect } from 'react';
import { Rocket, Info, Play, CheckCircle } from 'lucide-react';
import { PLANETS } from '../constants';
import { Planet, TravelRecord } from '../types';

interface SimulationTabProps {
  onStampPassport: (record: TravelRecord) => void;
  visitedPlanets: string[];
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onStampPassport, visitedPlanets }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [speed, setSpeed] = useState<number>(50000); // Default 50,000 km/h (Rocket speed)
  const [isTraveling, setIsTraveling] = useState(false);
  const [travelResult, setTravelResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handlePlanetClick = (planet: Planet) => {
    if (isTraveling) return;
    setSelectedPlanet(planet);
    setTravelResult(null);
    setProgress(0);
  };

  const startJourney = () => {
    if (!selectedPlanet || speed <= 0) return;
    
    setIsTraveling(true);
    setTravelResult(null);
    setProgress(0);

    const duration = 2000; // Animation duration 2s
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        finishJourney();
      }
    }, interval);
  };

  const finishJourney = () => {
    if (!selectedPlanet) return;

    const timeHours = selectedPlanet.distanceFromEarthKm / speed;
    const days = Math.floor(timeHours / 24);
    const hours = Math.floor(timeHours % 24);

    setTravelResult(`${days}일 ${hours}시간`);
    setIsTraveling(false);
    
    onStampPassport({
      planetId: selectedPlanet.id,
      timestamp: Date.now(),
      travelTimeHours: timeHours,
      speedUsed: speed
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left: Solar System Map */}
      <div className="flex-1 bg-space-900 rounded-xl border border-space-700 p-6 relative min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {/* Sun */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-48 bg-yellow-500 blur-md rounded-r-full opacity-80"></div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold -rotate-90">SUN</div>

        {/* Orbit Lines & Planets */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8 w-full justify-start pl-12 overflow-x-auto pb-4 custom-scrollbar">
           {/* Earth (Start Point) */}
           <div className="flex flex-col items-center flex-shrink-0 z-10">
            <div className="w-8 h-8 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] border-2 border-blue-300 relative">
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-blue-300">지구</span>
            </div>
           </div>

           {/* Travel Path Line */}
           <div className="h-0.5 bg-gray-700 flex-grow relative min-w-[50px]"></div>

           {PLANETS.map((planet) => (
             <div key={planet.id} className="relative flex flex-col items-center group flex-shrink-0">
               {/* Orbit Ring visual */}
               <div className="absolute w-32 h-32 border border-gray-800 rounded-full top-1/2 -translate-y-1/2 -z-0 pointer-events-none"></div>
               
               <button
                 onClick={() => handlePlanetClick(planet)}
                 className={`relative z-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 ${planet.color} 
                   ${selectedPlanet?.id === planet.id ? 'ring-4 ring-space-accent scale-110 shadow-[0_0_15px_rgba(56,189,248,0.6)]' : 'hover:scale-110 opacity-80 hover:opacity-100'}
                 `}
               >
                 {visitedPlanets.includes(planet.id) && (
                   <div className="absolute -top-1 -right-1 bg-space-success rounded-full p-0.5">
                     <CheckCircle size={10} className="text-black" />
                   </div>
                 )}
               </button>
               <span className={`mt-2 text-xs sm:text-sm font-medium ${selectedPlanet?.id === planet.id ? 'text-space-accent' : 'text-gray-400'}`}>
                 {planet.name}
               </span>
             </div>
           ))}
        </div>

        {/* Rocket Animation */}
        {isTraveling && (
          <div className="absolute top-1/2 left-12 w-[calc(100%-6rem)] h-12 -translate-y-1/2 pointer-events-none z-20">
             <div 
               className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 text-space-accent"
               style={{ left: `${progress}%` }}
             >
               <Rocket className="w-8 h-8 rotate-90 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
               <div className="w-12 h-1 bg-gradient-to-r from-transparent to-space-accent absolute top-1/2 -translate-y-1/2 -left-12 opacity-50"></div>
             </div>
          </div>
        )}
      </div>

      {/* Right: Control Panel */}
      <div className="w-full lg:w-80 bg-space-800 rounded-xl border border-space-700 p-6 flex flex-col gap-6 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-space-accent" />
          비행 제어 센터
        </h2>

        {selectedPlanet ? (
          <>
            <div className="space-y-4">
              <div className="bg-space-900 p-4 rounded-lg border border-space-700">
                <h3 className="text-2xl font-bold text-white mb-1">{selectedPlanet.name} <span className="text-sm text-gray-500 font-normal">({selectedPlanet.nameEn})</span></h3>
                <p className="text-sm text-gray-400 mb-3">{selectedPlanet.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div className="bg-space-800 p-2 rounded">
                    <span className="block text-gray-500">지구와의 거리</span>
                    <span className="font-mono text-space-accent">{selectedPlanet.distanceFromEarthKm.toLocaleString()} km</span>
                  </div>
                  <div className="bg-space-800 p-2 rounded">
                    <span className="block text-gray-500">공전 주기</span>
                    <span className="font-mono">{selectedPlanet.revolutionPeriod}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">우주선 속도 (km/h)</label>
                <input 
                  type="number" 
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full bg-space-900 border border-space-700 rounded-lg p-3 text-white font-mono focus:ring-2 focus:ring-space-accent outline-none transition-all"
                  min="100"
                />
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setSpeed(900)} className="px-2 py-1 bg-space-700 rounded hover:bg-space-600 transition">보잉 747 (900)</button>
                  <button onClick={() => setSpeed(40000)} className="px-2 py-1 bg-space-700 rounded hover:bg-space-600 transition">로켓 (40,000)</button>
                  <button onClick={() => setSpeed(1079252848)} className="px-2 py-1 bg-space-700 rounded hover:bg-space-600 transition">빛의 속도</button>
                </div>
              </div>

              <button
                onClick={startJourney}
                disabled={isTraveling}
                className={`w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-95
                  ${isTraveling ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-space-accent/20'}
                `}
              >
                {isTraveling ? '비행 중...' : (
                  <>
                    <Rocket className="w-5 h-5" />
                    여행 시작 (Launch)
                  </>
                )}
              </button>

              {travelResult && (
                <div className="mt-4 p-4 bg-space-success/10 border border-space-success/30 rounded-lg text-center animate-bounce-short">
                  <p className="text-sm text-space-success font-semibold mb-1">도착 완료!</p>
                  <p className="text-2xl font-mono text-white">{travelResult}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-10">
            <Rocket className="w-12 h-12 mb-4 opacity-30" />
            <p>지도에서 여행할 행성을<br/>선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;