import React, { useState, useEffect } from 'react';
import { TheorySection } from './components/TheorySection';
import { SimulationSection } from './components/SimulationSection';
import { QuizSection } from './components/QuizSection';
import { ReflectionSection } from './components/ReflectionSection';
import { AppState } from './types';
import { loadStorage, saveStorage } from './utils';
import { BADGES } from './constants';
import { Medal, BookOpen, PenTool, BrainCircuit, LayoutDashboard } from 'lucide-react';

const TABS = [
  { id: 'theory', label: '개념 익히기', icon: BookOpen },
  { id: 'sim', label: '압축 실험실', icon: LayoutDashboard },
  { id: 'quiz', label: '퀴즈 도전', icon: BrainCircuit },
  { id: 'think', label: '생각 넓히기', icon: PenTool },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sim');
  const [appState, setAppState] = useState<AppState>({
    badges: [],
    bestScore: 100,
    streak: 0,
    lastVisit: '',
    quizMastery: {},
    wrongNotes: []
  });

  // Load state on mount
  useEffect(() => {
    const loadedState = loadStorage<AppState>('app2_state', appState);
    
    // Streak logic
    const today = new Date().toDateString();
    if (loadedState.lastVisit !== today) {
        // Simple streak logic: if last visit was yesterday, increment. For now, just increment on new day visit.
        loadedState.streak += 1;
        loadedState.lastVisit = today;
        saveStorage('app2_state', loadedState);
    }
    
    setAppState(loadedState);
  }, []);

  const updateScore = (ratio: number) => {
    if (ratio < appState.bestScore) {
      const newState = { ...appState, bestScore: ratio };
      // Check for badge
      if (ratio <= 60 && !appState.badges.includes('compress_master')) {
        newState.badges = [...newState.badges, 'compress_master'];
      }
      setAppState(newState);
      saveStorage('app2_state', newState);
    }
  };

  const handleHistoryUpdate = () => {
     // Placeholder if we need to track history counts for badges
  };

  const handleQuizMastery = (id: number, correct: boolean) => {
    const newMastery = { ...appState.quizMastery, [id]: correct };
    const newWrong = correct 
      ? appState.wrongNotes.filter(n => n !== id) 
      : [...new Set([...appState.wrongNotes, id])];
    
    const newState = { ...appState, quizMastery: newMastery, wrongNotes: newWrong };
    setAppState(newState);
    saveStorage('app2_state', newState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header + 상단 고정 네비게이션 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-mono text-sm">RLE</div>
            <span className="hidden sm:inline">픽셀아트 압축 실험실</span>
          </h1>
          
          <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded">
                <span>🔥</span> {appState.streak}일째
             </div>
             <div className="flex items-center gap-1 text-slate-600">
                <Medal size={16} className="text-yellow-500" /> 
                {appState.badges.length}/{BADGES.length}
             </div>
          </div>
        </div>

        {/* 탭 네비게이션 (상단) */}
        <nav className="max-w-5xl mx-auto px-4 border-t border-slate-100">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6">
         {activeTab === 'theory' && <TheorySection />}
         {activeTab === 'sim' && <SimulationSection onScoreUpdate={updateScore} onHistoryUpdate={handleHistoryUpdate} />}
         {activeTab === 'quiz' && <QuizSection onMasteryUpdate={handleQuizMastery} masteryMap={appState.quizMastery} wrongNotes={appState.wrongNotes} />}
         {activeTab === 'think' && <ReflectionSection />}
      </main>

      {/* Badge Notification (Simple toast simulation) */}
      {appState.badges.length > 0 && (
         <div className="fixed top-20 right-4 flex flex-col gap-2 pointer-events-none">
            {/* Normally we would handle transient toasts here, but for simplicity we show owned badges in a modal or profile section. 
                Here we just rely on the header counter. */}
         </div>
      )}
    </div>
  );
};

export default App;