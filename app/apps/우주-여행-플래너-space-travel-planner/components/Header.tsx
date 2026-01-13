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
    <header className="bg-space-900 border-b border-space-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-space-accent/20 p-2 rounded-lg">
              <Rocket className="w-6 h-6 text-space-accent" />
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block tracking-wider">
              SPACE TRAVEL <span className="text-space-accent">PLANNER</span>
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
                      ? 'bg-space-800 text-space-accent ring-1 ring-space-700 shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-space-800'
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
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-500 rounded-full border border-yellow-600/50 transition-all hover:scale-105"
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