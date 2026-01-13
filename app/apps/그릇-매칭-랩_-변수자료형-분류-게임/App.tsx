import React, { useState, useEffect } from 'react';
import { UserStats, INITIAL_STATS } from './types';
import { loadStats, saveStats, checkStreak } from './services/storage';
import { BADGES } from './constants';
import Header from './components/Header';
import TabConcepts from './components/TabConcepts';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';
import { Book, Gamepad2, PenTool, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [activeTab, setActiveTab] = useState<'concepts' | 'sim' | 'quiz' | 'think'>('concepts');

  useEffect(() => {
    // Initial Load
    const loaded = loadStats();
    const withStreak = checkStreak(loaded);
    
    // Check level up logic on load or update
    setStats(withStreak);
  }, []);

  useEffect(() => {
    saveStats(stats);
    checkForBadges();
  }, [stats]);

  const checkForBadges = () => {
    const newBadges = [...stats.badges];
    let changed = false;

    BADGES.forEach(badge => {
      if (!newBadges.includes(badge.id) && badge.condition(stats)) {
        newBadges.push(badge.id);
        changed = true;
        // Simple alert for badge unlock (in real app, use toast)
        // Avoiding blocking alerts in strict react effects, but for this prototype it's fine or we just log
      }
    });

    if (changed) {
      setStats(prev => ({ ...prev, badges: newBadges }));
    }
  };

  const updateStats = (newStats: UserStats) => {
    // Level up logic: Level = 1 + floor(XP / 100)
    const newLevel = 1 + Math.floor(newStats.xp / 100);
    setStats({ ...newStats, level: newLevel });
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'concepts': return <TabConcepts />;
      case 'sim': return <TabSimulation stats={stats} updateStats={updateStats} />;
      case 'quiz': return <TabQuiz stats={stats} updateStats={updateStats} />;
      case 'think': return <TabThink />;
      default: return <TabConcepts />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Header stats={stats} />
      
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation for Mobile Friendliness */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-40 sm:justify-center sm:gap-12">
        <button 
          onClick={() => setActiveTab('concepts')}
          className={`flex flex-col items-center gap-1 text-xs font-medium p-2 rounded-lg transition-colors ${activeTab === 'concepts' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Book size={24} />
          <span>개념</span>
        </button>
        <button 
          onClick={() => setActiveTab('sim')}
          className={`flex flex-col items-center gap-1 text-xs font-medium p-2 rounded-lg transition-colors ${activeTab === 'sim' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Gamepad2 size={24} />
          <span>실험</span>
        </button>
        <button 
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-1 text-xs font-medium p-2 rounded-lg transition-colors ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BrainCircuit size={24} />
          <span>퀴즈</span>
        </button>
        <button 
          onClick={() => setActiveTab('think')}
          className={`flex flex-col items-center gap-1 text-xs font-medium p-2 rounded-lg transition-colors ${activeTab === 'think' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <PenTool size={24} />
          <span>생각</span>
        </button>
      </nav>
    </div>
  );
};

export default App;