import React from 'react';
import { UserProgress } from '../types';
import { Trophy, Flame, Star } from 'lucide-react';

interface Props {
  progress: UserProgress;
}

const Gamification: React.FC<Props> = ({ progress }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col items-end mr-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{progress.xp} XP</span>
        <span className="text-xs font-bold text-orange-600">{progress.streak}일 연속</span>
      </div>
      {progress.badges.length > 0 && (
        <div className="w-10 h-10 rounded-full border-2 border-indigo-100 p-1 flex items-center justify-center bg-indigo-50">
          <Trophy className="w-5 h-5 text-indigo-600" />
        </div>
      )}
    </div>
  );
};

export default Gamification;
