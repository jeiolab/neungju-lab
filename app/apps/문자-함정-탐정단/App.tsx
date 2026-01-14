import React, { useState, useEffect } from 'react';
import StatusHeader from './components/StatusHeader';
import TabConcepts from './components/TabConcepts';
import TabGame from './components/TabGame';
import TabTimeline from './components/TabTimeline';
import TabQuiz from './components/TabQuiz';
import TabThink from './components/TabThink';
import { UserState } from './types';
import { BookOpen, Crosshair, Clock, FileCheck, Brain, Shield, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isSchoolMode, setIsSchoolMode] = useState(false);
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('detectiveUser');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      badges: [],
      streak: 1,
      lastLogin: new Date().toISOString().split('T')[0],
      gameHistory: { totalPlayed: 0, correctCount: 0, weakTags: {} },
      checklist: []
    };
  });

  // Save to local storage whenever user state changes
  useEffect(() => {
    localStorage.setItem('detectiveUser', JSON.stringify(user));
  }, [user]);

  const updateXP = (amount: number) => {
    setUser(prev => {
        const newXP = prev.xp + amount;
        const newLevel = Math.floor(newXP / 100) + 1; // Simple leveling
        return {
            ...prev,
            xp: newXP,
            level: newLevel
        };
    });
  };

  const handleGameScore = (xp: number, isCorrect: boolean, tags: string[]) => {
    updateXP(xp);
    setUser(prev => {
        const newHistory = { ...prev.gameHistory };
        newHistory.totalPlayed += 1;
        if (isCorrect) newHistory.correctCount += 1;
        
        // Track weak tags if incorrect
        if (!isCorrect) {
            tags.forEach(t => {
                newHistory.weakTags[t] = (newHistory.weakTags[t] || 0) + 1;
            });
        }
        return { ...prev, gameHistory: newHistory };
    });
  };

  const toggleChecklist = (item: string) => {
    setUser(prev => {
        const list = prev.checklist.includes(item) 
            ? prev.checklist.filter(i => i !== item)
            : [...prev.checklist, item];
        return { ...prev, checklist: list };
    });
  };

  // Mobile Bottom Nav Button
  const TabButton = ({ id, icon: Icon, label }: { id: number, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center justify-center py-3 text-xs md:text-sm font-medium transition-colors ${
        activeTab === id 
            ? 'text-indigo-600 bg-indigo-50' 
            : 'text-slate-400 hover:text-slate-600 bg-white'
      }`}
    >
      <Icon size={24} className={`mb-1 transition-transform ${activeTab === id ? 'scale-110' : ''}`} strokeWidth={activeTab === id ? 2.5 : 2} />
      {label}
    </button>
  );

  // Desktop Sidebar Button
  const SidebarButton = ({ id, icon: Icon, label, description }: { id: number, icon: any, label: string, description: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-4 py-4 mb-2 rounded-xl transition-all group ${
        activeTab === id 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className={`p-2 rounded-lg mr-4 ${activeTab === id ? 'bg-indigo-500/50' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
        <Icon size={20} />
      </div>
      <div className="text-left flex-1">
        <div className="font-bold text-sm">{label}</div>
        <div className={`text-[10px] ${activeTab === id ? 'text-indigo-200' : 'text-slate-500'}`}>{description}</div>
      </div>
      {activeTab === id && <ChevronRight size={16} className="text-indigo-300" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-900 text-white shadow-2xl z-30">
        <div className="p-8 pb-6">
           <h1 className="text-2xl font-black flex items-center gap-3 tracking-tight">
             <div className="bg-indigo-600 p-2 rounded-lg">
                <Shield className="text-white" size={24} fill="currentColor" />
             </div>
             문자 함정<br/>탐정단
           </h1>
           <p className="text-slate-400 text-xs mt-4 pl-1 font-medium tracking-wide uppercase">Cyber Security Training</p>
        </div>

        <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <SidebarButton id={1} icon={BookOpen} label="기본 개념" description="피싱, 스미싱 유형 학습" />
            <SidebarButton id={2} icon={Crosshair} label="실전 훈련" description="실제 문자 판별 게임" />
            <SidebarButton id={3} icon={Clock} label="범죄 연대기" description="디지털 범죄 사례 탐구" />
            <SidebarButton id={4} icon={FileCheck} label="능력 평가" description="최종 퀴즈 및 오답노트" />
            <SidebarButton id={5} icon={Brain} label="생각 확장" description="심화 토론 및 행동 수칙" />
          </div>
        </nav>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
           <div className="flex items-center justify-between text-xs text-slate-500">
             <span>v1.0.0 Web Edition</span>
             <span>© 2025</span>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <StatusHeader user={user} />

        <main className="flex-1 overflow-y-auto scroll-smooth">
           <div className="max-w-7xl mx-auto w-full p-4 md:p-10 pb-24 md:pb-10">
                {/* Specific Tab Header Content for Game Tab */}
                {activeTab === 2 && (
                    <div className="flex justify-end mb-6 animate-fade-in">
                        <button 
                            onClick={() => setIsSchoolMode(!isSchoolMode)}
                            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border transition-all shadow-sm ${
                                isSchoolMode 
                                    ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' 
                                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            <span>🏫</span>
                            {isSchoolMode ? '학교 단톡 모드 ON' : '학교 단톡 모드 OFF'}
                        </button>
                    </div>
                )}

                {activeTab === 1 && <TabConcepts user={user} toggleChecklist={toggleChecklist} />}
                {activeTab === 2 && <TabGame onScoreUpdate={handleGameScore} isSchoolMode={isSchoolMode} />}
                {activeTab === 3 && <TabTimeline />}
                {activeTab === 4 && <TabQuiz onComplete={(score) => updateXP(score)} />}
                {activeTab === 5 && <TabThink />}
           </div>
        </main>

        {/* Bottom Nav for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 flex bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <TabButton id={1} icon={BookOpen} label="개념" />
            <TabButton id={2} icon={Crosshair} label="실전" />
            <TabButton id={3} icon={Clock} label="사례" />
            <TabButton id={4} icon={FileCheck} label="평가" />
            <TabButton id={5} icon={Brain} label="생각" />
        </nav>
      </div>
    </div>
  );
};

export default App;