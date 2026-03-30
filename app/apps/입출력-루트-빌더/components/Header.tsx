import React from 'react';
import { BADGES } from '../constants';
import { UserState } from '../types';
import { Trophy, Star } from 'lucide-react';

interface HeaderProps {
  userState: UserState;
}

const Header: React.FC<HeaderProps> = ({ userState }) => {
  const currentBadge = BADGES.slice().reverse().find(b => userState.xp >= (b.condition(userState.xp) ? 0 : 9999)) 
                     || BADGES.find(b => b.condition(userState.xp));

  // Determine actual unlocked badges
  const unlockedBadges = BADGES.filter(b => b.condition(userState.xp));

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="font-bold text-lg md:text-xl text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white p-1 rounded text-sm font-mono">I/O</span>
          루트 빌더
        </h1>

        <div className="flex items-center space-x-4">
          {/* XP Bar */}
          <div className="flex flex-col items-end">
             <div className="flex items-center text-sm font-bold text-yellow-600">
               <Star size={16} className="fill-current mr-1" />
               {userState.xp} XP
             </div>
             <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
               <div 
                 className="h-full bg-yellow-400 transition-all duration-500" 
                 style={{ width: `${Math.min((userState.xp % 100) + 10, 100)}%` }} // Simplified visual progress
               ></div>
             </div>
          </div>

          {/* Badges */}
          <div className="flex items-center space-x-1">
             {unlockedBadges.map(badge => (
               <span key={badge.id} title={badge.name} className="text-xl cursor-help hover:scale-125 transition-transform">
                 {badge.icon}
               </span>
             ))}
             {unlockedBadges.length === 0 && <span className="text-gray-300 text-xs">No Badges</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
