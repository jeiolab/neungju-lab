import React, { useState, useEffect } from 'react';
import { UserLevel } from './types';
import { TheoryTab } from './components/tabs/TheoryTab';
import { SimulationTab } from './components/tabs/SimulationTab';
import { MoreInfoTab } from './components/tabs/MoreInfoTab';
import { QuizTab } from './components/tabs/QuizTab';
import { ReflectionTab } from './components/tabs/ReflectionTab';
import { Lightbulb, BookOpen, Activity, Info, HelpCircle, MessageSquare, Award, Flame } from 'lucide-react';

const TABS = [
  { id: 'theory', label: '1. 이론', icon: BookOpen },
  { id: 'simulation', label: '2. 시뮬레이션', icon: Activity },
  { id: 'more', label: '3. 더 보기', icon: Info },
  { id: 'quiz', label: '4. 퀴즈', icon: HelpCircle },
  { id: 'reflection', label: '5. 생각해보기', icon: MessageSquare },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [dayCount, setDayCount] = useState(0);
  const [streak, setStreak] = useState(0); // Mock streak
  const [userLevel, setUserLevel] = useState<UserLevel>('인턴 설계자');

  // Gamification Logic
  const handleDayComplete = () => {
    setDayCount(prev => prev + 1);
    
    // Simulate streak logic (simplified for SPA demo)
    setStreak(prev => prev + 1);
  };

  useEffect(() => {
    if (dayCount >= 10) setUserLevel('수석 엔지니어');
    else if (dayCount >= 5) setUserLevel('시니어 엔지니어');
    else if (dayCount >= 2) setUserLevel('주니어 엔지니어');
  }, [dayCount]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-sky-500 p-2 rounded-lg shadow-[0_0_15px_rgba(14,165,233,0.3)]">
              <Lightbulb className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600 hidden sm:block">
              에코 라이트: 도시의 밤을 밝혀라
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200">
               <Award size={16} className="text-yellow-600" />
               <span className="text-slate-700">{userLevel}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200">
               <Flame size={16} className={streak >= 3 ? "text-orange-500 animate-pulse" : "text-slate-400"} />
               <span className="text-slate-700">{streak}일 연속</span>
             </div>
             {streak >= 3 && <span className="text-xs text-orange-500 font-bold hidden sm:block">에너지 히어로!</span>}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-16 z-40 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-4 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                  ${isActive 
                    ? 'border-sky-500 text-sky-600 bg-sky-50' 
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'simulation' && <SimulationTab onDayComplete={handleDayComplete} />}
        {activeTab === 'more' && <MoreInfoTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'reflection' && <ReflectionTab />}
      </main>
    </div>
  );
};

export default App;