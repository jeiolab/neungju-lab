import React, { useState, useEffect } from 'react';
import { Tab, UserStats, DailyMission } from './types';
import { TabSimulator } from './components/TabSimulator';
import { TabCorrelation } from './components/TabCorrelation';
import { TabSDGs } from './components/TabSDGs';
import { Activity, BarChart2, Globe, Leaf } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATOR);
  
  // Gamification State
  const [stats, setStats] = useState<UserStats>({
    score: 0,
    streak: 1,
    lastLoginDate: new Date().toDateString(),
    missionsSolved: 0
  });

  const [todaysMission, setTodaysMission] = useState<DailyMission>({
    targetPM25: 15,
    fixedHumidity: 80,
    fixedWind: 5,
    fixedFactory: 50,
    description: "비상! 높은 습도(80%)로 인해 대기가 정체되었습니다. 교통량을 줄여 미세먼지 농도를 '좋음'(15 이하) 수준으로 낮추세요.",
    solved: false
  });

  // Load stats from local storage
  useEffect(() => {
    const savedStats = localStorage.getItem('dustForecasterStats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      // Simple streak logic check
      const today = new Date().toDateString();
      if (parsed.lastLoginDate !== today) {
         // It's a new day
         parsed.lastLoginDate = today;
         // In a real app, check if it was yesterday for streak increment. Here we just +1 for demo.
         parsed.streak += 1;
         // Reset mission daily
         setTodaysMission(prev => ({ ...prev, solved: false }));
      }
      setStats(parsed);
    } else {
        localStorage.setItem('dustForecasterStats', JSON.stringify(stats));
    }
  }, []);

  // Save stats
  useEffect(() => {
    localStorage.setItem('dustForecasterStats', JSON.stringify(stats));
  }, [stats]);

  const handleMissionComplete = () => {
    if (todaysMission.solved) return;
    
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
    audio.play().catch(e => console.log("Audio play failed interaction required"));

    setTodaysMission(prev => ({ ...prev, solved: true }));
    setStats(prev => ({
        ...prev,
        score: prev.score + 100,
        missionsSolved: prev.missionsSolved + 1
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">미세먼지 예보관</h1>
              <span className="text-xs text-slate-500 font-medium">지구 환경 관측소</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs text-slate-500">예보관 등급</span>
                <span className="text-sm font-bold text-blue-600">
                    {stats.score > 500 ? '수석 연구원' : '신입 연구원'}
                </span>
             </div>
             <div className="flex gap-2">
                 <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                    🔥 {stats.streak}일 연속
                 </div>
                 <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                    🏆 {stats.score}점
                 </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl mb-8 w-fit mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab(Tab.CORRELATION)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.CORRELATION 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BarChart2 size={18} />
            데이터 분석
          </button>
          <button
            onClick={() => setActiveTab(Tab.SIMULATOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.SIMULATOR
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Activity size={18} />
            예보 시뮬레이터
          </button>
          <button
            onClick={() => setActiveTab(Tab.SDGS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.SDGS
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Globe size={18} />
            SDGs 목표
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[500px]">
          {activeTab === Tab.CORRELATION && <TabCorrelation />}
          {activeTab === Tab.SIMULATOR && (
            <TabSimulator 
                mission={todaysMission} 
                onMissionComplete={handleMissionComplete} 
                stats={stats}
            />
          )}
          {activeTab === Tab.SDGS && <TabSDGs />}
        </div>
      </main>
    </div>
  );
};

export default App;