import React from 'react';
import { Award } from 'lucide-react';

interface BadgeDisplayProps {
  badges: string[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  if (badges.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur shadow-xl rounded-xl p-4 border border-indigo-100 max-w-xs animate-fade-in-up z-50">
      <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
        <Award className="w-4 h-4 text-yellow-500" />
        획득한 배지
      </h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <span 
            key={idx} 
            className="px-3 py-1 bg-gradient-to-r from-yellow-200 to-amber-300 text-amber-900 text-xs font-bold rounded-full shadow-sm"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BadgeDisplay;