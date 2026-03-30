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
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="font-bold text-xl text-indigo-600 hidden md:block">
            스마트 라이프
          </div>
          
          <div className="flex space-x-1 md:space-x-2 w-full md:w-auto justify-between md:justify-end">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1 px-3 md:px-4 py-2 rounded-full transition-all duration-200 text-sm md:text-base
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-700 font-bold shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? 'text-indigo-600' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;