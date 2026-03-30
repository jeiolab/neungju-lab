import React from 'react';
import { Trophy, Flame, Star, BookOpen, Activity, PlayCircle, HelpCircle, MessageCircle } from 'lucide-react';
import { Tab, UserProgress } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  progress: UserProgress;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, progress }) => {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 카드', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulation', label: '마이크로 실험', icon: <Activity className="w-4 h-4" /> },
    { id: 'deepdive', label: '더 알아보기', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'discussion', label: '생각해보기', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="font-bold text-lg hidden sm:block">동아리 캐릭터 카드 <span className="text-slate-500 font-normal">| 클래스와 객체</span></h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-1 text-indigo-600">
              <Star className="w-4 h-4 fill-current" />
              <span>Lv.{progress.level}</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4 fill-current" />
              <span>{progress.streak}일 연속</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy className="w-4 h-4 fill-current" />
              <span>{progress.badges.length}개</span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="max-w-4xl mx-auto px-4 border-t border-slate-200 bg-white">
          <div className="flex justify-between items-center overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-200 min-w-[80px] ${
                  activeTab === tab.id
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] sm:text-xs whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
