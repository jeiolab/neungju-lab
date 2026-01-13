import React from 'react';
import { UserState } from '../types';
import { Trophy, Flame, Star } from 'lucide-react';

interface Props {
  user: UserState;
}

const Header: React.FC<Props> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
        <h1 className="font-bold text-gray-800 hidden md:block">에코 그리드 매니저</h1>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="flex items-center gap-1 text-orange-500" title="Daily Streak">
          <Flame size={18} fill="currentColor" className="text-orange-500" />
          <span>{user.streak}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-600" title="XP">
          <Star size={18} fill="currentColor" className="text-yellow-400" />
          <span>{user.xp} XP</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          <Trophy size={16} />
          <span>Lv {user.level}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;