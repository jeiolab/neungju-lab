import React from 'react';
import { TabType } from '../types';
import { BookOpen, Sliders, CheckSquare, PenTool, LayoutGrid } from 'lucide-react';

interface TabNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, onChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: '개념', icon: <BookOpen size={20} /> },
    { id: 'simulation', label: '실험실', icon: <Sliders size={20} /> },
    { id: 'more', label: '요약', icon: <LayoutGrid size={20} /> },
    { id: 'quiz', label: '퀴즈', icon: <CheckSquare size={20} /> },
    { id: 'think', label: '생각', icon: <PenTool size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            <span className="text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const DesktopNav: React.FC<TabNavProps> = ({ activeTab, onChange }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: '개념 학습', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: '인터랙티브 실험', icon: <Sliders size={18} /> },
    { id: 'more', label: '더 알아보기', icon: <LayoutGrid size={18} /> },
    { id: 'quiz', label: '확인 퀴즈', icon: <CheckSquare size={18} /> },
    { id: 'think', label: '생각해볼 문제', icon: <PenTool size={18} /> },
  ];

  return (
    <div className="hidden md:flex justify-center bg-white border-b border-gray-200 mb-6">
       <div className="flex space-x-1 p-2">
        {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
       </div>
    </div>
  );
};

export default TabNav;