import React from 'react';
import { Tab, UserStats } from '../types';
import { Activity, BookOpen, Terminal, Brain, Trophy, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  stats: UserStats;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, stats }) => {
  const navItems = [
    { id: Tab.THEORY, label: '이론 개념', icon: BookOpen },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: Terminal },
    { id: Tab.QUIZ, label: '퀴즈/미션', icon: Brain },
    { id: Tab.MORE, label: '더 알아보기', icon: Activity },
  ];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar: Logo & Stats */}
        <div className="flex justify-between items-center py-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">BodyCheck</h1>
              <span className="text-xs text-slate-400">나의 건강 데이터 변수 연구소</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Zap size={20} fill="currentColor" />
              <span className="font-bold">{stats.xp} XP</span>
            </div>
            {stats.streak > 0 && (
              <div className="hidden sm:flex items-center space-x-2 text-orange-400">
                <Trophy size={18} />
                <span className="text-sm">{stats.streak}일 연속 학습 중!</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-slate-700 text-emerald-400 font-bold shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
