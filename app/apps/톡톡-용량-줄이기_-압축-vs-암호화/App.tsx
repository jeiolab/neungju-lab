import React, { useState, useEffect } from 'react';
import { loadState, saveState, calculateLevel, updateStreak } from './services/storage';
import { UserState } from './types';
import { BADGES } from './constants';
import Theory from './components/Theory';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import MoreInfo from './components/MoreInfo';
import { BookOpen, Gamepad2, GraduationCap, PenTool, Layout, Star, Trophy, Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'info' | 'quiz' | 'reflect'>('theory');
  const [userState, setUserState] = useState<UserState>(loadState());
  const [showLevelUp, setShowLevelUp] = useState(false);

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
    
    // Check badges logic can go here
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
          // Add mastery
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
    { id: 'theory', icon: BookOpen, label: '개념' },
    { id: 'sim', icon: Gamepad2, label: '실습' },
    { id: 'info', icon: Layout, label: '더보기' },
    { id: 'quiz', icon: GraduationCap, label: '퀴즈' },
    { id: 'reflect', icon: PenTool, label: '생각' },
  ];

  const currentLevel = calculateLevel(userState.xp);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
       {/* Header Gamification */}
       <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
                  Lv.{currentLevel}
              </div>
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500">EXP {userState.xp}</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(userState.xp % 100)}%`}}></div>
                  </div>
              </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-full text-xs">
                <Flame className="w-3 h-3 fill-orange-500" />
                {userState.streak}일
            </div>
            {BADGES.filter(b => b.condition(userState)).length > 0 && (
                <div className="flex items-center gap-1 text-yellow-600 font-bold bg-yellow-50 px-2 py-1 rounded-full text-xs">
                    <Trophy className="w-3 h-3" />
                    {BADGES.filter(b => b.condition(userState)).length}
                </div>
            )}
          </div>
       </header>

       {/* Level Up Modal */}
       {showLevelUp && (
           <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full shadow-xl font-black animate-bounce z-50 flex items-center gap-2">
               <Star className="fill-current" /> 레벨 업! Level {currentLevel}
           </div>
       )}

       {/* Main Content */}
       <main className="flex-1 p-4">
            {activeTab === 'theory' && <Theory onConceptComplete={handleConceptComplete} completedConcepts={userState.completedConcepts} />}
            {activeTab === 'sim' && <Simulation onComplete={(xp) => addXP(xp)} />}
            {activeTab === 'info' && <MoreInfo />}
            {activeTab === 'quiz' && <Quiz onCorrect={handleQuizCorrect} onWrong={handleQuizWrong} wrongNotes={userState.wrongNotes} />}
            {activeTab === 'reflect' && <Reflection />}
       </main>

       {/* Bottom Nav */}
       <nav className="sticky bottom-0 bg-white border-t border-gray-200 flex justify-around py-3 pb-5 safe-area-pb">
            {navItems.map((item) => (
                <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : ''}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                </button>
            ))}
       </nav>
    </div>
  );
}