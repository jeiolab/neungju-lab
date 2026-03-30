import React from 'react';
import { UserStats } from '../types';

interface LevelBadgeProps {
  stats: UserStats;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({ stats }) => {
  // Simple EXP calculation: 100 xp per level
  const progress = (stats.exp % 100); 

  return (
    <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
          Lv.{stats.level}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Data Scientist</span>
        <div className="w-24 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelBadge;
