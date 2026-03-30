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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={userStats} />;
      case 'theory':
        return <TheoryBook />;
      case 'game':
        return <MatchingGame />;
      case 'quiz':
        return <QuizArena userStats={userStats} updateStats={updateStats} />;
      case 'reflection':
        return <ReflectionCoach />;
      default:
        return <Dashboard stats={userStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">정렬 체육관 (SortGym)</h1>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 flex gap-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            대시보드
          </button>
          <button 
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'theory' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Book className="w-4 h-4" />
            이론 학습
          </button>
          <button 
            onClick={() => setActiveTab('game')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'game' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Gamepad2 className="w-4 h-4" />
            게임
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'quiz' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <PenTool className="w-4 h-4" />
            문제 풀이
          </button>
          <button 
            onClick={() => setActiveTab('reflection')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'reflection' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <MessageCircle className="w-4 h-4" />
            AI 코치
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
