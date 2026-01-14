import React, { useState, useEffect } from 'react';
import { UserProgress, MasteryState, MasteryStatus, WrongNote } from './types';
import { Dashboard } from './components/Dashboard';
import { ConceptTab } from './components/ConceptTab';
import { SimulationTab } from './components/SimulationTab';
import { QuizTab } from './components/QuizTab';
import { MoreInfoTab } from './components/MoreInfoTab';
import { ReflectionTab } from './components/ReflectionTab';
import { Book, Shield, BrainCircuit, CheckSquare, PenTool, LayoutDashboard } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  streak: 1,
  lastActiveDate: new Date().toISOString(),
  badges: []
};

export default function App() {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'concept' | 'sim' | 'quiz' | 'info' | 'reflection'>('dashboard');
  
  // Persistent State (Simulated with useState for simplicity in this artifact, normally localStorage)
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('infoApp_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [mastery, setMastery] = useState<MasteryState>(() => {
    const saved = localStorage.getItem('infoApp_mastery');
    return saved ? JSON.parse(saved) : {};
  });

  const [wrongNotes, setWrongNotes] = useState<WrongNote[]>(() => {
    const saved = localStorage.getItem('infoApp_wrongNotes');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('infoApp_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('infoApp_mastery', JSON.stringify(mastery));
  }, [mastery]);

  useEffect(() => {
    localStorage.setItem('infoApp_wrongNotes', JSON.stringify(wrongNotes));
  }, [wrongNotes]);

  // Streak Calculation (Run once on mount)
  useEffect(() => {
    const lastDate = new Date(progress.lastActiveDate).toDateString();
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      // Logic for streak update could go here (check if yesterday)
      // For now, just update last active date
      setProgress(p => ({ ...p, lastActiveDate: new Date().toISOString() }));
    }
  }, []);

  // --- Game Logic Helpers ---
  const addXp = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1; // Simple leveling: 100xp per level
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const updateMastery = (id: string, status: MasteryStatus) => {
    const isNewMastery = mastery[id] !== 'known' && status === 'known';
    setMastery(prev => ({ ...prev, [id]: status }));
    if (isNewMastery) {
      addXp(20); // Bonus XP for mastering a concept
    }
  };

  const handleQuizCorrect = (xp: number) => {
    addXp(xp);
  };

  const handleWrongAnswer = (note: WrongNote) => {
    setWrongNotes(prev => [...prev, note]);
  };

  // --- Layout Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header (Desktop) */}
      <header className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="text-indigo-600" size={24} />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              보호 vs 공유: 마스터 트레이너
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium">
            <span className="text-slate-500">Lv.{progress.level}</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${progress.xp % 100}%` }}></div>
            </div>
            <span className="text-indigo-600">{progress.xp} XP</span>
          </div>
        </div>
      </header>

      {/* Header (Mobile) */}
      <header className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
         <h1 className="text-lg font-bold text-slate-800">보호 vs 공유</h1>
         <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Lv.{progress.level}</span>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        {activeTab === 'dashboard' && (
          <Dashboard 
            progress={progress} 
            mastery={mastery} 
            onNavigateToStudy={() => setActiveTab('concept')}
          />
        )}
        {activeTab === 'concept' && (
          <ConceptTab mastery={mastery} updateMastery={updateMastery} />
        )}
        {activeTab === 'sim' && <SimulationTab />}
        {activeTab === 'quiz' && (
          <QuizTab onCorrectAnswer={handleQuizCorrect} onWrongAnswer={handleWrongAnswer} />
        )}
        {activeTab === 'info' && <MoreInfoTab />}
        {activeTab === 'reflection' && <ReflectionTab />}
      </main>

      {/* Bottom Navigation (Mobile & Desktop Unified for simplicity in this layout, typically desktop uses sidebar) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg md:relative md:border-none md:shadow-none md:bg-transparent md:hidden">
        <div className="flex justify-around items-center h-16">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="홈" 
          />
          <NavButton 
            active={activeTab === 'concept'} 
            onClick={() => setActiveTab('concept')} 
            icon={<Book size={20} />} 
            label="개념" 
          />
          <NavButton 
            active={activeTab === 'sim'} 
            onClick={() => setActiveTab('sim')} 
            icon={<Shield size={20} />} 
            label="실험" 
          />
          <NavButton 
            active={activeTab === 'quiz'} 
            onClick={() => setActiveTab('quiz')} 
            icon={<BrainCircuit size={20} />} 
            label="퀴즈" 
          />
          <NavButton 
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')} 
            icon={<CheckSquare size={20} />} 
            label="정보" 
          />
        </div>
      </nav>

      {/* Desktop Sidebar / Top Nav replacement for larger screens could go here, 
          but for simplicity we used a sticky header and will just float a FAB or keep the bottom nav hidden on desktop and put links in header? 
          Actually, let's implement a simple Desktop Nav bar in the Header for better UX.
      */}
      <div className="hidden md:flex fixed top-16 left-0 right-0 justify-center bg-white/80 backdrop-blur-md border-b border-slate-100 py-2 space-x-1 z-9">
         {/* Re-using Nav logic for desktop top bar */}
         <DesktopNavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="대시보드" />
         <DesktopNavButton active={activeTab === 'concept'} onClick={() => setActiveTab('concept')} label="개념 학습" />
         <DesktopNavButton active={activeTab === 'sim'} onClick={() => setActiveTab('sim')} label="비밀번호 실험" />
         <DesktopNavButton active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} label="실전 퀴즈" />
         <DesktopNavButton active={activeTab === 'info'} onClick={() => setActiveTab('info')} label="더 알아보기" />
         <DesktopNavButton active={activeTab === 'reflection'} onClick={() => setActiveTab('reflection')} label="생각해볼 문제" />
      </div>
    </div>
  );
}

// Sub-components for Navigation
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const DesktopNavButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    {label}
  </button>
);