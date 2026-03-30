import React, { useState } from 'react';
import Header from './components/Header';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import SpacePassport from './components/SpacePassport';
import { AppTab, TravelRecord } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.THEORY);
  const [visitedRecords, setVisitedRecords] = useState<TravelRecord[]>([]);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const handleStampPassport = (record: TravelRecord) => {
    setVisitedRecords((prev) => {
      // Avoid duplicate stamps for the same planet (or allow multiple if desired, here unique)
      const exists = prev.find(r => r.planetId === record.planetId);
      if (exists) return prev;
      return [...prev, record];
    });
  };

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.THEORY:
        return <TheoryTab />;
      case AppTab.SIMULATION:
        return (
          <SimulationTab 
            onStampPassport={handleStampPassport} 
            visitedPlanets={visitedRecords.map(r => r.planetId)} 
          />
        );
      case AppTab.DEEP_DIVE:
        return <DeepDiveTab />;
      case AppTab.QUIZ:
        return <QuizTab />;
      case AppTab.REFLECTION:
        return <ReflectionTab />;
      default:
        return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        openPassport={() => setIsPassportOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in bg-gray-50">
        {renderContent()}
      </main>

      <SpacePassport 
        isOpen={isPassportOpen} 
        onClose={() => setIsPassportOpen(false)} 
        visitedRecords={visitedRecords}
      />
    </div>
  );
};

export default App;