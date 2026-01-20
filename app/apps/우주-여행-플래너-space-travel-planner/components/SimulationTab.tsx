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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-blue-600" />
          태양계 여행 시뮬레이션
        </h2>
        <p className="text-gray-600 text-sm">행성을 선택하고 우주선 속도를 설정한 후 여행을 시작하세요!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Solar System Map - 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              태양계 지도
            </h3>
            {selectedPlanet && (
              <div className="text-sm text-gray-600">
                선택: <span className="font-bold text-blue-600">{selectedPlanet.name}</span>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl p-6 sm:p-8 relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-2 border-blue-500/30 shadow-2xl">
            {/* Starfield Background */}
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent), radial-gradient(1px 1px at 80% 10%, white, transparent), radial-gradient(2px 2px at 90% 60%, white, transparent)', backgroundSize: '200% 200%' }}></div>
            
            {/* Nebula Effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* Sun - Enhanced */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Sun Glow */}
                <div className="absolute inset-0 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.8)] border-2 border-yellow-200">
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/50 to-transparent rounded-full"></div>
                </div>
                {/* Sun Label */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-8 text-yellow-300 font-bold text-xs sm:text-sm whitespace-nowrap rotate-90 origin-center">
                  태양
                </div>
              </div>
            </div>

            {/* Solar System Container - Improved Layout */}
            <div className="flex-1 w-full flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 pl-28 pr-6 overflow-x-auto pb-12 custom-scrollbar">
              {/* Earth (Start Point) - Enhanced */}
              <div className="flex flex-col items-center flex-shrink-0 z-20">
                <div className="relative group">
                  {/* Earth Glow */}
                  <div className="absolute inset-0 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  {/* Earth Planet */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-2xl shadow-blue-500/60 border-3 border-blue-200">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500/30 to-transparent"></div>
                    <div className="absolute inset-0 rounded-full bg-blue-400/50 animate-pulse"></div>
                  </div>
                  {/* Earth Label */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-bold text-blue-200 bg-blue-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/50 shadow-lg">
                      🌍 지구 (출발)
                    </span>
                  </div>
                </div>
              </div>

              {/* Travel Path Line - Enhanced */}
              <div className="h-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 flex-grow relative min-w-[80px] rounded-full shadow-lg shadow-blue-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>

              {/* Planets - Enhanced */}
              {PLANETS.map((planet, index) => (
                <div key={planet.id} className="relative flex flex-col items-center group flex-shrink-0">
                  {/* Orbit Ring visual - Enhanced */}
                  <div className="absolute w-48 h-48 sm:w-56 sm:h-56 border border-dashed border-blue-400/40 rounded-full top-1/2 -translate-y-1/2 -z-0 pointer-events-none">
                    <div className="absolute inset-0 border border-dashed border-purple-400/20 rounded-full"></div>
                  </div>
                  
                  {/* Planet Button - Enhanced */}
                  <button
                    onClick={() => handlePlanetClick(planet)}
                    className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full transition-all duration-300 ${planet.color} shadow-2xl border-2
                      ${selectedPlanet?.id === planet.id 
                        ? 'ring-4 ring-blue-400 scale-125 shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse border-blue-300' 
                        : 'hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 opacity-95 hover:opacity-100 border-transparent hover:border-blue-400/50'
                      }
                    `}
                  >
                    {/* Planet Glow */}
                    {selectedPlanet?.id === planet.id && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 blur-xl opacity-60 animate-pulse"></div>
                    )}
                    
                    {/* Visited Badge */}
                    {visitedPlanets.includes(planet.id) && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-xl border-2 border-white z-20">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                  
                  {/* Planet Label - Enhanced */}
                  <div className="mt-4 text-center">
                    <span className={`block text-sm sm:text-base font-bold px-2 py-1 rounded-md backdrop-blur-sm ${
                      selectedPlanet?.id === planet.id 
                        ? 'text-blue-200 bg-blue-900/60 border border-blue-400/50' 
                        : 'text-gray-200 bg-gray-900/40 border border-gray-700/50'
                    }`}>
                      {planet.name}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 block">{planet.nameEn}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rocket Animation - Enhanced */}
            {isTraveling && (
              <div className="absolute top-1/2 left-24 w-[calc(100%-9rem)] h-20 -translate-y-1/2 pointer-events-none z-30">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-75"
                  style={{ left: `${progress}%` }}
                >
                  <div className="relative">
                    {/* Rocket Trail */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-20 w-20 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 opacity-80 blur-sm"></div>
                    {/* Rocket */}
                    <Rocket className="w-12 h-12 rotate-90 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,1)] animate-bounce filter brightness-110" />
                    {/* Rocket Glow */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-400 rounded-full blur-xl opacity-50"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Control Panel - 1 column */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6 shadow-lg sticky top-24 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-200">
            <Info className="w-5 h-5 text-blue-600" />
            비행 제어 센터
          </h2>

          {selectedPlanet ? (
            <div className="space-y-5">
              {/* Planet Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedPlanet.name}</h3>
                    <p className="text-sm text-gray-600 italic">{selectedPlanet.nameEn}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${selectedPlanet.color} shadow-md`}></div>
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{selectedPlanet.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="block text-xs text-gray-500 mb-1">지구와의 거리</span>
                    <span className="font-mono text-sm font-bold text-blue-600">{selectedPlanet.distanceFromEarthKm.toLocaleString()} km</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <span className="block text-xs text-gray-500 mb-1">공전 주기</span>
                    <span className="font-mono text-sm font-bold text-gray-900">{selectedPlanet.revolutionPeriod}</span>
                  </div>
                </div>
              </div>

              {/* Speed Control */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-600" />
                  우주선 속도 설정
                </label>
                <input 
                  type="number" 
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-gray-900 font-mono text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  min="100"
                  placeholder="속도 입력"
                />
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setSpeed(900)} 
                    className="px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition text-xs font-medium text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                  >
                    보잉 747
                    <span className="block text-[10px] text-gray-500">900 km/h</span>
                  </button>
                  <button 
                    onClick={() => setSpeed(40000)} 
                    className="px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition text-xs font-medium text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                  >
                    로켓
                    <span className="block text-[10px] text-gray-500">40,000 km/h</span>
                  </button>
                  <button 
                    onClick={() => setSpeed(1079252848)} 
                    className="px-3 py-2 bg-gray-100 hover:bg-blue-100 rounded-lg transition text-xs font-medium text-gray-700 hover:text-blue-700 border border-gray-200 hover:border-blue-300"
                  >
                    빛의 속도
                    <span className="block text-[10px] text-gray-500">1,079,252,848 km/h</span>
                  </button>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={startJourney}
                disabled={isTraveling}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 text-white shadow-lg
                  ${isTraveling 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 hover:shadow-xl hover:shadow-blue-500/30'
                  }
                `}
              >
                {isTraveling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>비행 중...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    <span>여행 시작</span>
                  </>
                )}
              </button>

              {/* Travel Result */}
              {travelResult && (
                <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl text-center animate-bounce-short shadow-md">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-sm text-green-700 font-bold mb-2">도착 완료!</p>
                  <p className="text-3xl font-mono font-bold text-gray-900">{travelResult}</p>
                  <p className="text-xs text-gray-600 mt-2">소요 시간</p>
                </div>
              )}

              {/* Progress Bar (when traveling) */}
              {isTraveling && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>여행 진행 중...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-75 shadow-sm"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">행성 선택 대기 중</p>
              <p className="text-sm text-gray-500">왼쪽 지도에서 여행할 행성을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;