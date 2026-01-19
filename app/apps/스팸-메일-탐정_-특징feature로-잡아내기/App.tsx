import React, { useState, useEffect } from 'react';
import { BookOpen, Activity, Search, Award, GraduationCap, User } from 'lucide-react';
import TheorySection from './components/TheorySection';
import SimulationSection from './components/SimulationSection';
import DeepDiveSection from './components/DeepDiveSection';
import QuizSection from './components/QuizSection';
import { loadUserStats, checkBadges } from './services/storageService';
import { UserStats } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'deep' | 'quiz'>('theory');
  const [stats, setStats] = useState<UserStats | null>(null);

  const updateStats = () => {
    const s = loadUserStats();
    setStats(s);
  };

  useEffect(() => {
    updateStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Search size={20} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">스팸 메일 탐정</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {stats && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <User size={16}/>
                  <span>Level {stats.level}</span>
                </div>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="flex items-center gap-1.5 text-indigo-600">
                  <Award size={16}/>
                  <span>{stats.xp} XP</span>
                </div>
                {stats.badges.length > 0 && (
                   <div className="hidden md:flex gap-1 ml-2">
                     {stats.badges.map((b, i) => (
                       <span key={i} title={b} className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                         {b}
                       </span>
                     ))}
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('theory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap
                ${activeTab === 'theory' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <BookOpen size={18} />
              1. 개념 익히기
            </button>
            <button
              onClick={() => setActiveTab('sim')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap
                ${activeTab === 'sim' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={18} />
              2. 실전 시뮬레이션
            </button>
            <button
              onClick={() => setActiveTab('deep')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap
                ${activeTab === 'deep' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <GraduationCap size={18} />
              3. 더 알아보기
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap
                ${activeTab === 'quiz' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Award size={18} />
              4. 퀴즈 & 평가
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'sim' && <SimulationSection onUpdateStats={updateStats} />}
        {activeTab === 'deep' && <DeepDiveSection />}
        {activeTab === 'quiz' && <QuizSection onUpdateStats={updateStats} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 Spam Mail Detective. Learning Machine Learning Concepts.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
