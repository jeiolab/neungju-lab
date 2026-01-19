import React from 'react';
import { Scale, Shield, Zap, Award } from 'lucide-react';
import { UserStats, EthicsPropensity } from '../types';

interface HeaderProps {
  stats: UserStats;
  propensity: EthicsPropensity;
}

export const Header: React.FC<HeaderProps> = ({ stats, propensity }) => {
  return (
    <header className="bg-law-blue text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-law-gold rounded-full text-law-blue">
              <Scale size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-wide">솔로몬의 선택</h1>
              <p className="text-xs text-gray-300">AI 윤리 재판소</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-800/50 px-6 py-2 rounded-xl backdrop-blur-sm border border-slate-700">
            {/* Level Badge */}
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-gray-400 uppercase font-bold">윤리 레벨</span>
               <div className="flex items-center gap-1 text-law-gold font-bold">
                 <Award size={16} />
                 <span>Lv.{stats.ethicsLevel}</span>
               </div>
            </div>

            <div className="h-8 w-px bg-slate-600"></div>

            {/* Safety Score */}
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] text-gray-400 uppercase font-bold">사회적 안전</span>
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <Shield size={16} />
                <span>{stats.safetyScore}</span>
              </div>
            </div>

            {/* Innovation Score */}
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-[10px] text-gray-400 uppercase font-bold">기술 혁신</span>
              <div className="flex items-center gap-1 text-cyan-400 font-bold">
                <Zap size={16} />
                <span>{stats.innovationScore}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-gray-300 border border-slate-600">
              현재 성향: <span className="text-white font-bold">{propensity}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
