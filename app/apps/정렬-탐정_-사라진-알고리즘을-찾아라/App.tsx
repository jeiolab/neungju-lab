import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SimulationTab from './components/Tabs/SimulationTab';
import TheoryTab from './components/Tabs/TheoryTab';
import QuizTab from './components/Tabs/QuizTab';
import ThinkTab from './components/Tabs/ThinkTab';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('simulation');

  const renderContent = () => {
    switch (currentTab) {
      case 'simulation': return <SimulationTab />;
      case 'theory': return <TheoryTab />;
      case 'quiz': return <QuizTab />;
      case 'think': return <ThinkTab />;
      default: return <SimulationTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar currentTab={currentTab} setTab={setCurrentTab} />
      
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>정렬 탐정 &copy; 2024. Gemini API 기반.</p>
        <p className="mt-1 text-xs">배열을 분석하고 알고리즘을 찾아내세요.</p>
      </footer>
    </div>
  );
};

export default App;