import React, { useState, useEffect } from 'react';
import { UserStats, TabView } from './types';
import { ConceptView } from './components/ConceptView';
import { GameView } from './components/GameView';
import { LearnMoreView } from './components/LearnMoreView';
import { QuizView } from './components/QuizView';
import { ThinkView } from './components/ThinkView';
import { BookOpen, Gamepad2, Lightbulb, PenTool, HelpCircle } from 'lucide-react';

const INITIAL_STATS: UserStats = {
  maxCombo: 0,
  totalScore: 0,
  gamesPlayed: 0,
  badges: [],
  misconceptions: [],
  quizHistory: [],
  lastPlayed: '',
  streak: 0,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('game');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('collectornot_profile');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }
  }, []);

  // Save stats whenever they change
  const updateStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('collectornot_profile', JSON.stringify(newStats));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptView />;
      case 'game': return <GameView stats={stats} updateStats={updateStats} />;
      case 'learn': return <LearnMoreView />;
      case 'quiz': return <QuizView stats={stats} />;
      case 'think': return <ThinkView />;
      default: return <GameView stats={stats} updateStats={updateStats} />;
    }
  };

  const tabs = [
    { id: 'concept' as TabView, label: '개념', icon: BookOpen },
    { id: 'game' as TabView, label: '게임', icon: Gamepad2 },
    { id: 'learn' as TabView, label: '심화', icon: Lightbulb },
    { id: 'quiz' as TabView, label: '퀴즈', icon: HelpCircle },
    { id: 'think' as TabView, label: '생각', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-lg">
              <Gamepad2 size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Collect-or-Not?</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {renderContent()}
        </div>
      </main>
      
      {/* Global Style overrides for 3D flip card */}
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;