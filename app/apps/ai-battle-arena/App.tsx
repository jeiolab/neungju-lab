import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BattleGame from './components/BattleGame';
import ConceptTab from './components/ConceptTab';
import QuizTab from './components/QuizTab';
import ScenarioTab from './components/ScenarioTab';
import HallOfFame from './components/HallOfFame';
import { Tab, UserStats } from './types';
import { BookOpen, Gamepad2, Layers, BrainCircuit, Trophy } from 'lucide-react';

// Load stats from local storage or default
const loadStats = (): UserStats => {
  const saved = localStorage.getItem('ai_arena_stats');
  if (saved) return JSON.parse(saved);
  return { xp: 0, level: 1, streak: 1, highScore: 0 };
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);
  const [stats, setStats] = useState<UserStats>(loadStats());
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    localStorage.setItem('ai_arena_stats', JSON.stringify(stats));
  }, [stats]);

  const updateStats = (xpEarned: number, score?: number) => {
    setStats(prev => {
      const newXp = prev.xp + xpEarned;
      // Simple leveling formula: Level increases every few hundred XP (thresholds in constants)
      // For simplicity here:
      const newLevel = Math.floor(newXp / 300) + 1;
      
      if (newLevel > prev.level) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        highScore: score ? Math.max(prev.highScore, score) : prev.highScore
      };
    });
  };

  const renderTab = () => {
    switch (activeTab) {
      case Tab.CONCEPT: return <ConceptTab />;
      case Tab.BATTLE: return <BattleGame onScoreUpdate={updateStats} />;
      case Tab.SCENARIO: return <ScenarioTab />;
      case Tab.QUIZ: return <QuizTab onScoreUpdate={updateStats} />;
      case Tab.HALL_OF_FAME: return <HallOfFame />;
      default: return <ConceptTab />;
    }
  };

  const navItems = [
    { id: Tab.CONCEPT, label: '개념 비교', icon: BookOpen },
    { id: Tab.BATTLE, label: '분류 배틀', icon: Gamepad2 },
    { id: Tab.SCENARIO, label: '상황 적용', icon: Layers },
    { id: Tab.QUIZ, label: '보스 퀴즈', icon: BrainCircuit },
    { id: Tab.HALL_OF_FAME, label: '랭킹', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Header stats={stats} />
      
      <main className="pt-6">
        {renderTab()}
      </main>

      {/* Mobile-first Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-50">
        <div className="flex justify-around items-center max-w-4xl mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center py-3 px-2 w-full transition-colors relative ${isActive ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                )}
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-bounce-subtle' : ''}`} />
                <span className="text-[10px] md:text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Level Up Toast */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-1 rounded-2xl animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="bg-black/90 px-8 py-6 rounded-xl text-center">
              <h2 className="text-3xl font-gaming text-yellow-400 mb-2">LEVEL UP!</h2>
              <p className="text-white text-xl">You reached Level {stats.level}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;