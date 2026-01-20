import React from 'react';
import { UserStats, Badge } from '../types';
import { Trophy, Flame, Star, Award } from 'lucide-react';
import { BADGES } from '../constants';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const progressToNextLevel = (stats.xp % 100); // 100 XP per level

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            B
          </div>
          <h1 className="font-bold text-slate-800 hidden sm:block">그릇 매칭 랩</h1>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {/* XP & Level */}
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 text-indigo-700">
               <Star size={16} className="fill-indigo-700" />
               <span>Lv.{stats.level}</span>
             </div>
             <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
               <div 
                 className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                 style={{ width: `${progressToNextLevel}%` }}
               />
             </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
            <Flame size={16} className={stats.streak > 0 ? "fill-orange-600 animate-pulse" : ""} />
            <span>{stats.streak}일</span>
          </div>

          {/* Badge Count */}
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md cursor-help" title="획득한 배지">
             <Award size={16} />
             <span>{stats.badges.length}/{BADGES.length}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;