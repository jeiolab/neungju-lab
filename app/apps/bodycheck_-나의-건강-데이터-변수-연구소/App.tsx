import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import MoreInfoTab from './components/MoreInfoTab';
import { Tab, UserStats } from './types';
import { getStats, updateStats, addXP } from './services/storageService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [userStats, setUserStats] = useState<UserStats>({ xp: 0, badges: [], streak: 0 });

  useEffect(() => {
    // Load initial stats
    const stats = getStats();
    setUserStats(stats);
  }, []);

  const handleXpGain = (amount: number) => {
    const newStats = addXP(amount);
    setUserStats(newStats);
    // Simple notification logic could go here
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryTab />;
      case Tab.SIMULATION:
        return <SimulationTab onXpGain={handleXpGain} />;
      case Tab.QUIZ:
        return <QuizTab onXpGain={handleXpGain} />;
      case Tab.MORE:
        return <MoreInfoTab />;
      default:
        return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        stats={userStats}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Footer Spacing is handled by pb-24 */}
    </div>
  );
};

export default App;
