import React from 'react';
import { Tab } from '../types';
import { Brain, Play, BarChart2, CheckSquare, MessageCircle } from 'lucide-react';

interface NavbarProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: Tab.THEORY, label: '이론', icon: Brain },
    { id: Tab.SIMULATION, label: '피벗 플레이', icon: Play },
    { id: Tab.EFFICIENCY, label: '효율성', icon: BarChart2 },
    { id: Tab.QUIZ, label: '퀴즈', icon: CheckSquare },
    { id: Tab.REFLECTION, label: '토론', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            Q
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            퀵 정렬 <span className="text-indigo-600">마스터</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};