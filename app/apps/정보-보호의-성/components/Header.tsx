'use client';

import React from 'react';
import { Tab } from '../types';
import { DynamicIcon } from './Icons';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: Tab.CONCEPT, label: '이론 개념', icon: 'BookOpen' },
    { id: Tab.SIMULATION, label: '성 지키기 (게임)', icon: 'Sword' },
    { id: Tab.LEARN_MORE, label: '더 알아보기', icon: 'Shield' },
    { id: Tab.QUIZ, label: '퀴즈', icon: 'CheckCircle' },
    { id: Tab.THINK, label: '생각해보기', icon: 'BrainCircuit' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <DynamicIcon name="Shield" className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">정보 보호의 성</span>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <DynamicIcon name={tab.icon} className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
