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
    <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto sm:max-w-4xl shadow-2xl sm:my-8 sm:rounded-[2rem] overflow-hidden border border-slate-200">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-100 z-20">
        <div>
           <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">에이전트 루프 퍼즐</h1>
           <p className="text-xs text-slate-500 font-medium">AI Coach v1.0</p>
        </div>
        <Gamification progress={progress} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
         {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 px-6 py-2 safe-area-pb">
        <ul className="flex justify-between items-center">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? 'bg-indigo-50 text-indigo-600 -translate-y-2 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                  <span className="text-[10px] font-bold">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default App;
