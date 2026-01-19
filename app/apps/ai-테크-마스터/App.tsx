import React, { useState } from 'react';
import Navigation from './components/Navigation';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabDeepDive from './components/TabDeepDive';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import MasteryDashboard from './components/MasteryDashboard';
import { MasteryState, TechCategory } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(1);
  const [mastery, setMastery] = useState<MasteryState>({
    VISION: 20, // Initial base knowledge
    NLP: 20,
    GEN_AI: 20
  });

  const updateMastery = (category: TechCategory, isCorrect: boolean) => {
    setMastery(prev => {
      const currentScore = prev[category];
      // Increment heavily for correct, decrement slightly for wrong to encourage retry
      const change = isCorrect ? 15 : -5; 
      const newScore = Math.max(0, Math.min(100, currentScore + change));
      return { ...prev, [category]: newScore };
    });
  };

  const resetMastery = () => {
      setMastery({ VISION: 20, NLP: 20, GEN_AI: 20 });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 1: return <TabTheory />;
      case 2: return <TabSimulation updateMastery={updateMastery} />;
      case 3: return <TabDeepDive />;
      case 4: return <TabQuiz updateMastery={updateMastery} />;
      case 5: return <TabDiscussion />;
      default: return <TabTheory />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-gray-200 py-4 px-6 md:px-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AI Tech Master
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">IT 신입 개발자 기술 교육 과정</p>
        </div>
        <div className="text-xs text-gray-400 hidden sm:block">
            Instructor Mode: Active
        </div>
      </header>

      <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
        
        <div className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-24">
            <MasteryDashboard mastery={mastery} resetMastery={resetMastery} />
          </div>
        </div>
        
        {/* Mobile Dashboard (only visible at bottom on small screens if needed, but keeping simple for now) */}
        <div className="lg:hidden mt-8">
            <MasteryDashboard mastery={mastery} resetMastery={resetMastery} />
        </div>
      </main>
    </div>
  );
};

export default App;