import React from 'react';
import { TabView } from '../types';
import { BookOpen, Gamepad2, Brain, CheckSquare, MessageCircle, User } from 'lucide-react';

interface LayoutProps {
  currentTab: TabView;
  onTabChange: (tab: TabView) => void;
  children: React.ReactNode;
  score: number;
}

export const Layout: React.FC<LayoutProps> = ({ currentTab, onTabChange, children, score }) => {
  const tabs: { id: TabView; label: string; icon: React.ReactNode }[] = [
    { id: 'THEORY', label: '이론', icon: <BookOpen size={20} /> },
    { id: 'GAME', label: '실전', icon: <Gamepad2 size={20} /> },
    { id: 'DEEP_DIVE', label: '심화', icon: <Brain size={20} /> },
    { id: 'QUIZ', label: '퀴즈', icon: <CheckSquare size={20} /> },
    { id: 'DISCUSSION', label: '토론', icon: <MessageCircle size={20} /> },
    { id: 'PROFILE', label: '내 정보', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div>
          <h1 className="text-lg font-bold">Computable?</h1>
          <p className="text-xs text-indigo-200">판별/분류 트레이닝</p>
        </div>
        <div className="bg-indigo-800 px-3 py-1 rounded-full text-sm font-mono border border-indigo-400">
          Score: {score}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full max-w-md z-50 pb-safe">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-3 w-full transition-colors duration-200 ${
                currentTab === tab.id
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-400 hover:text-indigo-400'
              }`}
            >
              <div className="mb-1">{tab.icon}</div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
