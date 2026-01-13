import React from 'react';
import { TabId } from '../types';
import { BookOpen, Activity, Info, HelpCircle, Scale } from 'lucide-react';

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabNavigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '특성 연구', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: '밸런스 조절', icon: <Activity size={18} /> },
    { id: 'info', label: '기술 분석', icon: <Info size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: 'ethics', label: '윤리 위원회', icon: <Scale size={18} /> },
  ];

  return (
    <div className="flex overflow-x-auto md:overflow-visible gap-2 pb-2 md:pb-0 scrollbar-hide md:justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
            ${activeTab === tab.id 
              ? 'bg-black text-white shadow-md transform scale-105' 
              : 'bg-gray-100/50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
