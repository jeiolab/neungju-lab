import React from 'react';
import { UserProgress } from '../types';
import { Award, Flame, Star, Zap, BookOpen, Activity, HelpCircle, MessageSquare, LucideIcon } from 'lucide-react';

interface HeaderProps {
  progress: UserProgress;
  activeTab?: 'concepts' | 'simulation' | 'quiz' | 'reflection';
  setActiveTab?: (tab: 'concepts' | 'simulation' | 'quiz' | 'reflection') => void;
}

const Header: React.FC<HeaderProps> = ({ progress, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'concepts' as const, label: '개념', icon: BookOpen },
    { id: 'simulation' as const, label: '실험실', icon: Activity },
    { id: 'quiz' as const, label: '퀴즈', icon: HelpCircle },
    { id: 'reflection' as const, label: '생각', icon: MessageSquare },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Header Top */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Zap size={20} />
          </div>
          <h1 className="text-lg font-bold text-gray-800 hidden sm:block">급식·간식 군집화 미니랩</h1>
          <h1 className="text-lg font-bold text-gray-800 sm:hidden">군집화 미니랩</h1>
        </div>

        <div className="flex items-center space-x-4 text-sm font-medium">
          <div className="flex items-center text-orange-500" title="현재 스트릭">
            <Flame size={18} className="mr-1 fill-current" />
            <span>{progress.streak}일</span>
          </div>
          <div className="flex items-center text-yellow-500" title="총 점수">
            <Star size={18} className="mr-1 fill-current" />
            <span>{progress.score}점</span>
          </div>
           <div className="flex items-center text-purple-500" title="획득 배지">
            <Award size={18} className="mr-1" />
            <span>{progress.badges.length}개</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      {activeTab !== undefined && setActiveTab && (
        <nav className="border-t border-gray-100 bg-white overflow-x-auto no-scrollbar">
          <div className="max-w-4xl mx-auto flex px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    isActive 
                      ? 'text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;