import React, { useState } from 'react';
import Simulation from './components/Simulation';
import Principles from './components/Principles';
import Quiz from './components/Quiz';
import DeepDive from './components/DeepDive';
import LevelBadge from './components/LevelBadge';
import { UserStats } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    exp: 0,
    experimentsCompleted: 0
  });

  const handleExpGain = (amount: number) => {
    setUserStats(prev => {
      const newExp = prev.exp + amount;
      const levelUp = Math.floor(newExp / 100);
      return {
        ...prev,
        exp: newExp,
        level: 1 + levelUp,
        experimentsCompleted: prev.experimentsCompleted + (amount === 50 ? 1 : 0) // Assume 50 exp is simulation completion
      };
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'principles':
        return <Principles />;
      case 'simulation':
        return <Simulation onComplete={() => handleExpGain(50)} />;
      case 'deepdive':
        return <DeepDive />;
      case 'quiz':
        return <Quiz onCorrectAnswer={() => handleExpGain(20)} />;
      default:
        return <Simulation onComplete={() => handleExpGain(50)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  K-Means Lab
                </h1>
              </div>
            </div>
            <div className="hidden md:block">
              <LevelBadge stats={userStats} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile Level Badge */}
        <div className="md:hidden mb-6">
          <LevelBadge stats={userStats} />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl mb-8 overflow-x-auto">
          {[
            { id: 'principles', label: '알고리즘 원리' },
            { id: 'simulation', label: '직접 실험하기' },
            { id: 'deepdive', label: '심화 탐구' },
            { id: 'quiz', label: '퀴즈 도전' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-lg transition-all
                ${activeTab === tab.id 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
