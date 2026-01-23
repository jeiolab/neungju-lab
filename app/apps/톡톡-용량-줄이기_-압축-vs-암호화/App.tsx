import React, { useState, useEffect } from 'react';
import { loadState, saveState, calculateLevel, updateStreak } from './services/storage';
import { UserState } from './types';
import { BADGES } from './constants';
import Theory from './components/Theory';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import MoreInfo from './components/MoreInfo';
import { BookOpen, Gamepad2, GraduationCap, PenTool, Layout, Star, Trophy, Flame, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'info' | 'quiz' | 'reflect'>('theory');
  const [userState, setUserState] = useState<UserState>(loadState());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize streak on load
  useEffect(() => {
    const updated = updateStreak(userState);
    if (updated.streak !== userState.streak) {
        setUserState(updated);
        saveState(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addXP = (amount: number) => {
    const oldLevel = calculateLevel(userState.xp);
    const newXP = userState.xp + amount;
    const newLevel = calculateLevel(newXP);

    const updatedState = { ...userState, xp: newXP, level: newLevel };
    setUserState(updatedState);
    saveState(updatedState);

    if (newLevel > oldLevel) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  const handleConceptComplete = (id: string) => {
      if (!userState.completedConcepts.includes(id)) {
          const newCompleted = [...userState.completedConcepts, id];
          const newMastery = { ...userState.mastery, [id]: (userState.mastery[id] || 0) + 20 };

          setUserState(prev => {
              const next = { ...prev, completedConcepts: newCompleted, mastery: newMastery };
              saveState(next);
              return next;
          });
          addXP(10);
      }
  };

  const handleQuizCorrect = (id: number) => {
      addXP(15);
  };

  const handleQuizWrong = (id: number) => {
      if(!userState.wrongNotes.includes(id)){
        const newNotes = [...userState.wrongNotes, id];
        setUserState(prev => {
            const next = { ...prev, wrongNotes: newNotes };
            saveState(next);
            return next;
        });
      }
  };

  const navItems = [
    { id: 'theory' as const, icon: BookOpen, label: '개념' },
    { id: 'sim' as const, icon: Gamepad2, label: '실습' },
    { id: 'info' as const, icon: Layout, label: '더보기' },
    { id: 'quiz' as const, icon: GraduationCap, label: '퀴즈' },
    { id: 'reflect' as const, icon: PenTool, label: '생각' },
  ];

  const currentLevel = calculateLevel(userState.xp);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Layout className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  톡톡 용량 줄이기
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">압축 vs 암호화</p>
              </div>
            </div>

            {/* Stats - Desktop */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
                  Lv.{currentLevel}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500">EXP {userState.xp}</span>
                  <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(userState.xp % 100)}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full text-xs">
                <Flame className="w-3 h-3 fill-orange-500" />
                {userState.streak}일
              </div>
              {BADGES.filter(b => b.condition(userState)).length > 0 && (
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full text-xs">
                  <Trophy className="w-3 h-3" />
                  {BADGES.filter(b => b.condition(userState)).length}
                </div>
              )}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            <div className="flex gap-4 text-sm font-medium pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">Lv.{currentLevel}</div>
                <div>
                  <span className="text-xs text-slate-500">EXP {userState.xp}</span>
                  <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${(userState.xp % 100)}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full text-xs">
                <Flame className="w-3 h-3 fill-orange-500" />{userState.streak}일
              </div>
              {BADGES.filter(b => b.condition(userState)).length > 0 && (
                <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-full text-xs">
                  <Trophy className="w-3 h-3" />{BADGES.filter(b => b.condition(userState)).length}
                </div>
              )}
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Level Up Toast */}
      {showLevelUp && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-amber-400 text-amber-900 px-6 py-3 rounded-full shadow-xl font-bold z-[60] flex items-center gap-2 animate-bounce">
          <Star className="fill-current" /> 레벨 업! Level {currentLevel}
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {activeTab === 'theory' && <Theory onConceptComplete={handleConceptComplete} completedConcepts={userState.completedConcepts} />}
        {activeTab === 'sim' && <Simulation onComplete={(xp) => addXP(xp)} />}
        {activeTab === 'info' && <MoreInfo />}
        {activeTab === 'quiz' && <Quiz onCorrect={handleQuizCorrect} onWrong={handleQuizWrong} wrongNotes={userState.wrongNotes} />}
        {activeTab === 'reflect' && <Reflection />}
      </main>
    </div>
  );
}
