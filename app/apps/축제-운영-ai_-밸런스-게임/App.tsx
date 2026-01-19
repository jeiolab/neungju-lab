import React, { useState, useEffect } from 'react';
import TheorySection from './components/TheorySection';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import MoreInfo from './components/MoreInfo';
import { TabView, SimulationResult, Badge } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>('THEORY');
  const [savedResults, setSavedResults] = useState<SimulationResult[]>([]);
  const [streak, setStreak] = useState(1); // Fake streak for gamification demo
  const [badges, setBadges] = useState<Badge[]>([
    { id: 'safety', name: '안전 설계자', description: '안전 목표 80점 이상 달성', icon: '🛡️', earned: false },
    { id: 'leader', name: '협업 리더', description: '협력성 80% 이상 실험', icon: '🤝', earned: false },
    { id: 'goal', name: '목표 달성왕', description: '시뮬레이션 95점 이상 달성', icon: '👑', earned: false },
  ]);

  const handleSaveResult = (result: SimulationResult) => {
    setSavedResults(prev => [...prev, result]);
    checkBadges(result);
  };

  const checkBadges = (result: SimulationResult) => {
    const newBadges = [...badges];
    let earnedNew = false;

    if (result.config.goal === '안전 최우선' && result.score >= 80 && !newBadges[0].earned) {
      newBadges[0].earned = true;
      earnedNew = true;
    }
    if (result.config.cooperation >= 80 && !newBadges[1].earned) {
      newBadges[1].earned = true;
      earnedNew = true;
    }
    if (result.score >= 95 && !newBadges[2].earned) {
      newBadges[2].earned = true;
      earnedNew = true;
    }

    if (earnedNew) {
      setBadges(newBadges);
      alert("🎉 새로운 배지를 획득했습니다!");
    }
  };

  // Sticky Header Navigation
  const renderNav = () => (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('THEORY')}>
            <span className="text-2xl">🎪</span>
            <span className="font-bold text-xl text-indigo-900 hidden sm:block">축제 운영 AI</span>
          </div>
          
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
            {[
              { id: 'THEORY', label: '1.이론 학습' },
              { id: 'SIMULATION', label: '2.실전 시뮬' },
              { id: 'MORE_INFO', label: '3.심화' },
              { id: 'QUIZ', label: '4.퀴즈' },
              { id: 'REFLECTION', label: '5.생각하기' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as TabView)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  currentTab === tab.id 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen pb-12">
      {renderNav()}

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Gamification Status Bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100">
          <div className="flex gap-2 items-center">
            <span className="text-sm font-bold text-gray-500">🔥 학습 스트릭:</span>
            <span className="text-orange-500 font-bold text-lg">{streak}일째</span>
          </div>
          <div className="flex gap-4">
            {badges.map(b => (
              <div key={b.id} className={`flex flex-col items-center ${b.earned ? 'opacity-100' : 'opacity-30 grayscale'}`} title={b.description}>
                <span className="text-2xl">{b.icon}</span>
                <span className="text-[10px] font-bold text-gray-600">{b.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="transition-opacity duration-300">
          {currentTab === 'THEORY' && <TheorySection />}
          {currentTab === 'SIMULATION' && <Simulation onSaveResult={handleSaveResult} savedResults={savedResults} />}
          {currentTab === 'MORE_INFO' && <MoreInfo />}
          {currentTab === 'QUIZ' && <Quiz />}
          {currentTab === 'REFLECTION' && <Reflection />}
        </div>
      </main>
    </div>
  );
};

export default App;