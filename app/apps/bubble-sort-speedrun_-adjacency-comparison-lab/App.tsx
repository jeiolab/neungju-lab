import React, { useState, useEffect } from 'react';
import Simulation from './components/Simulation';
import Theory from './components/Theory';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import { UserData, SimulationStats } from './types';
import { INITIAL_USER_DATA, BADGES } from './constants';
import { Beaker, BookOpen, BrainCircuit, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SIM' | 'THEORY' | 'QUIZ' | 'DASH'>('SIM');
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);

  // Load / Save LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('bubbleSortUser');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bubbleSortUser', JSON.stringify(userData));
  }, [userData]);

  // Handlers for updating user data
  const handleSimulationComplete = (stats: SimulationStats) => {
    setUserData(prev => {
        const newHistory = [...prev.history, {
            date: new Date().toISOString(),
            comparisons: stats.comparisons,
            swaps: stats.swaps,
            timeMs: (stats.endTime || 0) - (stats.startTime || 0),
            arraySize: 6 // Assuming default or tracking state in future
        }];
        
        let newXp = prev.xp + 50;
        let newBadges = [...prev.badges];
        
        // Badge Logic
        if (!newBadges.includes('first_sort')) newBadges.push('first_sort');
        if (stats.swaps === 0 && !newBadges.includes('perfect_swap') && stats.comparisons > 0) newBadges.push('perfect_swap');
        
        // Simple Mastery Update
        const newMastery = { ...prev.mastery, mechanism: Math.min(100, prev.mastery.mechanism + 10) };

        return {
            ...prev,
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            history: newHistory,
            badges: newBadges,
            mastery: newMastery
        };
    });
  };

  const handleQuizComplete = (score: number, wrongIds: number[]) => {
     setUserData(prev => {
        const newXp = prev.xp + score;
        const newBadges = [...prev.badges];
        if (score >= 80 && !newBadges.includes('quiz_whiz')) newBadges.push('quiz_whiz');
        
        // Merge mistake notes (unique)
        const newMistakes = Array.from(new Set([...prev.mistakeNote, ...wrongIds]));

        return {
            ...prev,
            xp: newXp,
            level: Math.floor(newXp / 100) + 1,
            mistakeNote: newMistakes,
            mastery: { ...prev.mastery, concept: Math.min(100, prev.mastery.concept + (score / 2)) }
        }
     });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">버블 정렬 스피드런: 인접 비교 실험실</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs text-slate-500 font-medium">레벨</span>
              <span className="text-sm font-bold text-indigo-700">
                Lv.{userData.level} {userData.badges.length > 0 && ` | 🎖️ ${userData.badges.length}`}
              </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <LayoutDashboard className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 flex gap-8">
            <button
              onClick={() => setActiveTab('SIM')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === 'SIM' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
              `}
            >
              <Beaker size={20} className="mb-0" />
              <span className="text-sm font-medium">실험실</span>
            </button>
            <button
              onClick={() => setActiveTab('THEORY')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === 'THEORY' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
              `}
            >
              <BookOpen size={20} className="mb-0" />
              <span className="text-sm font-medium">이론</span>
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === 'QUIZ' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
              `}
            >
              <BrainCircuit size={20} className="mb-0" />
              <span className="text-sm font-medium">퀴즈</span>
            </button>
            <button
              onClick={() => setActiveTab('DASH')}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors duration-200
                ${activeTab === 'DASH' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
              `}
            >
              <LayoutDashboard size={20} className="mb-0" />
              <span className="text-sm font-medium">내 기록</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === 'SIM' && <Simulation onComplete={handleSimulationComplete} />}
        {activeTab === 'THEORY' && <Theory />}
        {activeTab === 'QUIZ' && <Quiz onComplete={handleQuizComplete} mistakeNoteIds={userData.mistakeNote} />}
        {activeTab === 'DASH' && <Dashboard userData={userData} />}
      </main>
    </div>
  );
};

export default App;
