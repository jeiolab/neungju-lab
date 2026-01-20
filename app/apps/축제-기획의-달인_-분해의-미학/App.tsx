'use client'

import React, { useState, useEffect } from 'react';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabQuiz from './components/TabQuiz';
import TabReflection from './components/TabReflection';
import TabLearnMore from './components/TabLearnMore';
import { UserProgress, Badge } from './types';
import { BADGES } from './constants';
import { BookOpen, Puzzle, GraduationCap, Lightbulb, Trophy, Menu, X, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<number>(0);
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    unlockedBadges: [],
    completedSimulations: [],
    quizScore: 0,
    reflectionNotes: []
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);

  // Load Progress
  useEffect(() => {
    const saved = localStorage.getItem('festival_planner_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Save Progress & Check Badges
  useEffect(() => {
    localStorage.setItem('festival_planner_progress', JSON.stringify(progress));
    
    // Check for new badges
    BADGES.forEach(badge => {
      if (!progress.unlockedBadges.includes(badge.id)) {
        if (badge.condition(progress.xp, progress.completedSimulations.length, progress.quizScore)) {
          // Unlock Badge
          setProgress(prev => ({
            ...prev,
            unlockedBadges: [...prev.unlockedBadges, badge.id]
          }));
          setNewBadge(badge);
          setTimeout(() => setNewBadge(null), 3000);
        }
      }
    });
  }, [progress]);

  const updateXP = (amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleSimComplete = () => {
    // Only add if not already completed (simplified logic: just count them for badge)
    setProgress(prev => ({
        ...prev, 
        completedSimulations: [...prev.completedSimulations, Date.now().toString()]
    }));
  };

  const handleQuizScore = (score: number) => {
    setProgress(prev => ({ ...prev, quizScore: score, xp: prev.xp + (score * 5) }));
  };

  const tabs = [
    { id: 0, name: '이론 학습', icon: <BookOpen size={20} />, component: <TabTheory /> },
    { id: 1, name: '기획 시뮬레이션', icon: <Puzzle size={20} />, component: <TabSimulation onComplete={handleSimComplete} updateXP={updateXP} /> },
    { id: 2, name: '더 알아보기', icon: <LayoutDashboard size={20} />, component: <TabLearnMore /> },
    { id: 3, name: '퀴즈', icon: <GraduationCap size={20} />, component: <TabQuiz onScoreUpdate={handleQuizScore} /> },
    { id: 4, name: '생각해볼 문제', icon: <Lightbulb size={20} />, component: <TabReflection /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">축제 기획의 달인</h1>
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>

          {/* User Stats */}
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1 text-sm font-bold text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full">
                <span className="text-indigo-500">XP</span> {progress.xp}
             </div>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
                {mobileMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium border-b border-gray-50 ${
                  activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        {tabs[activeTab].component}
      </main>

      {/* Badge Notification Modal */}
      {newBadge && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl shadow-xl flex items-center gap-4 pr-8">
                <div className="bg-white/20 p-2 rounded-full">
                    <Trophy size={24} className="text-white" />
                </div>
                <div>
                    <p className="text-xs font-bold opacity-90 uppercase tracking-wide">배지 획득!</p>
                    <p className="font-bold text-lg">{newBadge.name}</p>
                </div>
            </div>
        </div>
      )}

      {/* Badge List (Footer Area) */}
      <div className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">나의 컬렉션</h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {BADGES.map(badge => {
                    const isUnlocked = progress.unlockedBadges.includes(badge.id);
                    return (
                        <div key={badge.id} className={`flex-shrink-0 w-32 p-3 rounded-lg border flex flex-col items-center text-center gap-2 ${isUnlocked ? 'bg-white border-yellow-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}>
                            <div className={`p-2 rounded-full ${isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'}`}>
                                <Trophy size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-800">{badge.name}</p>
                                <p className="text-[10px] text-gray-500 leading-tight mt-1">{badge.description}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
          </div>
      </div>
    </div>
  );
};

export default App;