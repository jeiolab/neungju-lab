import React, { useState, useEffect } from 'react';
import { GameStats } from './types';
import Dashboard from './components/Dashboard';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import GuideTab from './components/GuideTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Gamepad2, Compass, PenTool, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    streak: 1, // Mock streak for demo
    mistakes: {}
  });

  useEffect(() => {
    // Check local storage for streak logic (mock implementation)
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    if (lastVisit !== today) {
      // Logic to increment streak would go here
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  const handleScoreUpdate = (points: number, mistakeType?: string) => {
    setStats(prev => {
      const newMistakes = { ...prev.mistakes };
      if (mistakeType) {
        newMistakes[mistakeType] = (newMistakes[mistakeType] || 0) + 1;
      }
      return {
        ...prev,
        score: prev.score + points,
        mistakes: newMistakes
      };
    });
  };

  const tabs = [
    { name: '이론 학습', icon: <BookOpen className="w-4 h-4" />, component: <TheoryTab /> },
    { name: '실전 시뮬레이션', icon: <Gamepad2 className="w-4 h-4" />, component: <SimulationTab onScoreUpdate={handleScoreUpdate} /> },
    { name: '도구 가이드', icon: <Compass className="w-4 h-4" />, component: <GuideTab /> },
    { name: '윤리 퀴즈', icon: <PenTool className="w-4 h-4" />, component: <QuizTab onScoreUpdate={handleScoreUpdate} /> },
    { name: '생각해보기', icon: <BrainCircuit className="w-4 h-4" />, component: <ReflectionTab /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-indigo-700 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              <span className="text-yellow-400">👑</span> 공유의 제왕
            </h1>
            <p className="text-indigo-200 text-sm mt-1">상황별 최적의 공유법을 찾아라!</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
        <Dashboard stats={stats} />

        <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
                {tabs.map((tab, idx) => (
                    <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all duration-300 ${
                        activeTab === idx
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white text-gray-500 hover:bg-gray-100'
                    }`}
                    >
                    {tab.icon}
                    {tab.name}
                    </button>
                ))}
            </div>
        </div>

        <div className="min-h-[400px]">
          {tabs[activeTab].component}
        </div>
      </main>
    </div>
  );
};

export default App;
