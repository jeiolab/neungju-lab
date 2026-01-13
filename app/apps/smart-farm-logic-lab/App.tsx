import React, { useState, useEffect } from 'react';
import { TabId } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import AdvancedTab from './components/AdvancedTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('theory');
  const [streak, setStreak] = useState(0);

  // Streak Logic
  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const currentStreak = parseInt(localStorage.getItem('userStreak') || '0');
    const today = new Date().toDateString();

    if (lastVisit !== today) {
      // Check if visited yesterday (mock logic for simplicity: just increment if different day)
      // In a real app, we'd check date diff == 1 day
      const newStreak = currentStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('userStreak', newStreak.toString());
      localStorage.setItem('lastVisitDate', today);
    } else {
      setStreak(currentStreak);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab />;
      case 'advanced': return <AdvancedTab />;
      case 'quiz': return <QuizTab />;
      case 'thinking': return <ThinkingTab />;
      default: return <TheoryTab />;
    }
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'theory', label: '개념 학습', icon: '📖' },
    { id: 'simulation', label: '시뮬레이션', icon: '🎮' },
    { id: 'advanced', label: '심화 로직', icon: '🚀' },
    { id: 'quiz', label: '퀴즈', icon: '📝' },
    { id: 'thinking', label: '생각해보기', icon: '🤔' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">Smart Farm <span className="text-emerald-600">Logic Lab</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
               <span className="text-orange-500">🔥</span>
               <span className="text-sm font-bold text-orange-700">{streak}일 연속 학습 중</span>
            </div>
            {streak >= 3 && (
               <div className="hidden sm:flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-200" title="3일 연속 접속 달성!">
                  <span className="text-sm">🏆</span>
                  <span className="text-xs font-bold text-yellow-800">성실한 농부</span>
               </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all
                  ${activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 md:p-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
        <p>© 2024 Smart Farm Logic Lab. Educational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;