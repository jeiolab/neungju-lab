'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import ConceptView from './components/ConceptView';
import SimulationGame from './components/SimulationGame';
import FutureExplore from './components/FutureExplore';
import QuizView from './components/QuizView';
import ReflectionView from './components/ReflectionView';
import { TabType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  const renderContent = () => {
    switch (activeTab) {
      case 'concept':
        return <ConceptView />;
      case 'simulation':
        return <SimulationGame />;
      case 'explore':
        return <FutureExplore />;
      case 'quiz':
        return <QuizView />;
      case 'reflection':
        return <ReflectionView />;
      default:
        return <ConceptView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-gray-800 font-sans selection:bg-blue-200">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;