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
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center h-[60px] py-2">
          {/* Desktop Nav - 가운데 정렬, 제목 제거 */}
          <div className="hidden md:flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                  currentTab === tab.id
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={currentTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Menu Bar - 화이트 모드 */}
      <div className="md:hidden flex justify-around bg-white border-t border-slate-200 p-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center p-2 min-w-[60px] rounded-md text-xs ${
              currentTab === tab.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-slate-500 hover:text-slate-900'
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