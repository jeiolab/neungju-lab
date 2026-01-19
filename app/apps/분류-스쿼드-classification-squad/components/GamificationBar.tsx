import React from 'react';
import { Trophy, Flame, Star, Zap } from 'lucide-react';
import { GameState, SessionStats } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

interface Props {
  state: GameState;
  sessionStats: SessionStats;
}

export const GamificationBar: React.FC<Props> = ({ state, sessionStats }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[state.level] || 99999;
  const progress = Math.min(100, (state.xp / nextLevelXp) * 100);

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 text-lg">Lv.{state.level}</span>
            <span className="text-xs text-gray-500 font-medium">코치</span>
          </div>
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star size={16} fill="currentColor" />
          <span className="font-bold">{state.xp} XP</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-orange-500" title="일일 연속 접속">
          <Flame size={20} fill={state.streak > 0 ? "currentColor" : "none"} />
          <span className="font-bold">{state.streak}일</span>
        </div>
        
        <div className="flex items-center gap-1 text-indigo-600" title="이번 세션 연승">
          <Zap size={20} />
          <span className="font-bold">{sessionStats.binaryWinsStreak} Combo</span>
        </div>

        <div className="flex items-center -space-x-2">
          {state.badges.slice(0, 3).map((badge, idx) => (
             <div key={idx} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm" title={badge}>
               {badge.includes('탐지기') ? '📧' : badge.includes('회장') ? '👑' : '🏅'}
             </div>
          ))}
          {state.badges.length === 0 && <span className="text-xs text-gray-400">배지 없음</span>}
        </div>
      </div>
    </div>
  );
};