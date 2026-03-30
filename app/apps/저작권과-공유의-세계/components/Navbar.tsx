import React from 'react';
import { TabType } from '../types';
import { Scale, BookOpen, Gavel, FileQuestion, MessageSquare, ExternalLink } from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 개념', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulation', label: 'AI 판사', icon: <Gavel className="w-4 h-4" /> },
    { id: 'quiz', label: '퀴즈', icon: <FileQuestion className="w-4 h-4" /> },
    { id: 'learnMore', label: '더 알아보기', icon: <ExternalLink className="w-4 h-4" /> },
    { id: 'discussion', label: '토론장', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight cursor-pointer" onClick={() => setCurrentTab('theory')}>
            <div className="bg-amber-500 p-1.5 rounded-lg text-slate-900">
              <Scale size={24} />
            </div>
            <span>저작권과 공유의 세계</span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  currentTab === tab.id
                    ? 'bg-slate-700 text-amber-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Menu Bar (Simplified for responsive) */}
      <div className="md:hidden flex justify-around bg-slate-800 p-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center p-2 min-w-[60px] rounded-md text-xs ${
              currentTab === tab.id ? 'text-amber-400 bg-slate-700' : 'text-slate-400'
            }`}
          >
            {tab.icon}
            <span className="mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;