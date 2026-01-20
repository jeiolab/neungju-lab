import React from 'react';
import { UserState } from '../types';
import { Trophy, Star, Zap } from 'lucide-react';

interface Props {
  userState: UserState;
}

export const Header: React.FC<Props> = ({ userState }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          정렬 알고리즘 의사결정
        </h1>
        
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>Lv.{userState.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
            <span>{userState.xp} XP</span>
          </div>
          {userState.badges.length > 0 && (
             <div className="hidden sm:flex items-center gap-1 text-purple-600">
               <Trophy className="w-4 h-4" />
               <span>{userState.badges.length}</span>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};