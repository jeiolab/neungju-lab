import React from 'react';
import { Award, Zap, Star } from 'lucide-react';

interface HeaderProps {
  level: number;
  xp: number;
  streak: number;
}

const Header: React.FC<HeaderProps> = ({ level, xp, streak }) => {
  // XP progress bar width
  const nextLevelXp = level * 300;
  const progress = Math.min(100, (xp / nextLevelXp) * 100);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-200 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-100 p-1.5 rounded-lg">
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block uppercase tracking-wide">Level</span>
              <span className="text-lg font-bold text-slate-800 leading-none">{level}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="flex items-center text-amber-500 space-x-1 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span className="text-sm font-bold">{streak} <span className="text-xs font-normal text-amber-600">연속</span></span>
            </div>
            <div className="flex items-center text-slate-600 space-x-1">
              <Star className="w-4 h-4 text-purple-500 fill-purple-500" />
              <span className="text-sm font-bold">{xp} XP</span>
            </div>
          </div>
        </div>
        
        {/* XP Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Header;