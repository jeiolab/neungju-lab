import React from 'react';
import { UserState } from '../types';
import { Trophy, Star, Award } from 'lucide-react';

interface Props {
  userState: UserState;
}

const GamificationBar: React.FC<Props> = ({ userState }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-indigo-700 font-bold">
            <Trophy className="w-5 h-5 mr-1" />
            <span>Lv.{userState.level}</span>
          </div>
          <div className="flex items-center text-yellow-600 font-bold">
            <Star className="w-5 h-5 mr-1" />
            <span>{userState.points} pts</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           {userState.badges.length > 0 && (
             <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-xs font-medium text-gray-600">최근 배지: {userState.badges[userState.badges.length - 1]}</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GamificationBar;
