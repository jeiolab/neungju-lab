import React, { useState, useEffect } from 'react';
import TabLearning from './components/TabLearning';
import TabPuzzle from './components/TabPuzzle';
import TabGallery from './components/TabGallery';
import TabQuiz from './components/TabQuiz';
import TabReflection from './components/TabReflection';
import Gamification from './components/Gamification';
import { UserProgress } from './types';
import { loadProgress, saveProgress, updateStreak } from './services/storageService';
import { BookOpen, Puzzle, Image, HelpCircle, MessageCircle } from 'lucide-react';

const TABS = [
  { id: 'learning', label: '학습', icon: BookOpen },
  { id: 'puzzle', label: '퍼즐', icon: Puzzle },
  { id: 'gallery', label: '갤러리', icon: Image },
  { id: 'quiz', label: '퀴즈', icon: HelpCircle },
  { id: 'reflection', label: '생각', icon: MessageCircle },
];

function App() {
  const [activeTab, setActiveTab] = useState('learning');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  useEffect(() => {
    // Initial load handling (streak update)
    const updated = updateStreak(loadProgress());
    setProgress(updated);
    saveProgress(updated);
  }, []);

  const addXp = (amount: number) => {
    const newProgress = { ...progress, xp: progress.xp + amount };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleWrongConcept = (tag: string) => {
    const newCounts = { ...progress.wrongConcepts };
    newCounts[tag] = (newCounts[tag] || 0) + 1;
    const newProgress = { ...progress, wrongConcepts: newCounts };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'learning':
        return <TabLearning onComplete={() => addXp(10)} />;
      case 'puzzle':
        return <TabPuzzle onSuccess={() => addXp(20)} />;
      case 'gallery':
        return <TabGallery />;
      case 'quiz':
        return <TabQuiz onCorrect={() => addXp(5)} onWrong={handleWrongConcept} />;
      case 'reflection':
        return <TabReflection />;
      default:
        return <TabLearning onComplete={() => addXp(10)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Sticky Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('learning')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Puzzle className="w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">에이전트 루프 퍼즐</h1>
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Agent Loop Puzzle</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'fill-current opacity-20' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* User Stats */}
          <div className="flex items-center pl-6">
            <Gamification progress={progress} />
          </div>
        </div>
        
        {/* Mobile Navigation (Horizontal Scroll) */}
        <div className="md:hidden overflow-x-auto border-t border-gray-100 no-scrollbar">
          <div className="flex px-4 py-2 space-x-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                      : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 md:pt-12">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
