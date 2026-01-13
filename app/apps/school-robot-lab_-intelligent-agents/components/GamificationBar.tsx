import React from 'react';
import { Badge } from '../types';
import { Trophy, Star, Calendar } from 'lucide-react';

interface Props {
  xp: number;
  badges: Badge[];
  streak: number;
}

const GamificationBar: React.FC<Props> = ({ xp, badges, streak }) => {
  const earnedBadges = badges.filter(b => b.earned);
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Level & XP */}
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Level {level}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="hidden sm:flex items-center text-sm font-medium text-gray-700">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            {xp} XP
          </div>
        </div>

        {/* Center: Title (Mobile only mostly, or simplified) */}
        <div className="hidden md:block font-bold text-lg text-slate-800">
          🤖 우리 학교 로봇 실험실
        </div>

        {/* Right: Badges & Streak */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{streak}일 연속</span>
          </div>
          
          <div className="relative group">
            <div className="flex items-center text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full text-sm cursor-pointer">
              <Trophy className="w-4 h-4 mr-1" />
              <span>{earnedBadges.length}/{badges.length}</span>
            </div>
            
            {/* Badge Tooltip Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 hidden group-hover:block transition-opacity opacity-0 group-hover:opacity-100 duration-200 pointer-events-none group-hover:pointer-events-auto">
              <h4 className="text-sm font-bold text-gray-800 mb-2">보유 뱃지</h4>
              <div className="space-y-2">
                {badges.map(badge => (
                  <div key={badge.id} className={`flex items-center p-2 rounded-md ${badge.earned ? 'bg-indigo-50' : 'bg-gray-50 opacity-50'}`}>
                    <span className="text-xl mr-3">{badge.icon}</span>
                    <div>
                      <p className={`text-xs font-bold ${badge.earned ? 'text-indigo-700' : 'text-gray-500'}`}>{badge.name}</p>
                      <p className="text-[10px] text-gray-400 leading-tight">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GamificationBar;