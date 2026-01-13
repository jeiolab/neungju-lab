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
    <header className="sticky top-0 z-50 glass-panel border-b border-blue-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="animate-pulse" size={28} />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              직업 타임머신
            </h1>
          </div>
        </div>
        
        <nav className="flex space-x-1 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;