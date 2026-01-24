import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import InfoTab from './components/InfoTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Activity, Info, ClipboardList, PenTool, Award } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [badgeAwarded, setBadgeAwarded] = useState<boolean>(false);

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem('fireguard_success_count') || '0');
    setSuccessCount(savedCount);
    if (savedCount >= 3) setBadgeAwarded(true);
  }, []);

  const handleSimulationSuccess = () => {
    const newCount = successCount + 1;
    setSuccessCount(newCount);
    localStorage.setItem('fireguard_success_count', newCount.toString());
    if (newCount >= 3 && !badgeAwarded) {
      setBadgeAwarded(true);
      // Small delay to show animation
      setTimeout(() => alert("축하합니다! '초기 진압 성공' 배지를 획득했습니다! 🎖️"), 500);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.SIMULATION: return <SimulationTab onSuccess={handleSimulationSuccess} />;
      case Tab.INFO: return <InfoTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.REFLECTION: return <ReflectionTab />;
      default: return <TheoryTab />;
    }
  };

  const menuItems = [
    { id: Tab.THEORY, label: '이론 학습', icon: BookOpen },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: Activity },
    { id: Tab.INFO, label: '센서 종류', icon: Info },
    { id: Tab.QUIZ, label: '퀴즈', icon: ClipboardList },
    { id: Tab.REFLECTION, label: '생각하기', icon: PenTool },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-500 p-2 rounded-lg text-white">
               <Activity size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight hidden md:block">
              IoT 파이어가드: <span className="text-red-600">학교를 지켜라!</span>
            </h1>
            <h1 className="text-lg font-black text-slate-800 tracking-tight md:hidden">
              IoT 파이어가드
            </h1>
          </div>

          <nav className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            {badgeAwarded ? (
              <span className="flex items-center gap-1 text-xs font-bold text-orange-600">
                <Award size={14} /> 초기 진압 전문가
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Award size={14} /> 배지 잠금 (시도: {successCount}/3)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </main>

      {/* Footer for Mobile Badge Status */}
      <footer className="lg:hidden bg-white border-t border-slate-200 p-2 text-center text-xs text-slate-500">
        {badgeAwarded ? (
          <span className="text-orange-600 font-bold flex items-center justify-center gap-1">
            <Award size={12} /> 초기 진압 전문가 배지 획득!
          </span>
        ) : (
          <span>배지 도전 중: {successCount}/3 회 성공</span>
        )}
      </footer>
    </div>
  );
}

export default App;
