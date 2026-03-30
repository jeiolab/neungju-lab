import React from 'react';
import { Trophy, Flame, Star, Award } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-400 w-6 h-6" />
          <h1 className="text-xl font-bold">선발전 정렬 코치</h1>
          <span className="text-xs bg-indigo-600 px-2 py-1 rounded text-indigo-100">선택 정렬 편</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-1.5" title="현재 레벨">
            <Star className="w-4 h-4 text-yellow-300" />
            <span>Lv.{progress.level}</span>
          </div>
          <div className="flex items-center gap-1.5" title="경험치">
            <span className="text-slate-400">XP</span>
            <span>{progress.xp}</span>
          </div>
          <div className="flex items-center gap-1.5" title="연속 학습일">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{progress.streak}일</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5" title="획득 배지">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{progress.badges.length}개</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
