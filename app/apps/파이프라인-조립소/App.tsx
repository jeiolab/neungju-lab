import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TheorySection from './components/TheorySection';
import PuzzleSection from './components/PuzzleSection';
import QuizSection from './components/QuizSection';
import ReflectionSection from './components/ReflectionSection';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case AppView.THEORY:
        return <TheorySection />;
      case AppView.PUZZLE:
        return <PuzzleSection />;
      case AppView.QUIZ:
        return <QuizSection />;
      case AppView.REFLECTION:
        return <ReflectionSection />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
