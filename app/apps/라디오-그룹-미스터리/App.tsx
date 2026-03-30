import React, { useState } from 'react';
import { TabType, UserStats } from './types';
import { BookOpen, Gamepad2, GitMerge, CheckSquare, MessageSquare, Menu, Radio } from 'lucide-react';
import ConceptTab from './components/ConceptTab';
import GameTab from './components/GameTab';
import FlowTab from './components/FlowTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    badges: [],
    correctCount: 0
  });

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const tabs = [
    { id: 'concept', label: '개념 카드', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'game', label: '판별 게임', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'flow', label: '동작 원리', icon: <GitMerge className="w-4 h-4" /> },
    { id: 'quiz', label: '퀴즈', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reflection', label: '생각하기', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="bg-red-500 p-2 rounded-md">
               <Radio className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-lg md:text-xl font-bold leading-tight">라디오 그룹 미스터리</h1>
               <p className="text-xs text-slate-400">마이크로비트 IoT 경보 시스템</p>
             </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-400 text-xs">EXPERIENCE</span>
              <span className="font-mono font-bold text-yellow-400">{userStats.xp} XP</span>
            </div>
            {userStats.badges.length > 0 && (
               <div className="flex flex-col items-end">
                <span className="text-slate-400 text-xs">BADGES</span>
                <div className="flex space-x-1">
                  {userStats.badges.map((b, i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-blue-400" title={b}></span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-[60px] z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-5xl mx-auto px-4 flex space-x-2 md:space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 py-4 border-b-2 px-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 font-bold' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <div className="animate-fadeIn">
          {activeTab === 'concept' && <ConceptTab />}
          {activeTab === 'game' && <GameTab stats={userStats} updateStats={updateStats} />}
          {activeTab === 'flow' && <FlowTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'reflection' && <ReflectionTab />}
        </div>
      </main>
    </div>
  );
};

export default App;