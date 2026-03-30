import React from 'react';
import { Rocket, Book, Zap, Search, MessageSquare, Stamp } from 'lucide-react';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  openPassport: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTab, setTab, openPassport }) => {
  const tabs = [
    { id: AppTab.THEORY, label: '이론 개념', icon: Book },
    { id: AppTab.SIMULATION, label: '시뮬레이션', icon: Rocket },
    { id: AppTab.DEEP_DIVE, label: '더 알아보기', icon: Search },
    { id: AppTab.QUIZ, label: '퀴즈', icon: Zap },
    { id: AppTab.REFLECTION, label: '생각해보기', icon: MessageSquare },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Rocket className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block tracking-wider">
              우주 여행 <span className="text-blue-600">플래너</span>
            </h1>
          </div>

          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={openPassport}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-full border border-yellow-300 transition-all hover:scale-105"
          >
            <Stamp className="w-4 h-4" />
            <span className="hidden sm:inline">우주 여권</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;