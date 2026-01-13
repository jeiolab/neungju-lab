import React, { useState, useEffect } from 'react';
import { CONCEPTS, LEVEL_TITLES, DEEP_DIVE_CONTENT } from './constants';
import { Tab, UserStats, MasteryState } from './types';
import Flashcards from './components/Flashcards';
import MatchingGame from './components/MatchingGame';
import QuizMode from './components/QuizMode';
import Reflection from './components/Reflection';
import { Book, LayoutGrid, Brain, PenTool, Layers, Trophy, Star } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CARDS);
  const [mastery, setMastery] = useState<MasteryState>({});
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    title: LEVEL_TITLES[0],
    badges: []
  });

  // Load from local storage
  useEffect(() => {
    const savedMastery = localStorage.getItem('mastery');
    const savedStats = localStorage.getItem('stats');
    if (savedMastery) setMastery(JSON.parse(savedMastery));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('mastery', JSON.stringify(mastery));
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [mastery, stats]);

  const updateMastery = (conceptId: string, success: boolean) => {
    setMastery(prev => {
      const current = prev[conceptId] || 0;
      const change = success ? 10 : -5;
      const newState = Math.min(100, Math.max(0, current + change));
      
      // Update XP if mastery increases
      if (newState > current) {
          addXp(5);
      }
      return { ...prev, [conceptId]: newState };
    });
  };

  const addXp = (amount: number) => {
      setStats(prev => {
          const newXp = prev.xp + amount;
          const nextLevelXp = prev.level * 100;
          let newLevel = prev.level;
          let newTitle = prev.title;

          if (newXp >= nextLevelXp) {
              newLevel += 1;
              newTitle = LEVEL_TITLES[Math.min(newLevel - 1, LEVEL_TITLES.length - 1)];
          }

          return { ...prev, xp: newXp, level: newLevel, title: newTitle };
      });
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CARDS:
        return <Flashcards concepts={CONCEPTS} mastery={mastery} onUpdateMastery={updateMastery} />;
      case Tab.MATCHING:
        return <MatchingGame concepts={CONCEPTS} onComplete={() => addXp(20)} />;
      case Tab.QUIZ:
        return <QuizMode concepts={CONCEPTS} onCorrect={() => addXp(20)} onIncorrect={() => {}} />;
      case Tab.REFLECTION:
        return <Reflection />;
      case Tab.DEEP_DIVE:
        return (
            <div className="max-w-3xl mx-auto p-6 space-y-6 overflow-y-auto h-full pb-24">
                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="text-indigo-500" />
                    더 알아보기: 미래 사회의 특징
                 </h2>
                 <p className="text-slate-600 mb-6">디지털 기술의 발달로 미래 사회는 다음과 같은 특징을 가집니다.</p>
                 <div className="grid gap-6">
                    {DEEP_DIVE_CONTENT.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{item.content}</p>
                        </div>
                    ))}
                 </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Book size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">디지털 개념 마스터</h1>
            <p className="text-xs text-slate-500">용어 정복기</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-indigo-600">{stats.title}</span>
                <span className="text-xs text-slate-400">Lv.{stats.level}</span>
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-full border border-indigo-100">
                <Trophy size={20} className="text-indigo-500" />
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {stats.level}
                </span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 pb-safe-area">
        <div className="flex justify-around items-center px-2 py-2 max-w-4xl mx-auto">
          <NavButton active={activeTab === Tab.CARDS} onClick={() => setActiveTab(Tab.CARDS)} icon={Book} label="개념 카드" />
          <NavButton active={activeTab === Tab.MATCHING} onClick={() => setActiveTab(Tab.MATCHING)} icon={LayoutGrid} label="용어 연결" />
          <NavButton active={activeTab === Tab.DEEP_DIVE} onClick={() => setActiveTab(Tab.DEEP_DIVE)} icon={Layers} label="더 보기" />
          <NavButton active={activeTab === Tab.QUIZ} onClick={() => setActiveTab(Tab.QUIZ)} icon={Brain} label="실전 퀴즈" />
          <NavButton active={activeTab === Tab.REFLECTION} onClick={() => setActiveTab(Tab.REFLECTION)} icon={PenTool} label="생각 넓히기" />
        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-16 md:w-24 ${active ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className="mb-1" />
    <span className="text-[10px] md:text-xs font-medium">{label}</span>
  </button>
);

export default App;