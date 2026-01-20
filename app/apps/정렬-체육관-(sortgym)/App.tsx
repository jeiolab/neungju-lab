'use client'

import React, { useState, useEffect } from 'react';
import { UserStats, AlgorithmType } from './types';
import Dashboard from './components/Dashboard';
import TheoryBook from './components/TheoryBook';
import MatchingGame from './components/MatchingGame';
import QuizArena from './components/QuizArena';
import ReflectionCoach from './components/ReflectionCoach';
import { LayoutDashboard, Book, Gamepad2, PenTool, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'theory' | 'game' | 'quiz' | 'reflection'>('dashboard');
  
  const [userStats, setUserStats] = useState<UserStats>({
    masteryScore: 0,
    streak: 1,
    lastLogin: new Date().toISOString(),
    solvedCount: 0,
    correctCount: 0,
    weaknesses: {},
    history: []
  });

  useEffect(() => {
    // Simulate loading data
    const savedStats = localStorage.getItem('sortGymStats');
    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const updateStats = (isCorrect: boolean, category: AlgorithmType | 'General') => {
    setUserStats(prev => {
      const newStats = { ...prev };
      newStats.solvedCount += 1;
      if (isCorrect) {
        newStats.correctCount += 1;
        // Improve weakness score
        if (category !== 'General' && newStats.weaknesses[category]) {
           newStats.weaknesses[category] = Math.max(0, (newStats.weaknesses[category] || 0) - 1);
        }
      } else {
        // Increase weakness count
        if (category !== 'General') {
          newStats.weaknesses[category] = (newStats.weaknesses[category] || 0) + 1;
        }
      }
      localStorage.setItem('sortGymStats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200
        ${activeTab === id ? 'text-indigo-600 border-t-2 border-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}
      `}
    >
      <Icon size={24} className="mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 md:pl-24">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-24 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-4 flex justify-center mb-8 border-b border-slate-100">
           <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
        </div>
        <div className="flex flex-col space-y-4 w-full">
           <TabButton id="dashboard" icon={LayoutDashboard} label="대시보드" />
           <TabButton id="theory" icon={Book} label="이론 학습" />
           <TabButton id="game" icon={Gamepad2} label="게임" />
           <TabButton id="quiz" icon={PenTool} label="문제 풀이" />
           <TabButton id="reflection" icon={MessageCircle} label="AI 코치" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pt-6 min-h-screen">
        {activeTab === 'dashboard' && <Dashboard stats={userStats} />}
        {activeTab === 'theory' && <TheoryBook />}
        {activeTab === 'game' && <MatchingGame />}
        {activeTab === 'quiz' && <QuizArena userStats={userStats} updateStats={updateStats} />}
        {activeTab === 'reflection' && <ReflectionCoach />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-between px-2 z-50 safe-area-bottom">
         <TabButton id="dashboard" icon={LayoutDashboard} label="홈" />
         <TabButton id="theory" icon={Book} label="이론" />
         <TabButton id="game" icon={Gamepad2} label="게임" />
         <TabButton id="quiz" icon={PenTool} label="문제" />
         <TabButton id="reflection" icon={MessageCircle} label="코치" />
      </nav>
    </div>
  );
};

export default App;
