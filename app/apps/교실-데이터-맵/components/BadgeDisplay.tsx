import React from 'react';
import { BADGES } from '../constants';

interface BadgeDisplayProps {
  earnedBadges: string[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ earnedBadges }) => {
  const allBadges = Object.values(BADGES);

  return (
    <div className="flex gap-2 bg-white/50 p-2 rounded-lg border border-slate-200">
      {allBadges.map((badge) => {
        const isEarned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`relative group w-10 h-10 flex items-center justify-center rounded-full text-xl border-2 transition-all ${
              isEarned
                ? 'bg-amber-100 border-amber-400 text-amber-600 shadow-sm scale-100'
                : 'bg-slate-100 border-slate-200 text-slate-300 grayscale scale-90'
            }`}
            title={badge.name}
          >
            {badge.icon}
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max px-2 py-1 bg-slate-800 text-white text-xs rounded z-20">
              <p className="font-bold">{badge.name}</p>
              <p className="font-light">{badge.description}</p>
              {!isEarned && <p className="text-amber-300 mt-1 text-[10px]">미획득</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgeDisplay;