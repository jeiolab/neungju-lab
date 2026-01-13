import React from 'react';
import { UserStats } from '../types';
import { LEVEL_TITLES } from '../constants';
import { Trophy, Flame, Zap } from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const levelTitle = LEVEL_TITLES[stats.level - 1] || '통신 전문가';
  
  // XP calculation for progress bar
  let progressPercent = 0;
  if (stats.level === 1) progressPercent = Math.min((stats.xp / 100) * 100, 100);
  else if (stats.level === 2) progressPercent = Math.min(((stats.xp - 100) / 200) * 100, 100);
  else progressPercent = 100;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 z-10">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600 ring-1 ring-blue-100">
            <Trophy size={24} />
          </div>
          <div>
            <h1 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {stats.level}</h1>
            <span className="text-xl font-bold text-gray-900 leading-none">{levelTitle}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-3 py-1.5 rounded-full">
             <Flame className="w-5 h-5 mr-1.5 fill-orange-500" />
             <span>{stats.streak}일 연속</span>
           </div>
           <div className="flex items-center text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-full">
             <Zap className="w-5 h-5 mr-1.5 fill-indigo-600" />
             <span>{stats.xp} XP</span>
           </div>
        </div>
      </div>
      
      {/* XP Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </header>
  );
};

export default Header;