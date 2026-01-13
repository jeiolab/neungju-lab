import React from 'react';
import { Award, Droplets, Waves } from 'lucide-react';
import { Badge } from '../types';

interface HeaderProps {
  cleanedArea: number;
  badges: Badge[];
}

const Header: React.FC<HeaderProps> = ({ cleanedArea, badges }) => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Ocean Clean AI</h1>
            <p className="text-xs text-slate-500 font-medium">엔지니어 모드: 활성</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="text-[10px] text-blue-400 font-bold uppercase">정화된 면적</span>
              <span className="text-sm font-bold text-blue-700 leading-none">{cleanedArea} m²</span>
            </div>
          </div>

          <div className="flex gap-2">
            {badges.map((badge) => (
              <div 
                key={badge.id} 
                className={`relative group p-1.5 rounded-full border transition-all duration-300 ${badge.unlocked ? 'bg-yellow-50 border-yellow-200 cursor-help' : 'bg-gray-50 border-gray-100 opacity-50'}`}
                title={badge.unlocked ? badge.description : '잠긴 배지'}
              >
                <span className="text-lg" role="img" aria-label={badge.name}>{badge.icon}</span>
                {badge.unlocked && (
                   <div className="absolute top-full mt-2 right-0 w-48 bg-gray-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                     <p className="font-bold text-yellow-300 mb-1">{badge.name}</p>
                     {badge.description}
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;