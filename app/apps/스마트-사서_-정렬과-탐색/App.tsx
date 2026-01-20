import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Simulation from './components/Simulation';
import Theory from './components/Theory';
import LearnMore from './components/LearnMore';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.SIMULATION);
  const [streak, setStreak] = useState(1);

  useEffect(() => {
    // Simple streak logic simulation
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      const storedStreak = parseInt(localStorage.getItem('streak') || '0');
      const newStreak = storedStreak + 1;
      setStreak(newStreak);
      localStorage.setItem('streak', newStreak.toString());
      localStorage.setItem('lastVisit', today);
    } else {
      setStreak(parseInt(localStorage.getItem('streak') || '1'));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.THEORY:
        return <Theory />;
      case AppTab.SIMULATION:
        return <Simulation />;
      case AppTab.LEARN_MORE:
        return <LearnMore />;
      case AppTab.QUIZ:
        return <Quiz />;
      case AppTab.REFLECTION:
        return <Reflection />;
      default:
        return <Simulation />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      <Navbar activeTab={activeTab} setTab={setActiveTab} streak={streak} />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 overflow-hidden flex flex-col">
         {renderContent()}
      </main>

      <footer className="bg-white border-t border-stone-200 py-4 text-center text-xs text-stone-400">
        <p>© 2024 스마트 사서 시뮬레이터.</p>
      </footer>
    </div>
  );
};

export default App;