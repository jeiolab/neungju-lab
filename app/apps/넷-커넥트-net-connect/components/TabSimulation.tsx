import React, { useState } from 'react';
import { SIMULATION_ITEMS, TECH_DATA } from '../constants';
import { SimulationItem, TechType } from '../types';
import { Smartphone, Headphones, Wifi, Bus, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

const IconMap = ({ name, className }: { name: string; className: string }) => {
  if (name === 'Headphones') return <Headphones className={className} />;
  if (name === 'Router') return <Wifi className={className} />;
  if (name === 'Bus') return <Bus className={className} />;
  if (name === 'Car') return <CreditCard className={className} />; // Using card for generic RFID/Pass representation
  return <div className={className} />;
};

export const TabSimulation: React.FC<Props> = ({ onSuccess }) => {
  const [selectedItem, setSelectedItem] = useState<SimulationItem | null>(null);
  const [connections, setConnections] = useState<{ itemId: string; tech: TechType }[]>([]);
  const [message, setMessage] = useState<string>("주변 기기를 클릭하여 스마트폰과 연결해보세요!");

  const handleItemClick = (item: SimulationItem) => {
    if (connections.find(c => c.itemId === item.id)) return; // Already connected
    setSelectedItem(item);
    setMessage(`${item.name}을(를) 스마트폰에 연결하려면 어떤 기술이 필요할까요? 스마트폰을 클릭하세요.`);
  };

  const handlePhoneClick = () => {
    if (!selectedItem) {
      setMessage("먼저 주변 기기를 선택해주세요.");
      return;
    }

    // Logic: In a full game, we might ask user to select tech from a menu.
    // For this simulation, we'll auto-connect if they click phone, but show the tech used.
    
    setConnections([...connections, { itemId: selectedItem.id, tech: selectedItem.tech }]);
    const techName = TECH_DATA.find(t => t.id === selectedItem.tech)?.name || selectedItem.tech;
    
    setMessage(`성공! ${selectedItem.name}이(가) ${techName} 기술로 연결되었습니다.`);
    setSelectedItem(null);
    onSuccess();
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">연결 시뮬레이션</h2>
      <p className="text-slate-600 mb-8 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
        {message}
      </p>

      <div className="relative w-full max-w-lg aspect-square bg-slate-100 rounded-3xl border-4 border-slate-200 overflow-hidden shadow-inner">
        {/* Central Phone */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform active:scale-95"
          onClick={handlePhoneClick}
        >
          <div className={`w-24 h-44 bg-slate-800 rounded-3xl border-4 border-slate-600 shadow-xl flex items-center justify-center ${selectedItem ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
            <Smartphone className="text-white w-12 h-12" />
          </div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-bold text-slate-700 w-full text-center">내 스마트폰</span>
        </div>

        {/* Connections (Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((conn) => {
            const item = SIMULATION_ITEMS.find(i => i.id === conn.itemId);
            if (!item) return null;
            return (
              <g key={conn.itemId}>
                <line 
                  x1={`${item.x}%`} y1={`${item.y}%`} 
                  x2="50%" y2="50%" 
                  stroke={
                    conn.tech === TechType.BLUETOOTH ? '#3b82f6' : 
                    conn.tech === TechType.WIFI ? '#10b981' : 
                    conn.tech === TechType.NFC ? '#f59e0b' : '#8b5cf6'
                  }
                  strokeWidth="4" 
                  strokeDasharray="8"
                  className="animate-[dash_1s_linear_infinite]"
                />
                <circle cx="50%" cy="50%" r="4" fill="white" />
              </g>
            );
          })}
        </svg>

        {/* Peripherals */}
        {SIMULATION_ITEMS.map((item) => {
          const isConnected = connections.find(c => c.itemId === item.id);
          return (
            <div
              key={item.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300
                ${isConnected ? 'opacity-50 scale-90' : 'hover:scale-110'}
                ${selectedItem?.id === item.id ? 'ring-4 ring-indigo-500 rounded-full' : ''}
              `}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              onClick={() => handleItemClick(item)}
            >
              <div className={`p-4 rounded-full shadow-lg ${isConnected ? 'bg-slate-200' : 'bg-white'}`}>
                <IconMap name={item.icon} className={`w-8 h-8 ${isConnected ? 'text-slate-400' : 'text-indigo-600'}`} />
              </div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 px-2 py-1 rounded text-xs font-bold shadow-sm">
                {item.name}
                {isConnected && <CheckCircle className="inline ml-1 w-3 h-3 text-green-500"/>}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div>블루투스</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div>와이파이</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div>NFC</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div>RFID</div>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -16;
          }
        }
      `}</style>
    </div>
  );
};
