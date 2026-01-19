import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Activity, 
  LayoutGrid, 
  BrainCircuit, 
  PenTool, 
  BarChart, 
  Zap, 
  Trophy,
  Menu,
  X
} from 'lucide-react';
import { UserStats, TabType } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import CasesTab from './components/CasesTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';

// Constants
const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  streak: 3,
  lastLogin: new Date().toISOString(),
  cardsReviewedToday: 0,
  badges: ['새로운 탐험가'],
  mastery: {},
  reviewQueue: ['c1', 'c2'] // Initial recommendations
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate Average Mastery
  useEffect(() => {
    const scores = Object.values(userStats.mastery) as number[];
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1) : 0;
    
    let newLevel = userStats.level;
    if (avg >= 90) newLevel = 5;
    else if (avg >= 75) newLevel = 4;
    else if (avg >= 60) newLevel = 3;
    else if (avg >= 30) newLevel = 2;

    if (newLevel !== userStats.level) {
      setUserStats(prev => ({ ...prev, level: newLevel, xp: Math.round(avg) }));
    } else {
        if(Math.round(avg) !== userStats.xp) {
             setUserStats(prev => ({ ...prev, xp: Math.round(avg) }));
        }
    }
  }, [userStats.mastery]);

  const addReviewItem = (id: string) => {
    if (!userStats.reviewQueue.includes(id)) {
      setUserStats(prev => ({ ...prev, reviewQueue: [...prev.reviewQueue, id] }));
    }
  };

  const cramMode = () => {
    // Ideally filters content, for now, switch to Theory and highlight weakness logic
    alert("취약 개념 3개를 복습 큐에 추가했습니다! (시험 전 15분 모드)");
    const weakConcepts = Object.entries(userStats.mastery)
        .sort(([, a], [, b]) => (a as number) - (b as number))
        .slice(0, 3)
        .map(([id]) => id);
    
    // Fallback if no mastery data
    const target = weakConcepts.length > 0 ? weakConcepts : ['c1', 'c2', 'c3'];
    
    setUserStats(prev => ({
        ...prev,
        reviewQueue: Array.from(new Set([...prev.reviewQueue, ...target]))
    }));
    setActiveTab('theory');
  };

  const NavItem = ({ id, label, icon: Icon }: { id: TabType; label: string; icon: any }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-slate-900 leading-tight">라벨 없는 세계</h1>
              <p className="text-xs text-slate-500">비지도학습 마스터리</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats Pill */}
            <div className="hidden md:flex items-center gap-4 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
              <span className="flex items-center gap-1 text-indigo-700">
                <Trophy className="w-4 h-4" /> Lv.{userStats.level}
              </span>
              <div className="w-px h-4 bg-slate-300"></div>
              <span className="flex items-center gap-1 text-amber-600">
                <Zap className="w-4 h-4" /> {userStats.streak}일 연속
              </span>
              <div className="w-px h-4 bg-slate-300"></div>
              <span className="text-slate-600">
                숙련도 {userStats.xp}%
              </span>
            </div>

            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
             <NavItem id="theory" label="개념 카드" icon={BookOpen} />
             <NavItem id="simulation" label="시뮬레이션" icon={Activity} />
             <NavItem id="cases" label="사례 연구" icon={LayoutGrid} />
             <NavItem id="quiz" label="퀴즈" icon={BrainCircuit} />
             <NavItem id="think" label="서술형" icon={PenTool} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6">
        
        {/* Quick Dashboard Widget (visible on top if low mastery or queue exists) */}
        {(userStats.xp < 50 || userStats.reviewQueue.length > 0) && activeTab !== 'quiz' && (
           <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg">
             <div>
               <h3 className="font-bold text-lg">오늘의 학습 목표</h3>
               <p className="text-indigo-100 text-sm opacity-90">
                 {userStats.reviewQueue.length > 0 
                   ? `${userStats.reviewQueue.length}개의 복습 카드가 기다립니다.` 
                   : "새로운 개념 카드를 확인해보세요!"}
               </p>
             </div>
             <button 
                onClick={cramMode}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors whitespace-nowrap"
             >
                시험 전 15분 모드 ⚡
             </button>
           </div>
        )}

        {/* Content Render */}
        <div className="animate-fadeIn">
          {activeTab === 'theory' && (
            <TheoryTab 
              userStats={userStats} 
              onUpdateStats={setUserStats} 
              onRequestReview={addReviewItem} 
            />
          )}
          {activeTab === 'simulation' && <SimulationTab />}
          {activeTab === 'cases' && <CasesTab />}
          {activeTab === 'quiz' && <QuizTab userStats={userStats} onUpdateStats={setUserStats} />}
          {activeTab === 'think' && <ThinkTab />}
        </div>
      </main>

      {/* Desktop Navigation Footer/Bar (Sticky Bottom for quick access) */}
      <div className="hidden md:block sticky bottom-6 max-w-fit mx-auto bg-white/90 backdrop-blur border border-slate-200 shadow-xl rounded-full px-4 py-2 z-40">
        <div className="flex items-center gap-2">
            <NavItem id="theory" label="개념" icon={BookOpen} />
            <NavItem id="simulation" label="실험" icon={Activity} />
            <NavItem id="cases" label="사례" icon={LayoutGrid} />
            <NavItem id="quiz" label="퀴즈" icon={BrainCircuit} />
            <NavItem id="think" label="생각" icon={PenTool} />
        </div>
      </div>
      
      <div className="h-20 md:hidden"></div> {/* Spacer for mobile */}
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50 pb-safe">
        <button onClick={() => setActiveTab('theory')} className={`flex flex-col items-center ${activeTab === 'theory' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <BookOpen className="w-6 h-6" />
           <span className="text-[10px] mt-1">개념</span>
        </button>
        <button onClick={() => setActiveTab('simulation')} className={`flex flex-col items-center ${activeTab === 'simulation' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <Activity className="w-6 h-6" />
           <span className="text-[10px] mt-1">실험</span>
        </button>
        <button onClick={() => setActiveTab('cases')} className={`flex flex-col items-center ${activeTab === 'cases' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <LayoutGrid className="w-6 h-6" />
           <span className="text-[10px] mt-1">사례</span>
        </button>
        <button onClick={() => setActiveTab('quiz')} className={`flex flex-col items-center ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-slate-400'}`}>
           <BrainCircuit className="w-6 h-6" />
           <span className="text-[10px] mt-1">퀴즈</span>
        </button>
      </div>

    </div>
  );
};

export default App;