import React, { useState } from 'react';
import { TabType, GameState, Badge } from './types';
import { INITIAL_BADGES } from './constants';
import TheoryTab from './components/TheoryTab';
import PuzzleTab from './components/PuzzleTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Puzzle, Activity, HelpCircle, GraduationCap, Trophy } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    badges: INITIAL_BADGES,
    puzzleCompleted: false,
    maxLevel: 1
  });

  const unlockBadge = (badgeId: string) => {
    setGameState(prev => {
      const badgeIndex = prev.badges.findIndex(b => b.id === badgeId);
      if (badgeIndex === -1 || prev.badges[badgeIndex].unlocked) return prev;

      const newBadges = [...prev.badges];
      newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlocked: true };
      
      // Show browser alert or toast (simplified for this structure)
      // alert(`배지 획득! ${newBadges[badgeIndex].icon} ${newBadges[badgeIndex].name}`);
      
      return { ...prev, badges: newBadges };
    });
  };

  const handlePuzzleComplete = (score: number) => {
    if (score === 100) {
      unlockBadge('flow-master');
      setGameState(prev => ({ ...prev, puzzleCompleted: true, score: prev.score + 50 }));
    }
  };

  const handleSimulationComplete = () => {
    unlockBadge('repeat-expert');
  };

  const handleQuizScore = (score: number) => {
    if (score >= 80) unlockBadge('quiz-whiz');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '개념', icon: <BookOpen className="w-5 h-5"/> },
    { id: 'puzzle', label: '순서 퍼즐', icon: <Puzzle className="w-5 h-5"/> },
    { id: 'simulation', label: '실험실', icon: <Activity className="w-5 h-5"/> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle className="w-5 h-5"/> },
    { id: 'reflection', label: '더 깊게', icon: <GraduationCap className="w-5 h-5"/> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">K-평균 순서 퍼즐</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium text-slate-700">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>획득 배지: {gameState.badges.filter(b => b.unlocked).length}/{gameState.badges.length}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                            ${activeTab === tab.id 
                                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'puzzle' && <PuzzleTab onComplete={handlePuzzleComplete} />}
        {activeTab === 'simulation' && <SimulationTab onSimulationComplete={handleSimulationComplete} />}
        {activeTab === 'quiz' && <QuizTab onScoreUpdate={handleQuizScore} />}
        {activeTab === 'reflection' && <ReflectionTab />}
      </main>

      {/* Badge Footer Display */}
      <footer className="bg-white border-t border-slate-200 p-4">
        <div className="max-w-6xl mx-auto">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">나의 업적</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {gameState.badges.map(badge => (
                    <div 
                        key={badge.id}
                        className={`
                            flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all
                            ${badge.unlocked 
                                ? 'bg-indigo-100 border-indigo-400 opacity-100 shadow-md transform hover:scale-110' 
                                : 'bg-slate-100 border-slate-200 opacity-40 grayscale'
                            }
                        `}
                        title={badge.unlocked ? `${badge.name}: ${badge.description}` : '잠김'}
                    >
                        {badge.icon}
                    </div>
                ))}
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
