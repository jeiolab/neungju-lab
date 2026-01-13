import React from 'react';
import { Award } from 'lucide-react';
import { BADGES } from '../constants';
import { UserState } from '../types';

interface Props {
  userState: UserState;
}

const BadgeDisplay: React.FC<Props> = ({ userState }) => {
  const earnedBadgeIds = new Set(userState.badges);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Award className="w-4 h-4" /> 나의 배지 컬렉션
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(BADGES).map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          return (
            <div 
              key={badge.id}
              className={`flex flex-col items-center text-center p-3 rounded-lg border-2 transition-all ${
                isEarned 
                  ? 'border-indigo-100 bg-indigo-50 opacity-100' 
                  : 'border-slate-100 bg-slate-50 opacity-50 grayscale'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${isEarned ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Award className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800">{badge.name}</span>
              <span className="text-xs text-slate-500 mt-1">{badge.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;
