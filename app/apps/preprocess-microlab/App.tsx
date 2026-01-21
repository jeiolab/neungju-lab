import React, { useState, useEffect } from 'react';
import { UserState } from './types';
import SimulationTab from './components/SimulationTab';
import TheoryTab from './components/TheoryTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import BadgeDisplay from './components/BadgeDisplay';
import { FlaskConical, BookOpen, Brain, HelpCircle, MessageSquare } from 'lucide-react';

// Persist key
const STORAGE_KEY = 'microlab_user_v1';

const App: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'deepdive' | 'quiz' | 'reflection'>('theory');
  
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      xp: 0,
      level: 1,
      streak: 1,
      badges: [],
      experimentsRun: 0,
      strategiesUsed: [],
      quizHistory: {}
    };
  });

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
  }, [userState]);

  // Level Calculation
  const level = Math.floor(userState.xp / 100) + 1;
  const progress = userState.xp % 100;

  // --- Render Helpers ---
  const renderTab = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab userState={userState} setUserState={setUserState} />;
      case 'deepdive': return <DeepDiveTab />;
      case 'quiz': return <QuizTab userState={userState} setUserState={setUserState} />;
      case 'reflection': return <ReflectionTab userState={userState} setUserState={setUserState} />;
      default: return <TheoryTab />;
    }
  };

  const navItems = [
    { id: 'theory', label: '개념', icon: BookOpen },
    { id: 'simulation', label: '실험실', icon: FlaskConical },
    { id: 'deepdive', label: '심화', icon: Brain },
    { id: 'quiz', label: '퀴즈', icon: HelpCircle },
    { id: 'reflection', label: '생각', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      
      {/* Header / StatusBar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
                <FlaskConical className="w-6 h-6" />
                Preprocess MicroLab
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">빅데이터 전처리 마이크로 실험실</p>
            </div>

            <div className="flex items-center gap-4">
               {/* XP Bar */}
               <div className="flex flex-col items-end w-32">
                  <div className="flex justify-between w-full text-xs font-bold mb-1">
                    <span className="text-slate-600">Lv.{level}</span>
                    <span className="text-indigo-600">{userState.xp} XP</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Navigation - Fixed at top */}
          <nav className="flex space-x-1 bg-slate-100/50 p-1.5 rounded-xl border border-slate-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'fill-current opacity-20' : ''}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'simulation' && <BadgeDisplay userState={userState} />}
        {renderTab()}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-30">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'text-indigo-600 font-bold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-bounce-short' : ''}`} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
};

export default App;
