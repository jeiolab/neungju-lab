import React from 'react';
import { BookOpen, Puzzle, FileText, CheckSquare, BrainCircuit } from 'lucide-react';

interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 1, label: '개념 학습', icon: BookOpen },
    { id: 2, label: '실습 퍼즐', icon: Puzzle },
    { id: 3, label: '현실 적용', icon: FileText },
    { id: 4, label: '퀴즈', icon: CheckSquare },
    { id: 5, label: '생각 넓히기', icon: BrainCircuit },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 md:relative md:border-t-0 md:bg-transparent md:mb-6">
      <div className="flex justify-around md:justify-center md:space-x-4 p-2 md:p-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col md:flex-row items-center md:px-6 md:py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'text-indigo-600 bg-indigo-50 md:bg-white md:shadow-sm font-bold scale-105' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon size={20} className={`mb-1 md:mb-0 md:mr-2 ${isActive ? 'stroke-2' : 'stroke-1'}`} />
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabNavigation;
