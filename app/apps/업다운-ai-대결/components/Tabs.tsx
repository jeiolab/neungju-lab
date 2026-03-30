import React from 'react';
import { Tab } from '../types';
import { BookOpen, Gamepad2, BarChart2, CheckCircle, BrainCircuit } from 'lucide-react';

interface TabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: Tab.THEORY, label: '이론', icon: BookOpen },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: Gamepad2 },
    { id: Tab.LEARN_MORE, label: '더 알아보기', icon: BarChart2 },
    { id: Tab.QUIZ, label: '퀴즈', icon: CheckCircle },
    { id: Tab.THINK, label: '생각해보기', icon: BrainCircuit },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${isActive 
                ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            `}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;