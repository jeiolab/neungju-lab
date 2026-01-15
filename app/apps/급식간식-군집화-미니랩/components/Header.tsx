import React from 'react';
import { UserProgress } from '../types';
import { Award, Flame, Star, Zap } from 'lucide-react';

interface HeaderProps {
  progress: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Zap size={20} />
          </div>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">급식·간식 군집화 미니랩</h1>
          <h1 className="text-lg font-bold text-gray-800 sm:hidden">군집화 미니랩</h1>
        </div>

        <div className="flex items-center space-x-4 text-sm font-medium">
          <div className="flex items-center text-orange-500" title="현재 스트릭">
            <Flame size={18} className="mr-1 fill-current" />
            <span>{progress.streak}일</span>
          </div>
          <div className="flex items-center text-yellow-500" title="총 점수">
            <Star size={18} className="mr-1 fill-current" />
            <span>{progress.score}점</span>
          </div>
           <div className="flex items-center text-purple-500" title="획득 배지">
            <Award size={18} className="mr-1" />
            <span>{progress.badges.length}개</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;