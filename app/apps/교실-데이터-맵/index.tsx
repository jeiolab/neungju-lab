import React, { useState } from 'react';
import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import TabRealWorld from './components/TabRealWorld';
import TabQuiz from './components/TabQuiz';
import TabDesign from './components/TabDesign';
import BadgeDisplay from './components/BadgeDisplay';
import { UserStats, TabType } from './types';
import { LEVEL_THRESHOLDS } from './constants';
import { BookOpen, Play, Globe, HelpCircle, Lightbulb, Award } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('concepts');
  
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    badges: [],
    mastery: {
      indexing: 0,
      slicing: 0,
      dimension: 0,
    },
  });

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => {
      const updated = { ...prev, ...newStats };
      // 레벨 계산
      const newLevel = LEVEL_THRESHOLDS.findIndex(threshold => updated.xp < threshold);
      updated.level = newLevel === -1 ? LEVEL_THRESHOLDS.length : newLevel;
      return updated;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'concepts':
        return <TabConcepts />;
      case 'simulation':
        return <TabSimulation userStats={userStats} updateStats={updateStats} />;
      case 'realworld':
        return <TabRealWorld />;
      case 'quiz':
        return <TabQuiz userStats={userStats} updateStats={updateStats} />;
      case 'design':
        return <TabDesign />;
      default:
        return <TabConcepts />;
    }
  };

  const tabs = [
    { id: 'concepts' as TabType, label: '개념', icon: BookOpen },
    { id: 'simulation' as TabType, label: '시뮬레이션', icon: Play },
    { id: 'realworld' as TabType, label: '실생활', icon: Globe },
    { id: 'quiz' as TabType, label: '퀴즈', icon: HelpCircle },
    { id: 'design' as TabType, label: '설계', icon: Lightbulb },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800 mb-2">교실 데이터 맵</h1>
          <p className="text-sm text-slate-600">2차원 배열로 그리는 교실</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Stats & Badges */}
        <div className="p-4 border-t border-slate-200 space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">레벨 {userStats.level}</span>
            </div>
            <div className="text-xs text-slate-600">
              XP: {userStats.xp} / {LEVEL_THRESHOLDS[userStats.level] || 'MAX'}
            </div>
          </div>
          <BadgeDisplay earnedBadges={userStats.badges} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 h-screen overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
