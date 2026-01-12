import React, { useState } from 'react';
import { Header } from './components/Header';
import { ConceptView } from './components/ConceptView';
import { SimulationView } from './components/SimulationView';
import { LearnMoreView } from './components/LearnMoreView';
import { QuizView } from './components/QuizView';
import { ThinkView } from './components/ThinkView';
import { Tab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === Tab.CONCEPT && <ConceptView />}
        {activeTab === Tab.SIMULATION && <SimulationView onNavigate={setActiveTab} />}
        {activeTab === Tab.LEARN_MORE && <LearnMoreView />}
        {activeTab === Tab.QUIZ && <QuizView />}
        {activeTab === Tab.THINK && <ThinkView />}
      </main>
    </div>
  );
}

export default App;