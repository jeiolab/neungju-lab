import React from 'react';
import { AppTab } from '../types';
import { Book, PlayCircle, GraduationCap, Trophy, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: AppTab;
  setTab: (tab: AppTab) => void;
  streak: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setTab, streak }) => {
  const tabs = [
    { id: AppTab.THEORY, label: '이론', icon: Book },
    { id: AppTab.SIMULATION, label: '시뮬레이션', icon: PlayCircle },
    { id: AppTab.LEARN_MORE, label: '더 알아보기', icon: GraduationCap },
    { id: AppTab.QUIZ, label: '퀴즈', icon: HelpCircle },
    { id: AppTab.REFLECTION, label: '생각해보기', icon: Trophy }, // Using Trophy for reflection/challenge for now
  ];

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-amber-600 text-white p-1.5 rounded-lg">
              <Book className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-stone-800 tracking-tight hidden sm:block">스마트 사서</span>
          </div>

          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded-full border border-stone-200" title="Daily Streak">
             <div className="text-orange-500 font-bold">🔥 {streak}</div>
             <div className="text-xs text-stone-500 font-medium">레벨 {Math.floor(streak / 3) + 1}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;