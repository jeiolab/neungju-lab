import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Star, Flame, Zap } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
             <Zap className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-none">에이전트 카드덱</h1>
            <span className="text-xs text-indigo-600 font-medium">지능 에이전트 마스터리</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="w-4 h-4 fill-yellow-500" />
              <span>Lv.{profile.level}</span>
            </div>
            <span className="text-xs text-gray-400">Score: {profile.score}</span>
          </div>

          <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            <Flame className="w-4 h-4" />
            <span>{profile.streak}일</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;