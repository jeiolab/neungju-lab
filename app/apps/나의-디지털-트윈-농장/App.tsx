import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabTech from './components/TabTech';
import TabQuiz from './components/TabQuiz';
import TabExpansion from './components/TabExpansion';
import { BADGES } from './constants';
import { Badge } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1); // Default to Simulation
  const [streak, setStreak] = useState(1);
  const [myBadges, setMyBadges] = useState<Badge[]>(BADGES);

  // Load persistence (Simulated)
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
        const storedStreak = parseInt(localStorage.getItem('streak') || '0');
        const newStreak = storedStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('streak', newStreak.toString());
        localStorage.setItem('lastLogin', today);
        
        // Grant First Login Badge
        awardBadge('first_login');
    } else {
        setStreak(parseInt(localStorage.getItem('streak') || '1'));
    }
  }, []);

  const awardBadge = (id: string) => {
      setMyBadges(prev => {
          const badgeIndex = prev.findIndex(b => b.id === id);
          if (badgeIndex !== -1 && !prev[badgeIndex].earned) {
              const newBadges = [...prev];
              newBadges[badgeIndex] = { ...newBadges[badgeIndex], earned: true };
              // Simple toast simulation
              setTimeout(() => alert(`🏆 배지 획득: ${newBadges[badgeIndex].name}!`), 500);
              return newBadges;
          }
          return prev;
      });
  };

  const handleScoreUpdate = (score: number) => {
      if (score >= 95) {
          awardBadge('expert_analyst');
      }
  };

  const handleScenarioSuccess = () => {
      awardBadge('crisis_manager');
  };

  const renderContent = () => {
    switch(activeTab) {
        case 0: return <TabTheory />;
        case 1: return <TabSimulation onScoreUpdate={handleScoreUpdate} onScenarioSuccess={handleScenarioSuccess} />;
        case 2: return <TabTech />;
        case 3: return <TabQuiz />;
        case 4: return <TabExpansion />;
        default: return <TabSimulation onScoreUpdate={handleScoreUpdate} onScenarioSuccess={handleScenarioSuccess} />;
    }
  };

  return (
    <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streak={streak} 
        badges={myBadges.filter(b => b.earned).length}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;