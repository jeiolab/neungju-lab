import React from 'react';
import { UserState } from '../types';
import { Trophy, Star, Flame, Shield } from 'lucide-react';

interface Props {
  user: UserState;
}

const StatusHeader: React.FC<Props> = ({ user }) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm w-full">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
            <Shield size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">탐정 레벨</div>
            <div className="text-lg font-black text-slate-800 leading-none">Lv.{user.level}</div>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-yellow-500 space-x-1 mb-0.5">
              <Star size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase">XP</span>
            </div>
            <span className="text-base font-bold text-slate-700">{user.xp.toLocaleString()}</span>
          </div>

          <div className="flex flex-col items-center">
             <div className="flex items-center text-orange-500 space-x-1 mb-0.5">
              <Flame size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase">Streak</span>
            </div>
            <span className="text-base font-bold text-slate-700">{user.streak}일</span>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center text-blue-500 space-x-1 mb-0.5">
              <Trophy size={16} fill="currentColor" />
              <span className="text-xs font-bold uppercase">배지</span>
            </div>
            <span className="text-base font-bold text-slate-700">{user.badges.length}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;