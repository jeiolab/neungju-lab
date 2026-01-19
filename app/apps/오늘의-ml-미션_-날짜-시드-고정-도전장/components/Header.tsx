import React from 'react';
import { Flame, Snowflake, Trophy } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
}

const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">
          오늘의 ML <span className="text-indigo-600">미션</span>
        </h1>
        
        <div className="flex items-center gap-3 text-sm">
          {/* Points */}
          <div className="flex items-center text-amber-500 font-bold">
            <Trophy size={16} className="mr-1" />
            {progress.totalPoints}
          </div>

          {/* Streak */}
          <div className={`flex items-center font-bold px-2 py-1 rounded-full ${progress.streak > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
            <Flame size={16} className={`mr-1 ${progress.streak > 0 ? 'fill-orange-600 animate-pulse' : ''}`} />
            {progress.streak}일
          </div>

          {/* Freeze Item Status */}
          {progress.frozenStreakAvailable && (
            <div className="text-cyan-500" title="스트릭 보호권 보유 중">
              <Snowflake size={18} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
