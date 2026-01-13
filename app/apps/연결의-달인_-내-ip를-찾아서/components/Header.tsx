import React from 'react';
import { AppTab, BadgeState } from '../types';
import { Network, Award } from 'lucide-react';

interface HeaderProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  badges: BadgeState;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange, badges }) => {
  const tabs = [
    { id: AppTab.CONCEPTS, label: '개념 잡기' },
    { id: AppTab.SIMULATION, label: '실전 시뮬레이션' },
    { id: AppTab.DEEP_DIVE, label: '더 알아보기' },
    { id: AppTab.QUIZ, label: '퀴즈' },
    { id: AppTab.REFLECTION, label: '생각해보기' },
  ];

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Network size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">연결의 달인</h1>
              <p className="text-xs text-slate-500">내 IP를 찾아서</p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Badges Display */}
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badges.beginner ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <Award size={14} /> 초급
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badges.intermediate ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <Award size={14} /> 중급
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badges.advanced ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
              <Award size={14} /> 고급
            </div>
          </div>
        </div>

        <nav className="flex overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                currentTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
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