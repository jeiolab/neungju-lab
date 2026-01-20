import React, { useState, useEffect } from 'react';
import { View, UserStats } from './types';
import { APP_NAME } from './constants';
import MergeMiniGame from './components/MergeMiniGame';
import PipelinePuzzle from './components/PipelinePuzzle';
import QuizSection from './components/QuizSection';
import TheorySection from './components/TheorySection';
import Dashboard from './components/Dashboard';
import ThinkingCorner from './components/ThinkingCorner';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('mergeSortStats');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      completedPuzzles: 0,
      mergeGameWins: 0,
      consecutiveMerges: 0,
      badges: [],
      quizHistory: []
    };
  });

  // Persist stats and calculate level
  useEffect(() => {
    const newLevel = Math.floor(userStats.xp / 100) + 1;
    const statsToSave = { ...userStats, level: newLevel };
    if (newLevel !== userStats.level) {
        setUserStats(statsToSave);
    }
    localStorage.setItem('mergeSortStats', JSON.stringify(statsToSave));
  }, [userStats]);

  const updateStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in p-4">
            <h1 className="text-5xl md:text-6xl font-black text-blue-900 leading-tight">
              합병 정렬<br/>
              <span className="text-blue-500">조립 퍼즐</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              학교 축제 주문이 폭주했습니다! <br/>
              <strong>분할-정렬-합병</strong> 전략으로 혼란스러운 주문서를 깔끔하게 정리해보세요.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                <button onClick={() => setCurrentView('THEORY')} className="p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group">
                    <span className="text-2xl mb-2 block">📚</span>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600">개념 익히기</span>
                    <p className="text-xs text-gray-500">분할 정복이 뭐죠?</p>
                </button>
                <button onClick={() => setCurrentView('PIPELINE_PUZZLE')} className="p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group">
                    <span className="text-2xl mb-2 block">🧩</span>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600">순서 조립 퍼즐</span>
                    <p className="text-xs text-gray-500">알고리즘 설계하기</p>
                </button>
                <button onClick={() => setCurrentView('MERGE_GAME')} className="p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group">
                    <span className="text-2xl mb-2 block">🎮</span>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600">합병 미니게임</span>
                    <p className="text-xs text-gray-500">직접 정렬해보기</p>
                </button>
                <button onClick={() => setCurrentView('QUIZ')} className="p-4 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group">
                    <span className="text-2xl mb-2 block">📝</span>
                    <span className="font-bold text-gray-800 group-hover:text-blue-600">AI 퀴즈</span>
                    <p className="text-xs text-gray-500">실력 확인하기</p>
                </button>
            </div>
          </div>
        );
      case 'THEORY':
        return <TheorySection />;
      case 'PIPELINE_PUZZLE':
        return <PipelinePuzzle userStats={userStats} updateStats={updateStats} />;
      case 'MERGE_GAME':
        return <MergeMiniGame userStats={userStats} updateStats={updateStats} />;
      case 'QUIZ':
        return <QuizSection userStats={userStats} updateStats={updateStats} />;
      case 'DASHBOARD':
        return <Dashboard userStats={userStats} />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="font-black text-xl text-blue-800 cursor-pointer flex items-center gap-2"
            onClick={() => setCurrentView('HOME')}
          >
            <span>🧩</span> {APP_NAME}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                <span className="text-yellow-500">⭐</span> {userStats.xp} XP
            </div>
            <button 
                onClick={() => setCurrentView('DASHBOARD')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="내 기록"
            >
                <span className="text-xl">📊</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation (Mobile friendly scrollable) */}
      <nav className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 min-w-max">
            {[
                { id: 'HOME', label: '홈' },
                { id: 'THEORY', label: '개념 학습' },
                { id: 'PIPELINE_PUZZLE', label: '파이프라인' },
                { id: 'MERGE_GAME', label: '합병 게임' },
                { id: 'QUIZ', label: '퀴즈' },
            ].map(item => (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`py-4 text-sm font-bold border-b-2 transition-colors
                        ${currentView === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}
                    `}
                >
                    {item.label}
                </button>
            ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 animate-fade-in">
        {renderContent()}
        
        {/* Thinking Corner is shown in Theory or Home context usually, but let's put it always at bottom unless playing game */}
        {(currentView === 'THEORY' || currentView === 'HOME') && <ThinkingCorner />}
      </main>

    </div>
  );
};

export default App;
