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
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <div className="container mx-auto px-4 pb-20 max-w-5xl">
        <Header />
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm sticky top-4 z-50 border border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm md:text-base
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {getIcon(tab.icon)}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <main className="min-h-[600px] bg-white rounded-3xl p-4 md:p-8 border border-gray-200 shadow-sm">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
