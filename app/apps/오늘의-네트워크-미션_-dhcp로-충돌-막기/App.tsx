import React, { useState, useEffect } from 'react';
import { TabId, AppState } from './types';
import { storageService } from './services/storageService';
import { ConceptTab } from './components/ConceptTab';
import { SimulationTab } from './components/SimulationTab';
import { QuizTab } from './components/QuizTab';
import { MoreInfoTab } from './components/MoreInfoTab';
import { MissionTab } from './components/MissionTab';
import { BookOpen, Activity, HelpCircle, GraduationCap, Flag, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('mission');
  const [seed, setSeed] = useState<string>('');
  const [appState, setAppState] = useState<AppState>({
    currentTab: 'mission',
    streak: 0,
    mastery: 0,
    wrongNotes: [],
    dailyDone: {},
    lastVisit: ''
  });

  useEffect(() => {
    // Initialize
    const dailySeed = storageService.getSeed();
    setSeed(dailySeed);
    const loaded = storageService.loadState();
    
    setAppState(prev => ({ ...prev, ...loaded }));
  }, []);

  const handleQuizComplete = (score: number, wrongIds: number[]) => {
    // Update mastery logic roughly
    const newMastery = Math.min(100, appState.mastery + score);
    const updatedNotes = [...new Set([...appState.wrongNotes, ...wrongIds])];
    
    const newState = {
      ...appState,
      mastery: newMastery,
      wrongNotes: updatedNotes
    };
    setAppState(newState);
    storageService.saveState(newState);
  };

  const handleMissionComplete = (reflection: string) => {
    const newStreak = storageService.markDailyComplete(seed);
    setAppState(prev => ({
      ...prev,
      streak: newStreak,
      dailyDone: { ...prev.dailyDone, [seed]: true }
    }));
  };

  const isTodayDone = !!appState.dailyDone[seed];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Web Header & Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Wifi className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 leading-none">오늘의 네트워크</h1>
                        <p className="text-xs text-slate-400 font-mono mt-1">{seed}</p>
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    <NavButton active={activeTab === 'mission'} onClick={() => setActiveTab('mission')} label="오늘의 미션" icon={Flag} />
                    <NavButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} label="핵심 개념" icon={BookOpen} />
                    <NavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} label="실험실" icon={Activity} />
                    <NavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} label="퀴즈" icon={GraduationCap} />
                    <NavButton active={activeTab === 'more'} onClick={() => setActiveTab('more')} label="더보기" icon={HelpCircle} />
                </nav>

                <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                        Lv.{Math.floor(appState.mastery / 100) + 1}
                     </div>
                </div>
            </div>
            
            {/* Mobile Nav (Horizontal Scroll) */}
            <div className="md:hidden overflow-x-auto flex items-center gap-4 px-4 py-2 border-t border-slate-100 no-scrollbar">
                <MobileNavButton active={activeTab === 'mission'} onClick={() => setActiveTab('mission')} label="미션" />
                <MobileNavButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} label="개념" />
                <MobileNavButton active={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} label="실험" />
                <MobileNavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} label="퀴즈" />
                <MobileNavButton active={activeTab === 'more'} onClick={() => setActiveTab('more')} label="더보기" />
            </div>
        </header>

        {/* Content Area */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
            <div className="animate-fade-in">
                {activeTab === 'mission' && (
                    <MissionTab 
                        seed={seed} 
                        isCompleted={isTodayDone} 
                        streak={appState.streak} 
                        onMarkComplete={handleMissionComplete} 
                    />
                )}
                {activeTab === 'concepts' && <ConceptTab />}
                {activeTab === 'simulation' && <SimulationTab />}
                {activeTab === 'quiz' && <QuizTab onComplete={handleQuizComplete} />}
                {activeTab === 'more' && <MoreInfoTab />}
            </div>
        </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: any }> = ({ active, onClick, label, icon: Icon }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
            active 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
    >
        <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
        {label}
    </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button 
        onClick={onClick}
        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            active 
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
            : 'bg-white text-slate-500 border border-slate-200'
        }`}
    >
        {label}
    </button>
);

export default App;