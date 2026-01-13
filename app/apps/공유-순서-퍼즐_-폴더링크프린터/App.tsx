import React, { useState, useEffect } from 'react';
import { ViewState, UserStats } from './types';
import { PUZZLES, QUIZ_DATA } from './constants';
import { getStats, recordPuzzleResult, recordQuizScore } from './services/storageService';

import Dashboard from './components/Dashboard';
import PuzzleBoard from './components/PuzzleBoard';
import QuizSection from './components/QuizSection';
import ThinkingSection from './components/ThinkingSection';
import TheoryCard from './components/TheoryCard';

import { BookOpen, HelpCircle, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activePuzzleId, setActivePuzzleId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(getStats());

  useEffect(() => {
    // Refresh stats whenever view changes to dashboard
    if (view === 'dashboard') {
      setUserStats(getStats());
    }
  }, [view]);

  const handleStartPuzzle = (id: string) => {
    setActivePuzzleId(id);
    setView('puzzle');
  };

  const handlePuzzleComplete = (success: boolean) => {
    if (activePuzzleId) {
      const updatedStats = recordPuzzleResult(activePuzzleId, success);
      setUserStats(updatedStats);
    }
  };

  const handleQuizComplete = (score: number) => {
    const updatedStats = recordQuizScore(score);
    setUserStats(updatedStats);
  };

  const activePuzzle = PUZZLES.find(p => p.id === activePuzzleId);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 pb-10">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">공유 순서 퍼즐</span>
            </div>
            
            <div className="flex items-center space-x-4">
               {view !== 'dashboard' && (
                <button 
                  onClick={() => setView('dashboard')}
                  className="text-sm font-medium text-gray-500 hover:text-blue-600"
                >
                  홈으로
                </button>
               )}
               <button 
                onClick={() => setView('theory')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                title="이론 공부"
               >
                 <BookOpen size={20} />
               </button>
               <button 
                onClick={() => setView('thinking')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                title="AI와 생각해보기"
               >
                 <HelpCircle size={20} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === 'dashboard' && (
          <>
            <div className="mb-8 flex justify-between items-end">
               <div>
                <h1 className="text-3xl font-bold text-gray-900">오늘의 학습 현황</h1>
                <p className="text-gray-500 mt-1">공유 절차를 마스터하고 '절차 설계자' 배지를 획득하세요.</p>
               </div>
               <button 
                onClick={() => setView('quiz')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold shadow-md transition-colors"
               >
                 퀴즈 도전하기
               </button>
            </div>
            <Dashboard 
              stats={userStats} 
              puzzles={PUZZLES} 
              onStartPuzzle={handleStartPuzzle} 
            />
          </>
        )}

        {view === 'puzzle' && activePuzzle && (
          <PuzzleBoard 
            scenario={activePuzzle} 
            onComplete={handlePuzzleComplete}
            onExit={() => setView('dashboard')}
          />
        )}

        {view === 'quiz' && (
          <QuizSection 
            questions={QUIZ_DATA} 
            onComplete={handleQuizComplete}
            onExit={() => setView('dashboard')}
          />
        )}

        {view === 'theory' && (
          <TheoryCard onClose={() => setView('dashboard')} />
        )}

        {view === 'thinking' && (
          <ThinkingSection onExit={() => setView('dashboard')} />
        )}

      </main>
    </div>
  );
};

export default App;