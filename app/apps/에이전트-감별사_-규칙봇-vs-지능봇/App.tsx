import React, { useState } from 'react';
import { GameState } from './types';
import Dashboard from './components/Dashboard';
import TheorySection from './components/TheorySection';
import SimulationGame from './components/SimulationGame';
import MisconceptionDictionary from './components/MisconceptionDictionary';
import QuizSection from './components/QuizSection';
import CriticalThinking from './components/CriticalThinking';
import BingoBoard from './components/BingoBoard';
import { BookOpen, Gamepad2, PenTool, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'THEORY' | 'GAME' | 'MISCONCEPTION' | 'QUIZ' | 'THINK'>('GAME');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    streak: 0,
    completedCards: [],
    badges: [],
  });

  const handleScoreUpdate = (points: number, isSuccess: boolean) => {
    setGameState(prev => {
      const newScore = Math.max(0, prev.score + points);
      const newLevel = Math.floor(newScore / 100) + 1;
      const newStreak = isSuccess ? prev.streak + 1 : 0;
      
      let newBadges = [...prev.badges];
      if (newStreak === 3 && !newBadges.includes('초보 감별사')) newBadges.push('초보 감별사');
      if (newStreak === 7 && !newBadges.includes('감별사 1급')) newBadges.push('감별사 1급');
      if (newLevel > prev.level) newBadges.push(`레벨 ${newLevel} 달성`);

      return {
        ...prev,
        score: newScore,
        level: newLevel,
        streak: newStreak,
        badges: newBadges
      };
    });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'THEORY': return <TheorySection />;
      case 'GAME': return <SimulationGame onScoreUpdate={handleScoreUpdate} completedCards={gameState.completedCards} />;
      case 'MISCONCEPTION': return <MisconceptionDictionary />;
      case 'QUIZ': return <QuizSection />;
      case 'THINK': return <CriticalThinking />;
      default: return <SimulationGame onScoreUpdate={handleScoreUpdate} completedCards={gameState.completedCards} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">AI</span>
            에이전트 감별사
          </h1>
          <div className="text-xs font-bold text-slate-400">규칙봇 vs 지능봇</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Dashboard gameState={gameState} />
        
        <div className="mb-6">
          {renderContent()}
        </div>

        {/* Add-ons usually visible or optional. Let's put Bingo at bottom of main view if in Game mode */}
        {currentTab === 'GAME' && <BingoBoard />}
      </main>

      {/* Mobile/Tablet Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 px-2 z-20 md:max-w-3xl md:left-1/2 md:-translate-x-1/2 md:rounded-t-2xl md:shadow-2xl">
        <button 
          onClick={() => setCurrentTab('THEORY')}
          className={`flex flex-col items-center gap-1 text-xs font-medium px-2 ${currentTab === 'THEORY' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <BookOpen size={20} />
          <span>이론</span>
        </button>
        <button 
          onClick={() => setCurrentTab('GAME')}
          className={`flex flex-col items-center gap-1 text-xs font-medium px-2 ${currentTab === 'GAME' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Gamepad2 size={20} />
          <span>감별소</span>
        </button>
        <button 
          onClick={() => setCurrentTab('MISCONCEPTION')}
          className={`flex flex-col items-center gap-1 text-xs font-medium px-2 ${currentTab === 'MISCONCEPTION' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={20} />
          <span>오답노트</span>
        </button>
        <button 
          onClick={() => setCurrentTab('QUIZ')}
          className={`flex flex-col items-center gap-1 text-xs font-medium px-2 ${currentTab === 'QUIZ' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <PenTool size={20} />
          <span>퀴즈</span>
        </button>
        <button 
          onClick={() => setCurrentTab('THINK')}
          className={`flex flex-col items-center gap-1 text-xs font-medium px-2 ${currentTab === 'THINK' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className="relative">
             <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <BookOpen size={20} />
          </div>
          <span>심화</span>
        </button>
      </nav>
    </div>
  );
};

export default App;