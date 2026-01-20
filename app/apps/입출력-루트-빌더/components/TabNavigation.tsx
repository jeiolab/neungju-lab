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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center space-x-4 overflow-x-auto no-scrollbar py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                  ${isActive 
                    ? 'text-indigo-600 bg-indigo-50 font-bold border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon size={18} className={isActive ? 'stroke-2' : 'stroke-1'} />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
