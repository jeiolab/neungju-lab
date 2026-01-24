import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TheoryCards from './components/TheoryCards';
import Simulation from './components/Simulation';
import GameMode from './components/GameMode';
import QuizMode from './components/QuizMode';
import Reflection from './components/Reflection';
import { UserStats } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    streak: 0,
    totalPlayed: 0,
    correctCount: 0,
    badges: [],
    weaknesses: {},
    history: []
  });

  // Load stats from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('transfer_classifier_v1');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved stats", e);
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
            <div className="space-y-8 animate-fade-in">
                <Dashboard stats={stats} />
                <Reflection />
            </div>
        );
      case 'theory':
        return <TheoryCards />;
      case 'sim':
        return <Simulation />;
      case 'game':
        return <GameMode stats={stats} updateStats={setStats} />;
      case 'quiz':
        return <QuizMode />;
      default:
        return <Dashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-20">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
