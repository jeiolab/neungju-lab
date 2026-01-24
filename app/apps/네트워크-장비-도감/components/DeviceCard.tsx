import React from 'react';
import { DeviceInfo } from '../types';

interface DeviceCardProps {
  device: DeviceInfo;
  isActive: boolean;
  onClick: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, isActive, onClick }) => {
  const Icon = device.icon;
  
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-4 rounded-xl transition-all duration-300 border-2 shadow-sm group
        ${isActive 
          ? `border-blue-600 bg-blue-50 ring-2 ring-blue-200 ring-offset-2 scale-[1.02]` 
          : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-md'
        }
      `}
      aria-pressed={isActive}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${device.color} shrink-0`}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            {device.name}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">{device.metaphor}</p>
        </div>
      </div>
      
      {/* Mobile-friendly expanded content visible only when active */}
      <div className={`mt-4 overflow-hidden transition-all duration-300 ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
         <p className="text-slate-700 text-sm leading-relaxed">{device.description}</p>
         <div className="mt-2 inline-block px-2 py-1 bg-slate-800 text-white text-xs rounded font-mono">
            Key: {device.techKey}
         </div>
      </div>
    </button>
  );
};