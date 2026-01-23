import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TheorySection from './components/TheorySection';
import PuzzleGame from './components/PuzzleGame';
import QuizSection from './components/QuizSection';
import ReflectionSection from './components/ReflectionSection';
import ProfileSection from './components/ProfileSection';
import { loadProgress, saveProgress } from './utils/storage';
import { LEVEL_THRESHOLDS } from './constants';
import { UserProgress } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('theory');
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  // Handle XP Gain and Level Up
  const handleXpGain = (amount: number) => {
    setProgress(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      
      // Check level up
      while (newXp >= (LEVEL_THRESHOLDS[newLevel] || Infinity)) {
        newLevel++;
      }
      
      const newProgress = {
        ...prev,
        xp: newXp,
        level: newLevel,
        solvedPuzzles: activeTab === 'puzzle' ? prev.solvedPuzzles + 1 : prev.solvedPuzzles
      };
      
      saveProgress(newProgress);
      return newProgress;
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TheorySection />;
      case 'puzzle':
        return <PuzzleGame onComplete={handleXpGain} userProgress={progress} />;
      case 'quiz':
        return <QuizSection onComplete={handleXpGain} />;
      case 'reflection':
        return <ReflectionSection />;
      case 'profile':
        return <ProfileSection progress={progress} />;
      default:
        return <TheorySection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar progress={progress} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 LZ Pattern Detective. Educational Purpose Only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;