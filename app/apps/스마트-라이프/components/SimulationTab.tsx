import React, { useState } from 'react';
import { Music, Zap, Bot, Box, Plus, CheckCircle, RotateCcw } from 'lucide-react';
import { SMART_DEVICES } from '../constants';
import { SmartDevice } from '../types';

const SimulationTab: React.FC = () => {
  const [placedDevices, setPlacedDevices] = useState<SmartDevice[]>([]);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleAddDevice = (device: SmartDevice) => {
    if (placedDevices.find(d => d.id === device.id)) return;

    setPlacedDevices([...placedDevices, device]);
    setLastActionMessage(device.effectMessage);
    setShowPopup(true);

    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleReset = () => {
    setPlacedDevices([]);
    setLastActionMessage(null);
    setShowPopup(false);
  };

  const totalScore = placedDevices.reduce((acc, curr) => acc + curr.score, 0);
  const progress = Math.min((totalScore / 90) * 100, 100);

  const getDeviceIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'Speaker': return <Music className={className} />;
      case 'Vacuum': return <Bot className={className} />;
      case 'Light': return <Zap className={className} />;
      case 'Fridge': return <Box className={className} />;
      default: return <Box className={className} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left: Room Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col border border-gray-200 relative">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">나의 스마트 홈</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-indigo-600">{totalScore}점 / 90점</span>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            title="초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Room Visual */}
        <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center relative group">
          <div className="absolute inset-0 bg-white/60 group-hover:bg-white/50 transition-all backdrop-blur-[2px]"></div>
          
          <div className="absolute inset-0 p-8 grid grid-cols-2 gap-4 place-content-center">
             {placedDevices.length === 0 && (
               <div className="col-span-2 text-center text-gray-500 font-medium py-10 bg-white/60 rounded-xl backdrop-blur-sm border-2 border-dashed border-gray-300">
                 오른쪽 메뉴에서 기기를 선택해<br/>이 방을 채워주세요!
               </div>
             )}
             
             {placedDevices.map((device) => (
               <div key={device.id} className="bg-white/90 p-4 rounded-xl shadow-lg border-2 border-indigo-100 flex items-center gap-3 animate-bounce-in">
                 <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                   {getDeviceIcon(device.iconName)}
                 </div>
                 <div>
                   <p className="font-bold text-gray-800 text-sm">{device.name}</p>
                   <p className="text-xs text-indigo-600 font-semibold">+편리함 {device.score}</p>
                 </div>
               </div>
             ))}
          </div>

          {/* Popup Notification */}
          {showPopup && lastActionMessage && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-slide-up w-max max-w-[90%]">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm font-medium">{lastActionMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Device Shop */}
      <div className="w-full lg:w-80 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col">
        <div className="p-6 border-b">
          <h3 className="font-bold text-xl text-gray-800">기기 목록</h3>
          <p className="text-sm text-gray-500 mt-1">클릭해서 설치하세요</p>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {SMART_DEVICES.map((device) => {
            const isPlaced = placedDevices.some(d => d.id === device.id);
            return (
              <button
                key={device.id}
                onClick={() => handleAddDevice(device)}
                disabled={isPlaced}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative group
                  ${isPlaced 
                    ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.02]'
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className={`p-2 rounded-lg ${isPlaced ? 'bg-gray-200' : 'bg-blue-50 text-blue-600'}`}>
                    {getDeviceIcon(device.iconName)}
                  </div>
                  {isPlaced ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">설치됨</span>
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                  )}
                </div>
                <h4 className="font-bold text-gray-800">{device.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{device.description}</p>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SimulationTab;