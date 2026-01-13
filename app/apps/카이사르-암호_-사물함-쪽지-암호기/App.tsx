import React, { useState, useEffect } from 'react';
import { TabId, UserStats, Badge } from './types';
import { INITIAL_BADGES } from './constants';
import Simulation from './components/Simulation';
import Theory from './components/Theory';
import HistoryTimeline from './components/HistoryTimeline';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import DailyMission from './components/DailyMission';
import { BookOpen, Activity, History, Trophy, MessageCircle, Star } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');
  const [stats, setStats] = useState<UserStats>({
    exp: 0,
    level: 1,
    streak: 1,
    lastLoginDate: new Date().toISOString().split('T')[0],
    simulationCount: 0,
    decryptionSuccessCount: 0,
    badges: INITIAL_BADGES,
    quizScore: 0,
    dailyMissionCompleted: false,
    dailyMissionDate: ""
  });

  // Load stats from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('caesar_user_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Streak logic
      const today = new Date().toISOString().split('T')[0];
      if (parsed.lastLoginDate !== today) {
        // Logic for streak increment would go here (simplified for now)
        parsed.lastLoginDate = today;
      }
      setStats(parsed);
    }
  }, []);

  // Save stats to LocalStorage
  useEffect(() => {
    localStorage.setItem('caesar_user_stats', JSON.stringify(stats));
  }, [stats]);

  const unlockBadge = (id: string) => {
    setStats(prev => {
      if (prev.badges.find(b => b.id === id && b.unlocked)) return prev;
      
      const newBadges = prev.badges.map(b => 
        b.id === id ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
      );
      
      // Toast or visual cue could be added here
      // alert(`뱃지 획득! ${newBadges.find(b => b.id === id)?.name}`); 
      
      return { ...prev, badges: newBadges, exp: prev.exp + 50 };
    });
  };

  const handleSimulate = (key: number, isDecrypt: boolean) => {
    setStats(prev => {
      let newDecryptionCount = prev.decryptionSuccessCount;
      if (isDecrypt) {
        newDecryptionCount += 1;
        if (newDecryptionCount >= 5) unlockBadge('decrypt_master');
      }
      
      if (prev.simulationCount === 0) unlockBadge('first_step');

      return {
        ...prev,
        simulationCount: prev.simulationCount + 1,
        decryptionSuccessCount: newDecryptionCount
      };
    });
  };

  const handleQuizUpdate = (score: number) => {
    setStats(prev => ({ ...prev, quizScore: Math.max(prev.quizScore, score) }));
    if (score >= 80) unlockBadge('quiz_ace');
  };

  const handleDailyMissionComplete = () => {
    setStats(prev => ({ ...prev, dailyMissionCompleted: true, exp: prev.exp + 100 }));
    unlockBadge('daily_hero');
  };

  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'theory', label: '개념', icon: BookOpen },
    { id: 'simulation', label: '실습', icon: Activity },
    { id: 'history', label: '역사', icon: History },
    { id: 'quiz', label: '퀴즈', icon: Trophy },
    { id: 'reflection', label: '생각', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <h1 className="font-bold text-lg hidden md:block">카이사르 암호기</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-4 text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <span>EXP: {stats.exp}</span>
                <span>LV: {Math.floor(stats.exp / 100) + 1}</span>
             </div>
             
             {/* Badge preview (small) */}
             <div className="flex gap-1">
                {stats.badges.filter(b => b.unlocked).slice(0, 3).map(b => (
                    <span key={b.id} title={b.name} className="text-amber-500 text-xs">●</span>
                ))}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Daily Mission Banner (Only on Sim tab or Top) */}
        <div className="mb-8">
            <DailyMission 
                onComplete={handleDailyMissionComplete} 
                isCompleted={stats.dailyMissionCompleted} 
            />
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'theory' && <Theory />}
          {activeTab === 'simulation' && <Simulation onSimulate={handleSimulate} onBadgeEarn={unlockBadge} />}
          {activeTab === 'history' && <HistoryTimeline />}
          {activeTab === 'quiz' && <Quiz onScoreUpdate={handleQuizUpdate} />}
          {activeTab === 'reflection' && <Reflection />}
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-2 flex justify-between md:hidden z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <tab.icon size={20} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

       {/* Desktop Tab Bar (Top) */}
      <div className="hidden md:flex justify-center gap-8 mb-8 border-b border-slate-200">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-4 font-medium transition-all ${
                    activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-slate-500 hover:text-indigo-500'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>
    </div>
  );
};

export default App;
