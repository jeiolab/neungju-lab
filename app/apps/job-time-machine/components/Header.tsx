import React from 'react';
import { TabType } from '../types';
import { Clock, Rocket, Brain, Puzzle, PenTool } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: '개념 설명', icon: <Brain size={18} /> },
    { id: 'simulation', label: '직업 분류', icon: <Clock size={18} /> },
    { id: 'explore', label: '더 알아보기', icon: <Rocket size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <Puzzle size={18} /> },
    { id: 'reflection', label: '미래 일기', icon: <PenTool size={18} /> },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;