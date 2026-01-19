import React from 'react';
import { UserProgress } from '../types';
import { Trophy, Flame, Star } from 'lucide-react';

interface Props {
  progress: UserProgress;
}

const Gamification: React.FC<Props> = ({ progress }) => {
  return (
    <div className="flex items-center space-x-4 bg-white p-2 rounded-full shadow-sm border border-slate-200 text-sm">
      <div className="flex items-center text-amber-500 font-bold px-2">
        <Star className="w-4 h-4 mr-1 fill-current" />
        <span>{progress.xp} XP</span>
      </div>
      <div className="flex items-center text-orange-500 font-bold px-2 border-l border-slate-200">
        <Flame className="w-4 h-4 mr-1 fill-current" />
        <span>{progress.streak}일 연속</span>
      </div>
      {progress.badges.length > 0 && (
        <div className="flex items-center text-purple-600 font-bold px-2 border-l border-slate-200">
          <Trophy className="w-4 h-4 mr-1" />
          <span>{progress.badges.length}</span>
        </div>
      )}
    </div>
  );
};

export default Gamification;
