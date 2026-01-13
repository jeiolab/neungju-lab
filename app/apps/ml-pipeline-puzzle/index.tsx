import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PuzzleBoard } from './components/PuzzleBoard';
import { RoleRandomizer } from './components/RoleRandomizer';
import { QuizSection } from './components/QuizSection';
import { ReflectionBoard } from './components/ReflectionBoard';
import { InfoCards } from './components/InfoCards';
import { Difficulty, UserProgress } from './types';
import { Brain, Puzzle, Users, BookOpen, PenTool, Trophy, Star } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'puzzle' | 'quiz' | 'plan' | 'team'>('puzzle');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    badges: [],
    streak: 1,
    lastPlayed: new Date().toISOString(),
    completedPuzzles: 0,
    mistakeHistory: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('ml-puzzle-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('ml-puzzle-progress', JSON.stringify(newProgress));
  };

  const handlePuzzleComplete = (success: boolean, mistakes: number) => {
    if (success) {
      const xpGain = difficulty === Difficulty.EASY ? 10 : difficulty === Difficulty.NORMAL ? 20 : 30;
      const newProgress = {
        ...progress,
        xp: progress.xp + Math.max(0, xpGain - (mistakes * 2)),
        completedPuzzles: progress.completedPuzzles + 1,
      };
      saveProgress(newProgress);
    }
  };

  const handleQuizComplete = (score: number) => {
      const newProgress = {
          ...progress,
          xp: progress.xp + (score * 5)
      };
      saveProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Puzzle className="w-8 h-8 text-yellow-300" />
            ML 파이프라인 퍼즐
          </h1>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="hidden md:flex items-center gap-1 bg-indigo-700 px-3 py-1 rounded-full">
               <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
               <span>LV.{Math.floor(progress.xp / 100) + 1}</span>
            </div>
            <div className="flex items-center gap-1 bg-indigo-700 px-3 py-1 rounded-full">
               <Trophy className="w-4 h-4 text-orange-300" />
               <span>XP {progress.xp}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 mt-2">
        {activeTab === 'learn' && <InfoCards />}
        
        {activeTab === 'puzzle' && (
            <div className="space-y-6">
                <div className="flex justify-center gap-2 p-1 bg-slate-200 rounded-lg w-fit mx-auto">
                    {(Object.keys(Difficulty) as Array<keyof typeof Difficulty>).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(Difficulty[d])}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${difficulty === Difficulty[d] ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {Difficulty[d] === 'EASY' ? '쉬움' : Difficulty[d] === 'NORMAL' ? '보통' : '도전'}
                        </button>
                    ))}
                </div>
                <PuzzleBoard difficulty={difficulty} onComplete={handlePuzzleComplete} />
            </div>
        )}

        {activeTab === 'quiz' && (
            <QuizSection difficulty={difficulty} onComplete={handleQuizComplete} />
        )}

        {activeTab === 'plan' && <ReflectionBoard />}

        {activeTab === 'team' && <RoleRandomizer />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 pb-safe z-20">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          <NavButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={BookOpen} label="학습" />
          <NavButton active={activeTab === 'puzzle'} onClick={() => setActiveTab('puzzle')} icon={Puzzle} label="퍼즐" />
          <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} icon={Brain} label="퀴즈" />
          <NavButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={PenTool} label="설계" />
          <NavButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={Users} label="팀" />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors w-16 ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);