import React from 'react';
import { Tab, ProgressState } from '../types';
import { BookOpen, RefreshCw, Scroll, Brain, MessageCircle } from 'lucide-react';

interface NavigationProps {
  currentTab: Tab;
  onSelectTab: (tab: Tab) => void;
  completedTabs: ProgressState;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, completedTabs }) => {
  const tabs = [
    { id: Tab.INTRO, label: '개념', icon: BookOpen },
    { id: Tab.SIMULATOR, label: '실습', icon: RefreshCw },
    { id: Tab.HISTORY, label: '역사', icon: Scroll },
    { id: Tab.QUIZ, label: '퀴즈', icon: Brain },
    { id: Tab.DISCUSSION, label: '토론', icon: MessageCircle },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            const isCompleted = completedTabs[tab.id as keyof ProgressState];

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`
                  flex flex-col items-center min-w-[4rem] p-2 rounded-lg transition-all mx-1 relative
                  ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:bg-slate-50'}
                `}
              >
                <div className="relative">
                  <Icon size={24} className={isActive ? 'stroke-[2.5px]' : ''} />
                  {isCompleted && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;