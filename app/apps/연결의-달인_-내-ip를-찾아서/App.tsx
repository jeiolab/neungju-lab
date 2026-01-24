import React, { useState } from 'react';
import { Header } from './components/Header';
import { TabConcepts } from './components/TabConcepts';
import { TabSimulation } from './components/TabSimulation';
import { TabDeepDive } from './components/TabDeepDive';
import { TabQuiz } from './components/TabQuiz';
import { TabReflection } from './components/TabReflection';
import { AppTab, Difficulty, BadgeState } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.CONCEPTS);
  const [badges, setBadges] = useState<BadgeState>({
    beginner: false,
    intermediate: false,
    advanced: false
  });

  const handleBadgeEarned = (difficulty: Difficulty) => {
    setBadges(prev => ({
      ...prev,
      [difficulty]: true
    }));
  };

  const renderContent = () => {
    switch (currentTab) {
      case AppTab.CONCEPTS:
        return <TabConcepts />;
      case AppTab.SIMULATION:
        return <TabSimulation onBadgeEarned={handleBadgeEarned} />;
      case AppTab.DEEP_DIVE:
        return <TabDeepDive />;
      case AppTab.QUIZ:
        return <TabQuiz />;
      case AppTab.REFLECTION:
        return <TabReflection />;
      default:
        return <TabConcepts />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Header 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        badges={badges}
      />
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;