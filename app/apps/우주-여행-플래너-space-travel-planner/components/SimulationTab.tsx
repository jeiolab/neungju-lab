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

          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 relative min-h-[500px] flex items-center justify-center overflow-hidden border border-gray-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, gray 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Sun */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <div className="relative">
                <div className="w-20 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 blur-lg rounded-r-full opacity-70"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-2 text-yellow-600 font-bold text-sm -rotate-90 whitespace-nowrap">태양</div>
              </div>
            </div>

            {/* Solar System Container */}
            <div className="flex-1 flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 pl-20 pr-4 overflow-x-auto pb-8 custom-scrollbar">
              {/* Earth (Start Point) */}
              <div className="flex flex-col items-center flex-shrink-0 z-10">
                <div className="relative group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50 border-3 border-blue-300 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-pulse opacity-50"></div>
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs sm:text-sm font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full border border-blue-300">지구 (출발)</span>
                  </div>
                </div>
              </div>

              {/* Travel Path Line */}
              <div className="h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 flex-grow relative min-w-[60px] rounded-full"></div>

              {/* Planets */}
              {PLANETS.map((planet, index) => (
                <div key={planet.id} className="relative flex flex-col items-center group flex-shrink-0">
                  {/* Orbit Ring visual */}
                  <div className="absolute w-40 h-40 sm:w-48 sm:h-48 border-2 border-dashed border-gray-300 rounded-full top-1/2 -translate-y-1/2 -z-0 pointer-events-none opacity-30"></div>
                  
                  <button
                    onClick={() => handlePlanetClick(planet)}
                    className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition-all duration-300 ${planet.color} shadow-lg
                      ${selectedPlanet?.id === planet.id 
                        ? 'ring-4 ring-blue-500 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse' 
                        : 'hover:scale-110 hover:shadow-xl opacity-90 hover:opacity-100'
                      }
                    `}
                  >
                    {visitedPlanets.includes(planet.id) && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg border-2 border-white">
                        <CheckCircle size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                  <div className="mt-3 text-center">
                    <span className={`block text-xs sm:text-sm font-bold ${selectedPlanet?.id === planet.id ? 'text-blue-600' : 'text-gray-700'}`}>
                      {planet.name}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">{planet.nameEn}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Rocket Animation */}
            {isTraveling && (
              <div className="absolute top-1/2 left-20 w-[calc(100%-8rem)] h-16 -translate-y-1/2 pointer-events-none z-30">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-75"
                  style={{ left: `${progress}%` }}
                >
                  <div className="relative">
                    <Rocket className="w-10 h-10 rotate-90 text-blue-600 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-bounce" />
                    <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 opacity-70"></div>
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