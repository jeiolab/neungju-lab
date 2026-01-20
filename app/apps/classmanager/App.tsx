import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { QuizTab } from './components/QuizTab';
import { MoreInfoTab } from './components/MoreInfoTab';
import { AICoach } from './components/AICoach';
import { Tab } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('theory');

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab />;
      case 'quiz': return <QuizTab />;
      case 'more': return <MoreInfoTab />;
      case 'coach': return <AICoach />;
      default: return <TheoryTab />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 ml-64 p-4 lg:p-8 h-screen overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;