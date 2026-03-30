import React, { useState } from 'react';
import { LEVELS } from './constants';
import { UserProgress } from './types';
import { Simulation } from './components/Simulation';
import { Concepts } from './components/Concepts';
import { Quiz } from './components/Quiz';
import { Medal, BookOpen, FlaskConical, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'concepts' | 'quiz'>('simulation');
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    title: LEVELS[0].title,
    completedQuizzes: []
  });

  const updateProgress = (earnedXp: number, quizId?: string) => {
    setProgress(prev => {
      const newXp = prev.xp + earnedXp;
      // Calculate new level based on thresholds
      let newLevel = prev.level;
      let newTitle = prev.title;
      
      for (let i = 0; i < LEVELS.length; i++) {
        if (newXp >= LEVELS[i].threshold) {
          newLevel = i + 1;
          newTitle = LEVELS[i].title;
        }
      }

      const newCompleted = quizId ? [...prev.completedQuizzes, quizId] : prev.completedQuizzes;

      return {
        xp: newXp,
        level: newLevel,
        title: newTitle,
        completedQuizzes: newCompleted
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <FlaskConical size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DataCruncher Academy
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{progress.title}</span>
              <div className="text-xs text-slate-400">Level {progress.level} ({progress.xp} XP)</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border-2 border-indigo-100 relative">
               <Medal className="w-5 h-5 text-indigo-500" />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                 {progress.level}
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${activeTab === 'simulation' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <FlaskConical size={16} /> 실습 시뮬레이터
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${activeTab === 'concepts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <BookOpen size={16} /> 개념 배우기
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                ${activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <BrainCircuit size={16} /> 퀴즈 도전
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="animate-fade-in-up">
          {activeTab === 'simulation' && (
            <Simulation onTaskComplete={updateProgress} />
          )}
          {activeTab === 'concepts' && (
            <Concepts />
          )}
          {activeTab === 'quiz' && (
            <Quiz 
              onComplete={(xp) => updateProgress(xp, `q-${Date.now()}`)} 
              completedQuizzes={progress.completedQuizzes}
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
