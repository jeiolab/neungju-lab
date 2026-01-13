import React from 'react';
import { BookOpen, Sliders, PlayCircle, ClipboardCheck, PenTool } from 'lucide-react';

interface TabNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'concepts', label: '개념 학습', icon: BookOpen },
  { id: 'simulation', label: '시뮬레이션', icon: Sliders },
  { id: 'game', label: '판별 게임', icon: PlayCircle },
  { id: 'quiz', label: '퀴즈', icon: ClipboardCheck },
  { id: 'reflection', label: '생각하기', icon: PenTool },
];

const TabNavigation: React.FC<TabNavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40 sm:static sm:bg-transparent sm:border-0 sm:pb-0 sm:mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around sm:justify-start sm:space-x-2 p-2 sm:p-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex flex-col sm:flex-row items-center justify-center p-2 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'text-blue-600 sm:bg-white sm:shadow-sm sm:ring-1 sm:ring-black/5' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }
                  sm:px-4 sm:py-2.5 sm:w-auto w-full
                `}
              >
                <Icon size={20} className={`mb-1 sm:mb-0 sm:mr-2 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className={`text-[10px] sm:text-sm font-bold ${isActive ? 'text-blue-700' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;