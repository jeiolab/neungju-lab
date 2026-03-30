import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ConceptTab from './components/ConceptTab';
import PracticeTab from './components/PracticeTab';
import ContextTab from './components/ContextTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import { UserState } from './types';

function App() {
  const [activeTab, setActiveTab] = useState(1);
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('user_state');
    return saved ? JSON.parse(saved) : { xp: 0, streak: 1, badges: [], completedLevels: [], completedQuizzes: [] };
  });

  useEffect(() => {
    localStorage.setItem('user_state', JSON.stringify(userState));
  }, [userState]);

  const addXp = (amount: number) => {
    setUserState(prev => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 1: return <ConceptTab />;
      case 2: return <PracticeTab onSuccess={addXp} />;
      case 3: return <ContextTab />;
      case 4: return <QuizTab onSuccess={addXp} />;
      case 5: return <ThinkingTab />;
      default: return <ConceptTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header userState={userState} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
