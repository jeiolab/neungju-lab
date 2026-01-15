import React from 'react';
import { UserStats } from '../types';
import { Trophy, Star, BookOpen } from 'lucide-react';

interface Props {
  stats: UserStats;
}

const LevelBadge: React.FC<Props> = ({ stats }) => {
  const getProgressWidth = () => {
    // Simple logic: every 3 projects levels up roughly
    const progress = (stats.projectsCompleted % 3) * 33.3;
    return `${Math.min(progress, 100)}%`;
  };

  const getLevelColor = () => {
    switch (stats.level) {
      case '소장': return 'text-purple-600 bg-purple-100 border-purple-200';
      case '연구원': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  return (
    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
      <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 ${getLevelColor()}`}>
        <Trophy size={20} className="mb-1" />
        <span className="text-xs font-bold">{stats.level}</span>
      </div>
      
      <div className="flex-1 min-w-[150px]">
        <div className="flex justify-between text-sm mb-1 text-slate-600">
          <div className="flex items-center gap-1">
            <BookOpen size={14} /> 
            <span>프로젝트 {stats.projectsCompleted}개</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600 font-medium">
            <Star size={14} fill="currentColor" />
            <span>{stats.points}점</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: getProgressWidth() }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1 text-right">다음 레벨까지 힘내세요!</p>
      </div>
    </div>
  );
};

export default LevelBadge;