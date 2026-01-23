import React from 'react';
import { Trophy, Star, Flame } from 'lucide-react';
import { UserProgress } from '../types';
import { LEVEL_THRESHOLDS } from '../constants';

interface NavbarProps {
  progress: UserProgress;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ progress, activeTab, setActiveTab }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[progress.level] || 3000;
  const prevLevelXp = LEVEL_THRESHOLDS[progress.level - 1] || 0;
  const levelProgress = ((progress.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  const tabs = [
    { id: 'theory', label: '학습하기' },
    { id: 'puzzle', label: '실전 퍼즐' },
    { id: 'quiz', label: '퀴즈' },
    { id: 'reflection', label: '연구 노트' },
    { id: 'profile', label: '내 프로필' },
  ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-3">
          <div className="flex items-center space-x-2 mb-3 md:mb-0">
            <span className="text-2xl font-black text-indigo-600 tracking-tight">LZ 탐정</span>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-bold">BETA</span>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            <div className="flex items-center text-yellow-600 font-bold" title="현재 레벨">
              <Trophy className="w-4 h-4 mr-1" />
              <span>Lv.{progress.level}</span>
            </div>
            
            <div className="flex flex-col w-24">
               <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                 <span>XP</span>
                 <span>{progress.xp}/{nextLevelXp}</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                 <div 
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }}
                 ></div>
               </div>
            </div>

            <div className="flex items-center text-orange-500 font-bold" title="연속 학습일">
              <Flame className="w-4 h-4 mr-1" />
              <span>{progress.streak}일</span>
            </div>
          </div>
        </div>

        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;