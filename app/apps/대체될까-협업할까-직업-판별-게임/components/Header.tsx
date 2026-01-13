import React from 'react';
import { UserStats, Badge } from '../types';
import { BADGES } from '../constants';
import * as Lucide from 'lucide-react';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const nextLevelXp = stats.level * 100;
  const progress = Math.min((stats.xp % 100) / 100, 1) * 100;
  
  // Get latest 3 badges
  const earnedBadges = BADGES.filter(b => stats.badges.includes(b.id)).slice(-3);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Level & XP */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-50 text-blue-700 font-bold text-lg">
              {stats.level}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded-full text-yellow-900 border border-yellow-200 shadow-sm">
              LV
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-gray-800 text-sm">진로 탐험가</span>
              <span className="text-xs text-gray-500">{stats.xp} XP</span>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges & Streak */}
        <div className="flex items-center space-x-4">
           {/* Streak */}
           <div className="hidden sm:flex items-center text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
              <Lucide.Flame size={16} className="mr-1 fill-orange-500" />
              <span className="font-bold text-sm">{stats.streak}일</span>
           </div>

           {/* Badges */}
           <div className="flex space-x-1">
             {earnedBadges.map(badge => {
               const IconComponent = (Lucide as any)[badge.icon] || Lucide.Award;
               return (
                 <div key={badge.id} className="group relative">
                   <div className="p-1.5 bg-yellow-50 rounded-full border border-yellow-200 text-yellow-600">
                     <IconComponent size={16} />
                   </div>
                   {/* Tooltip */}
                   <div className="absolute top-full right-0 mt-2 w-32 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                     {badge.name}
                   </div>
                 </div>
               );
             })}
             {earnedBadges.length === 0 && (
               <div className="text-xs text-gray-400 italic">배지 도전 중...</div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Header;