import React from 'react';
import { Trophy, Star, Flame } from 'lucide-react';

interface Props {
  xp: number;
  badges: string[];
  streak: number;
}

export const GamificationBar: React.FC<Props> = ({ xp, badges, streak }) => {
  const level = Math.floor(xp / 50) + 1;
  const progress = (xp % 50) / 50 * 100;

  return (
    <div className="bg-white border-b border-indigo-100 p-4 shadow-sm flex items-center justify-between flex-wrap gap-4 sticky top-0 z-50 no-print">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                Lv.{level}
            </div>
            <div className="flex flex-col w-32">
                <span className="text-xs text-slate-500 font-semibold">경험치 {xp} XP</span>
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-orange-500 font-bold" title="연속 학습일">
            <Flame className="w-5 h-5 fill-current" />
            <span>{streak}일 연속!</span>
        </div>
        
        <div className="flex items-center gap-2">
            {badges.map((badge, idx) => (
                <div key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-300 flex items-center gap-1 shadow-sm">
                    <Trophy className="w-3 h-3" /> {badge}
                </div>
            ))}
            {badges.length === 0 && <span className="text-xs text-slate-400">배지를 모아보세요!</span>}
        </div>
      </div>
    </div>
  );
};