import React, { useState, useEffect } from 'react';
import { UserStats, DetectiveRank } from './types';
import DetectiveProfile from './components/DetectiveProfile';
import TheoryTab from './components/TheoryTab';
import CrimeSceneTab from './components/CrimeSceneTab';
import CaseLogTab from './components/CaseLogTab';
import { BookOpen, Map, ClipboardList } from 'lucide-react';

const STORAGE_KEY = 'ml_detective_stats';

const INITIAL_STATS: UserStats = {
  score: 0,
  solvedCount: 0,
  consecutiveWins: 0,
  rank: DetectiveRank.ROOKIE,
  history: []
};

type Tab = 'theory' | 'scene' | 'log';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('scene');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
  }, []);

  const updateStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] detective-bg text-gray-200 font-sans selection:bg-sepia-400 selection:text-ink">
      
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-sepia-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-sepia-400 text-ink w-8 h-8 flex items-center justify-center rounded-full font-serif font-bold">ML</div>
             <h1 className="font-serif text-xl md:text-2xl text-sepia-100 tracking-wider font-bold">
               기계학습 탐정 사무소
             </h1>
          </div>
          <div className="text-xs text-sepia-400 hidden sm:block">
            Ver 1.0 // Confidential
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          {/* Sidebar Profile */}
          <DetectiveProfile stats={stats} />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Tabs */}
            <nav className="flex space-x-2 mb-6 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setActiveTab('theory')}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition-all ${
                  activeTab === 'theory' 
                    ? 'bg-sepia-400 text-ink shadow-lg font-bold' 
                    : 'text-gray-400 hover:text-sepia-200 hover:bg-gray-800'
                }`}
              >
                <BookOpen size={18} className="mr-2" /> <span className="hidden sm:inline">수사 이론</span><span className="sm:hidden">이론</span>
              </button>
              <button
                onClick={() => setActiveTab('scene')}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition-all ${
                  activeTab === 'scene' 
                    ? 'bg-sepia-400 text-ink shadow-lg font-bold' 
                    : 'text-gray-400 hover:text-sepia-200 hover:bg-gray-800'
                }`}
              >
                <Map size={18} className="mr-2" /> <span className="hidden sm:inline">사건 현장</span><span className="sm:hidden">현장</span>
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center transition-all ${
                  activeTab === 'log' 
                    ? 'bg-sepia-400 text-ink shadow-lg font-bold' 
                    : 'text-gray-400 hover:text-sepia-200 hover:bg-gray-800'
                }`}
              >
                <ClipboardList size={18} className="mr-2" /> <span className="hidden sm:inline">오답 노트</span><span className="sm:hidden">기록</span>
              </button>
            </nav>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'theory' && <TheoryTab />}
              {activeTab === 'scene' && (
                <CrimeSceneTab 
                  userStats={stats} 
                  updateStats={updateStats} 
                />
              )}
              {activeTab === 'log' && <CaseLogTab history={stats.history} />}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-600 text-sm">
        <p>© 2024 ML Detective Agency. Gyomunsa-based Educational Tool.</p>
      </footer>
    </div>
  );
};

export default App;