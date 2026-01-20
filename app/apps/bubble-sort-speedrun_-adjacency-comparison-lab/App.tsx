'use client'

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-indigo-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                🧪 버블 정렬 실험실
            </h1>
            <div className="text-xs bg-indigo-800 px-3 py-1 rounded-full border border-indigo-600">
                Lv.{userData.level} {userData.badges.length > 0 && ` | 🎖️ ${userData.badges.length}`}
            </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-4xl mx-auto px-2 flex overflow-x-auto no-scrollbar">
            {[
                { id: 'SIM', label: '실험실', icon: <Beaker size={18} /> },
                { id: 'THEORY', label: '이론', icon: <BookOpen size={18} /> },
                { id: 'QUIZ', label: '퀴즈', icon: <BrainCircuit size={18} /> },
                { id: 'DASH', label: '내 기록', icon: <LayoutDashboard size={18} /> },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 min-w-[80px] py-3 text-sm font-bold border-b-4 transition-colors flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2
                        ${activeTab === tab.id 
                            ? 'border-yellow-400 text-white bg-indigo-800' 
                            : 'border-transparent text-indigo-200 hover:bg-indigo-600 hover:text-white'}
                    `}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto py-6 animate-fade-in">
        {activeTab === 'SIM' && <Simulation onComplete={handleSimulationComplete} />}
        {activeTab === 'THEORY' && <Theory />}
        {activeTab === 'QUIZ' && <Quiz onComplete={handleQuizComplete} mistakeNoteIds={userData.mistakeNote} />}
        {activeTab === 'DASH' && <Dashboard userData={userData} />}
      </main>
      
      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs">
        <p>© 2024 Bubble Sort Speedrun. Educational Micro-Simulation.</p>
      </footer>
    </div>
  );
};

export default App;
