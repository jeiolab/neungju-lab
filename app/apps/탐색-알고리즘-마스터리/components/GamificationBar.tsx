import React from 'react';
import { UserState } from '../types';
import { Trophy, Star, Zap } from 'lucide-react';

interface Props {
  userState: UserState;
}

const GamificationBar: React.FC<Props> = ({ userState }) => {
  const progressToNextLevel = (userState.xp % 100);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-indigo-600 font-bold">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <span className="text-lg">{userState.level}</span>
            </div>
            <span className="hidden sm:inline">Lv.{userState.level}</span>
          </div>
          
          <div className="flex flex-col w-32 sm:w-48">
            <div className="text-xs text-gray-500 mb-1 flex justify-between">
              <span>XP</span>
              <span>{userState.xp}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressToNextLevel}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-6">
          <div className="flex items-center text-amber-500" title="Daily Streak">
            <Zap className="w-5 h-5 mr-1 fill-current" />
            <span className="font-bold">{userState.streak}일</span>
          </div>
          <div className="flex items-center text-blue-500" title="Badges">
             <Trophy className="w-5 h-5 mr-1" />
             <span className="font-bold">{userState.badges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationBar;
