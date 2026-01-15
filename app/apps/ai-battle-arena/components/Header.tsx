import React from 'react';
import { UserStats } from '../types';
import { Zap, Trophy, Flame } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../constants';

interface HeaderProps {
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ stats }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[stats.level] || 9999;
  const prevLevelXp = LEVEL_THRESHOLDS[stats.level - 1] || 0;
  const progress = Math.min(100, Math.max(0, ((stats.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-neon">
            <Zap className="text-yellow-300 w-6 h-6" />
          </div>
          <h1 className="text-2xl font-gaming text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wider">
            AI BATTLE ARENA
          </h1>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-center">
          {/* Level & XP */}
          <div className="flex flex-col w-32 md:w-48">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>LV.{stats.level}</span>
              <span>{stats.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1 text-orange-400 font-bold" title="Daily Streak">
            <Flame className="w-5 h-5 fill-orange-500 animate-pulse" />
            <span>{stats.streak}</span>
          </div>

          {/* High Score */}
          <div className="flex items-center gap-1 text-yellow-400 font-bold" title="High Score">
            <Trophy className="w-5 h-5" />
            <span>{stats.highScore.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;