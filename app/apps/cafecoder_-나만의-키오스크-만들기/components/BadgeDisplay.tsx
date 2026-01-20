import React from 'react';
import { Badge } from '../types';
import { Award, Star, Database } from 'lucide-react';

interface BadgeDisplayProps {
  badges: Badge[];
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="w-5 h-5" />;
      case 'database': return <Database className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex gap-2">
      {badges.map(badge => (
        <div 
          key={badge.id}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            badge.earned 
              ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm' 
              : 'bg-gray-100 text-gray-400 border-gray-200 grayscale opacity-50'
          }`}
          title={badge.description}
        >
          {getIcon(badge.icon)}
          <span className="hidden sm:inline">{badge.name}</span>
        </div>
      ))}
    </div>
  );
};

export default BadgeDisplay;