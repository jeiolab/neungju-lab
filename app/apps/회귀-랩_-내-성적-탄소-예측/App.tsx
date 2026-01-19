import React, { useState, useEffect } from 'react';
import { BookOpen, Activity, Zap, CheckSquare, BrainCircuit, Trophy, Star } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import AdvancedTab from './components/AdvancedTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import { UserState } from './types';

const TABS = [
  { id: 'theory', label: '개념 학습', icon: <BookOpen className="w-4 h-4"/> },
  { id: 'sim', label: '시뮬레이션 실습', icon: <Activity className="w-4 h-4"/> },
  { id: 'advanced', label: '더 알아보기', icon: <Zap className="w-4 h-4"/> },
  { id: 'quiz', label: '퀴즈', icon: <CheckSquare className="w-4 h-4"/> },
  { id: 'thinking', label: '생각해보기', icon: <BrainCircuit className="w-4 h-4"/> },
];

const INITIAL_USER_STATE: UserState = {
  level: 1,
  xp: 0,
  badges: [],
  dailyMissionCompleted: false
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theory');
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE);
  const [notification, setNotification] = useState<string | null>(null);

  // XP & Level Logic
  const addXp = (amount: number) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > prev.level) {
        setNotification(`🎉 레벨 업! Lv.${newLevel} 달성!`);
        setTimeout(() => setNotification(null), 3000);
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const handleMissionComplete = (metric: number) => {
    // Only reward once for daily mission simulation
    if (!user.dailyMissionCompleted) {
        addXp(50);
        setUser(prev => ({ ...prev, dailyMissionCompleted: true }));
        setNotification("🌟 미션 성공! +50 XP");
        setTimeout(() => setNotification(null), 3000);
    }
  };

  // Render Tab Content
  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'sim': return <SimulationTab onCompleteMission={handleMissionComplete} />;
      case 'advanced': return <AdvancedTab />;
      case 'quiz': return <QuizTab onScoreUpdate={addXp} />;
      case 'thinking': return <ThinkingTab />;
      default: return <TheoryTab />;
    }
  };

  // Get Today's Date Seed for Mission
  const today = new Date().toLocaleDateString('ko-KR');

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight md:text-xl text-slate-800">회귀 랩 (Regression Lab)</h1>
              <p className="text-xs text-slate-500 hidden md:block">내 성적 & 탄소 배출량 예측하기</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Daily Mission Pill */}
             <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600">
               <span className="bg-brand-500 text-white px-1.5 py-0.5 rounded text-[10px]">Daily</span>
               {user.dailyMissionCompleted ? <span className="text-green-600 flex items-center gap-1">완료 <CheckSquare className="w-3 h-3"/></span> : "RMSE 8 이하 만들기"}
             </div>

             {/* User Stats */}
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-brand-600">Lv.{user.level}</span>
                   <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                     <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(user.xp % 100)}%` }}></div>
                   </div>
                </div>
                <Trophy className={`w-6 h-6 ${user.level > 1 ? 'text-yellow-500' : 'text-slate-300'}`} />
             </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'border-brand-600 text-brand-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {renderContent()}
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce flex items-center gap-3 z-50">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          {notification}
        </div>
      )}
    </div>
  );
};

export default App;