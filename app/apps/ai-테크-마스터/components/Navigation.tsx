import React from 'react';
import { BookOpen, Gamepad2, BrainCircuit, CheckSquare, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentTab: number;
  setCurrentTab: (tab: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 1, label: '이론 개념', icon: BookOpen },
    { id: 2, label: '기술 매칭 랩', icon: Gamepad2 },
    { id: 3, label: '더 알아보기', icon: BrainCircuit },
    { id: 4, label: '마스터리 퀴즈', icon: CheckSquare },
    { id: 5, label: '생각해볼 문제', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;