import React, { useState, useEffect } from 'react';
import TabTheory from './components/TabTheory';
import TabGame from './components/TabGame';
import TabDeepDive from './components/TabDeepDive';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import Dashboard from './components/Dashboard';
import { UserStats } from './types';
import { Book, Gamepad2, Brain, CheckSquare, MessageCircle, Menu, X } from 'lucide-react';

const TABS = [
  { id: 'theory', label: '이론 개념', icon: <Book size={18} /> },
  { id: 'game', label: '업무 분류', icon: <Gamepad2 size={18} /> },
  { id: 'deepdive', label: '심화 학습', icon: <Brain size={18} /> },
  { id: 'quiz', label: '퀴즈 확인', icon: <CheckSquare size={18} /> },
  { id: 'discussion', label: '토론/AI', icon: <MessageCircle size={18} /> },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    gameHighScore: 0,
    quizScore: 0,
    totalQuizAttempts: 0,
    weakConcepts: [],
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('scaleOfAbilityStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scaleOfAbilityStats', JSON.stringify(stats));
  }, [stats]);

  const handleGameScore = (score: number) => {
    setStats(prev => ({
      ...prev,
      gameHighScore: Math.max(prev.gameHighScore, score)
    }));
  };

  const handleQuizComplete = (score: number, weakConcepts: string[]) => {
    setStats(prev => ({
      ...prev,
      quizScore: Math.max(prev.quizScore, score), // Keep highest quiz score
      totalQuizAttempts: prev.totalQuizAttempts + 1,
      weakConcepts: [...prev.weakConcepts, ...weakConcepts]
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TabTheory />;
      case 'game': return <TabGame onScoreUpdate={handleGameScore} />;
      case 'deepdive': return <TabDeepDive />;
      case 'quiz': return <TabQuiz onQuizComplete={handleQuizComplete} />;
      case 'discussion': return <TabDiscussion />;
      default: return <TabTheory />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Dashboard (Desktop) */}
      <Dashboard stats={stats} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center z-50 sticky top-0">
          <span className="font-bold text-lg text-slate-800">
            능력의 저울
          </span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-700">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Stats Drawer (Simplified) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white p-4 absolute top-16 left-0 w-full z-40 border-b border-slate-200 shadow-xl">
             <div className="flex justify-between items-center mb-4">
               <span className="text-slate-500">총점</span>
               <span className="text-xl font-bold text-indigo-600">{stats.gameHighScore + stats.quizScore}</span>
             </div>
             <p className="text-xs text-slate-400 text-center">대시보드는 PC화면에서 최적화되어 있습니다.</p>
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="bg-white border-b border-slate-200 px-4 md:px-8 sticky top-0 z-40">
          <ul className="flex overflow-x-auto no-scrollbar gap-6">
            {TABS.map((tab) => (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-all text-sm md:text-base font-medium ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}