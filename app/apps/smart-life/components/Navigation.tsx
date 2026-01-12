import React from 'react';
import { BookOpen, Home, AlertTriangle, CheckSquare, MessageCircle } from 'lucide-react';
import { Tab, NavItem } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: Tab.CONCEPT, label: '개념', icon: BookOpen },
  { id: Tab.SIMULATION, label: '체험', icon: Home },
  { id: Tab.DEEP_DIVE, label: '더보기', icon: AlertTriangle },
  { id: Tab.QUIZ, label: '퀴즈', icon: CheckSquare },
  { id: Tab.DISCUSSION, label: '토론', icon: MessageCircle },
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                  <Icon className="w-4 h-4" />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;