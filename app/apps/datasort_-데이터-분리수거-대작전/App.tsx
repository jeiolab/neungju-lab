import React, { useState } from 'react';
import Header from './components/Header';
import TheorySection from './components/TheorySection';
import GameSection from './components/GameSection';
import AdvancedSection from './components/AdvancedSection';
import QuizSection from './components/QuizSection';
import ThoughtSection from './components/ThoughtSection';
import { TABS } from './constants';
import { BookOpen, Gamepad2, Beaker, CheckCircle, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TABS[1].id); // Default to Game

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheorySection />;
      case 'game': return <GameSection />;
      case 'advanced': return <AdvancedSection />;
      case 'quiz': return <QuizSection />;
      case 'think': return <ThoughtSection />;
      default: return <GameSection />;
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      case 'Beaker': return <Beaker className="w-5 h-5" />;
      case 'CheckCircle': return <CheckCircle className="w-5 h-5" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30">
      <div className="container mx-auto px-4 pb-20 max-w-5xl">
        <Header />
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-800/50 p-2 rounded-2xl backdrop-blur-sm sticky top-4 z-50 border border-slate-700/50 shadow-2xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm md:text-base
                ${activeTab === tab.id 
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50 scale-105' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}
              `}
            >
              {getIcon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <main className="min-h-[600px] bg-slate-900/30 rounded-3xl p-4 md:p-8 border border-white/5 shadow-2xl backdrop-blur-sm">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-sm">
        Smart City Data Management System © 2024
      </footer>
    </div>
  );
};

export default App;
