import React from 'react';
import { Tab } from '../types';
import { Book, Activity, Search, PenTool, Brain } from 'lucide-react';

interface Props {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<Props> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: Tab.THEORY, label: '이론 개념', icon: Book },
    { id: Tab.SIMULATION, label: '로봇 실험실', icon: Activity },
    { id: Tab.DEEP_DIVE, label: '더 알아보기', icon: Search },
    { id: Tab.QUIZ, label: '퀴즈', icon: PenTool },
    { id: Tab.REFLECTION, label: '생각해보기', icon: Brain },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe md:relative md:border-t-0 md:bg-transparent md:mb-8 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between md:justify-center md:space-x-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center py-3 px-2 md:px-6 md:py-3 md:rounded-full transition-all ${
                  isActive
                    ? 'text-indigo-600 md:bg-white md:shadow-md md:text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600 md:hover:bg-white/50'
                }`}
              >
                <Icon size={20} className={`mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className={`text-[10px] md:text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;