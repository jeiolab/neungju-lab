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

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative max-w-2xl mx-auto w-full bg-white shadow-xl md:my-4 md:rounded-2xl md:border md:border-gray-200">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 pb-safe z-50 md:fixed md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:shadow-2xl md:px-6 md:border md:w-auto w-full">
        <div className="flex justify-around items-center h-16 md:gap-8">
          <NavButton 
            active={activeTab === 'concept'} 
            onClick={() => setActiveTab('concept')} 
            icon={<BookOpen size={20} />} 
            label="개념" 
          />
          <NavButton 
            active={activeTab === 'game'} 
            onClick={() => setActiveTab('game')} 
            icon={<Gamepad2 size={24} />} 
            label="게임" 
            isMain
          />
           <NavButton 
            active={activeTab === 'learn'} 
            onClick={() => setActiveTab('learn')} 
            icon={<Lightbulb size={20} />} 
            label="심화" 
          />
          <NavButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={<HelpCircle size={20} />} 
            label="퀴즈" 
          />
          <NavButton 
            active={activeTab === 'think'} 
            onClick={() => setActiveTab('think')} 
            icon={<PenTool size={20} />} 
            label="생각" 
          />
        </div>
      </nav>
      
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
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; isMain?: boolean }> = ({ active, onClick, icon, label, isMain }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors relative
      ${active ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}
    `}
  >
    {isMain ? (
        <div className={`p-3 rounded-full -mt-6 shadow-lg border-4 border-white transition-transform
            ${active ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-800 text-white'}
        `}>
            {icon}
        </div>
    ) : (
        <div className="mb-0.5">{icon}</div>
    )}
    <span className={`text-[10px] font-bold ${isMain ? 'mt-1' : ''}`}>{label}</span>
  </button>
);

export default App;