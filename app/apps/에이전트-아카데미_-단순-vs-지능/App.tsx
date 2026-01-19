import React, { useState, useEffect } from 'react';
import TabNavigation from './components/TabNavigation';
import Header from './components/Header';
import TheoryTab from './components/TheoryTab';
import GameTab from './components/GameTab';
import EncyclopediaTab from './components/EncyclopediaTab';
import QuizTab from './components/QuizTab';
import InventorTab from './components/InventorTab';
import { UserStats } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [stats, setStats] = useState<UserStats>(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('agent_academy_stats');
        return saved ? JSON.parse(saved) : {
            gamesPlayed: 0,
            highScore: 0,
            maxCombo: 0,
            quizScore: 0,
            streakDays: 1
        };
    }
    return { gamesPlayed: 0, highScore: 0, maxCombo: 0, quizScore: 0, streakDays: 1 };
  });

  useEffect(() => {
    localStorage.setItem('agent_academy_stats', JSON.stringify(stats));
  }, [stats]);

  const updateGameStats = (score: number, maxCombo: number) => {
    setStats(prev => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        highScore: Math.max(prev.highScore, score),
        maxCombo: Math.max(prev.maxCombo, maxCombo)
    }));
  };

  const updateQuizStats = (score: number) => {
    setStats(prev => ({
        ...prev,
        quizScore: Math.max(prev.quizScore, score)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'game': return <GameTab updateStats={updateGameStats} />;
      case 'encyclopedia': return <EncyclopediaTab />;
      case 'quiz': return <QuizTab updateQuizScore={updateQuizStats} />;
      case 'think': return <InventorTab />;
      default: return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header stats={stats} />
        <main className="flex-1 w-full relative overflow-y-auto h-[calc(100vh-64px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;