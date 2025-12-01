'use client'

import React from 'react';
import { Battery, Shield, Signal } from 'lucide-react';
import { GameStats, PlayerLevel } from '../types';

interface Props {
  stats: GameStats;
  level: PlayerLevel;
}

const StatDisplay: React.FC<Props> = ({ stats, level }) => {
  const getColor = (val: number, type: 'data' | 'battery' | 'security') => {
    if (val < 20) return 'bg-red-500';
    if (val < 50) return 'bg-yellow-500';
    if (type === 'security') return 'bg-blue-500';
    if (type === 'data') return 'bg-emerald-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full bg-white/90 border-b border-gray-200 p-4 sticky top-[73px] z-40 backdrop-blur-md shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-mono-tech text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              {level}
            </h2>
            <div className="text-xs text-gray-500 font-mono-tech font-semibold bg-gray-100 px-2 py-1 rounded">
              EXP: {stats.exp}
            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Data Stat */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
              <Signal size={16} /> 데이터
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <div 
                className={`h-full transition-all duration-500 ${getColor(stats.data, 'data')}`} 
                style={{ width: `${stats.data}%` }}
              />
            </div>
            <span className="text-xs text-right font-mono text-gray-500 font-medium">{stats.data}%</span>
          </div>

          {/* Battery Stat */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-yellow-600 text-sm font-bold">
              <Battery size={16} /> 배터리
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <div 
                className={`h-full transition-all duration-500 ${getColor(stats.battery, 'battery')}`} 
                style={{ width: `${stats.battery}%` }}
              />
            </div>
            <span className="text-xs text-right font-mono text-gray-500 font-medium">{stats.battery}%</span>
          </div>

          {/* Security Stat */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-blue-600 text-sm font-bold">
              <Shield size={16} /> 보안
            </div>
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden border border-gray-300">
              <div 
                className={`h-full transition-all duration-500 ${getColor(stats.security, 'security')}`} 
                style={{ width: `${stats.security}%` }}
              />
            </div>
            <span className="text-xs text-right font-mono text-gray-500 font-medium">{stats.security}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatDisplay;
