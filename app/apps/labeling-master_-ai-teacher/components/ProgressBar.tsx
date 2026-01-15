import React from 'react';
import { UserLevel } from '../types';

interface ProgressBarProps {
  points: number;
  level: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ points, level }) => {
  // Simple logic: Level up every 100 points
  const progress = points % 100;
  const nextLevelPoints = 100;
  
  const getBadgeColor = (lvl: string) => {
    switch (lvl) {
        case UserLevel.NOVICE: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case UserLevel.INTERMEDIATE: return 'bg-blue-100 text-blue-700 border-blue-200';
        case UserLevel.EXPERT: return 'bg-purple-100 text-purple-700 border-purple-200';
        case UserLevel.MASTER: return 'bg-rose-100 text-rose-700 border-rose-200';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getBadgeColor(level)}`}>
            {level}
        </div>
        <div className="text-sm text-gray-500 font-medium">
            현재 점수: <span className="text-indigo-600 font-bold text-lg">{points}</span> P
        </div>
      </div>
      
      <div className="flex-1 max-w-md">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>EXP</span>
            <span>{nextLevelPoints - progress} P to Level Up</span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${(progress / nextLevelPoints) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;