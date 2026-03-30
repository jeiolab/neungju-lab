import React from 'react';
import { UserProfile } from '../types';
import { Trophy, Flame, Star, Medal } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../constants';

interface Props {
  profile: UserProfile;
}

const GamificationBar: React.FC<Props> = ({ profile }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[profile.level] || 9999;
  const prevLevelXp = LEVEL_THRESHOLDS[profile.level - 1] || 0;
  const progress = Math.min(100, Math.max(0, ((profile.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  return (
    <div className="bg-white border-b border-indigo-100 p-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-indigo-900">Lv.{profile.level}</span>
          </div>
          
          <div className="flex-1 sm:w-48 bg-gray-200 rounded-full h-3 overflow-hidden relative group">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {profile.xp} / {nextLevelXp} XP
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4 fill-orange-500" />
            <span>{profile.streak}일 연속</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{profile.xp} XP</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600">
            <Medal className="w-4 h-4" />
            <span>배지 {profile.badges.length}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationBar;