import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Radio, Book, Award, MessageCircle, Flame } from 'lucide-react';
import MixingConsole from './components/MixingConsole';
import SpectrumAnalysis from './components/SpectrumAnalysis';
import AudioTheory from './components/AudioTheory';
import EarTrainingQuiz from './components/EarTrainingQuiz';
import ProducersDilemma from './components/ProducersDilemma';
import { Tab, StreakData } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONSOLE);
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastLoginDate: '', missionsCompletedToday: false });

  useEffect(() => {
    // Mock Streak Loading
    const savedStreak = localStorage.getItem('goldenEarStreak');
    if (savedStreak) {
      const parsed = JSON.parse(savedStreak);
      const today = new Date().toDateString();
      if (parsed.lastLoginDate !== today) {
        // New day logic
        setStreak({
            ...parsed,
            lastLoginDate: today,
            missionsCompletedToday: false
        });
      } else {
        setStreak(parsed);
      }
    } else {
      setStreak({ count: 1, lastLoginDate: new Date().toDateString(), missionsCompletedToday: false });
    }
  }, []);

  const handleMissionComplete = () => {
    if (!streak.missionsCompletedToday) {
      const newStreak = {
        count: streak.count + 1,
        lastLoginDate: new Date().toDateString(),
        missionsCompletedToday: true
      };
      setStreak(newStreak);
      localStorage.setItem('goldenEarStreak', JSON.stringify(newStreak));
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONSOLE: return <MixingConsole />;
      case Tab.SPECTRUM: return <SpectrumAnalysis />;
      case Tab.THEORY: return <AudioTheory />;
      case Tab.QUIZ: return <EarTrainingQuiz onComplete={handleMissionComplete} />;
      case Tab.DILEMMA: return <ProducersDilemma />;
      default: return <MixingConsole />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col md:flex-row bg-studio-900 text-gray-200 font-sans">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-20 lg:w-64 bg-black border-r border-studio-800 flex flex-col justify-between flex-shrink-0">
        <div>
            <div className="p-6 flex items-center gap-3 border-b border-studio-800">
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-studio-accent to-purple-500"></div>
                <h1 className="hidden lg:block font-bold text-lg tracking-wider text-white">황금<span className="text-studio-accent">귀</span> 챌린지</h1>
            </div>
            
            <div className="flex flex-col gap-2 p-4">
                <NavButton active={activeTab === Tab.CONSOLE} onClick={() => setActiveTab(Tab.CONSOLE)} icon={<LayoutDashboard size={20} />} label="믹싱 콘솔" />
                <NavButton active={activeTab === Tab.SPECTRUM} onClick={() => setActiveTab(Tab.SPECTRUM)} icon={<Radio size={20} />} label="스펙트럼 분석" />
                <NavButton active={activeTab === Tab.THEORY} onClick={() => setActiveTab(Tab.THEORY)} icon={<Book size={20} />} label="음향 이론" />
                <NavButton active={activeTab === Tab.QUIZ} onClick={() => setActiveTab(Tab.QUIZ)} icon={<Award size={20} />} label="청음 테스트" />
                <NavButton active={activeTab === Tab.DILEMMA} onClick={() => setActiveTab(Tab.DILEMMA)} icon={<MessageCircle size={20} />} label="프로듀서의 고민" />
            </div>
        </div>

        <div className="p-4 border-t border-studio-800">
            <div className="bg-studio-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Flame className={`${streak.missionsCompletedToday ? 'text-warn' : 'text-gray-600'} fill-current`} size={20} />
                    <span className="hidden lg:block text-sm font-bold">연속 출석</span>
                </div>
                <span className="font-mono text-studio-accent font-bold">{streak.count}일</span>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-4 md:p-8 bg-studio-900 relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
         <div className="relative z-10 h-full max-w-7xl mx-auto">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-studio-accent text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
        : 'text-gray-400 hover:text-white hover:bg-studio-800'
    }`}
  >
    {icon}
    <span className="hidden lg:block text-sm">{label}</span>
  </button>
);

export default App;