import React from 'react';
import { UserProgress } from '../types';
import { Trophy, Flame, Star, Menu } from 'lucide-react';

interface HeaderProps {
  user: UserProgress;
  toggleMenu?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Trophy size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm md:text-base leading-tight">ML 판별 배틀</h1>
            <span className="text-xs text-blue-600 font-medium">Lv.{user.level} 진단 코치</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-yellow-500 space-x-1">
              <Star size={16} fill="currentColor" />
              <span className="font-bold text-gray-800">{user.xp}</span>
            </div>
            <span className="text-[10px] text-gray-500">XP</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-orange-500 space-x-1">
              <Flame size={16} fill="currentColor" />
              <span className="font-bold text-gray-800">{user.streak}</span>
            </div>
            <span className="text-[10px] text-gray-500">Day Streak</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
