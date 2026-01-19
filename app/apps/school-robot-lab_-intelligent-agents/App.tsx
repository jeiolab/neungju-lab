import React, { useState, useEffect } from 'react';
import { Tab, AppState, SimulationResult } from './types';
import { BADGES } from './constants';
import GamificationBar from './components/GamificationBar';
import Navigation from './components/Navigation';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.THEORY);
  const [state, setState] = useState<AppState>(() => {
    // Load from LocalStorage
    const saved = localStorage.getItem('robotLabState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      badges: BADGES,
      streak: 1,
      lastLogin: new Date().toISOString(),
      simulationRuns: [],
      quizScore: 0,
      totalXp: 0,
    };
  });

  // Check Daily Streak
  useEffect(() => {
    const today = new Date().toDateString();
    const lastLogin = new Date(state.lastLogin).toDateString();
    
    if (today !== lastLogin) {
      const isConsecutive = new Date(Date.now() - 86400000).toDateString() === lastLogin;
      setState(prev => {
        const newStreak = isConsecutive ? prev.streak + 1 : 1;
        // Check Daily Scientist Badge
        const updatedBadges = [...prev.badges];
        if (newStreak >= 3) {
            const badge = updatedBadges.find(b => b.id === 'daily_scientist');
            if (badge && !badge.earned) badge.earned = true;
        }

        return {
          ...prev,
          lastLogin: new Date().toISOString(),
          streak: newStreak,
          badges: updatedBadges,
          totalXp: prev.totalXp + 50 // Daily Login Bonus
        };
      });
    }
  }, []);

  // Persist State
  useEffect(() => {
    localStorage.setItem('robotLabState', JSON.stringify(state));
  }, [state]);

  // Handlers
  const handleSimulationComplete = (result: SimulationResult) => {
    setState(prev => {
      const newRuns = [...prev.simulationRuns, result];
      const newXp = prev.totalXp + 100;
      const updatedBadges = [...prev.badges];

      // Check 'Sensor Master' Badge
      if (newRuns.length >= 5) {
        const b = updatedBadges.find(x => x.id === 'sensor_master');
        if (b && !b.earned) b.earned = true;
      }
      
      // Check 'Decision Up' Badge
      if (result.policyType === 'LEARNING_REASONING' && result.successRate >= 80) {
        const b = updatedBadges.find(x => x.id === 'decision_up');
        if (b && !b.earned) b.earned = true;
      }

      return {
        ...prev,
        simulationRuns: newRuns,
        totalXp: newXp,
        badges: updatedBadges
      };
    });
  };

  const handleQuizComplete = (score: number) => {
    setState(prev => {
      const updatedBadges = [...prev.badges];
      if (score >= 80) {
        const b = updatedBadges.find(x => x.id === 'quiz_whiz');
        if (b && !b.earned) b.earned = true;
      }

      return {
        ...prev,
        quizScore: Math.max(prev.quizScore, score),
        totalXp: prev.totalXp + score,
        badges: updatedBadges
      };
    });
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.SIMULATION: 
        return <SimulationTab onRunComplete={handleSimulationComplete} history={state.simulationRuns} />;
      case Tab.DEEP_DIVE: return <DeepDiveTab />;
      case Tab.QUIZ: return <QuizTab onComplete={handleQuizComplete} />;
      case Tab.REFLECTION: return <ReflectionTab />;
      default: return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <GamificationBar xp={state.totalXp} badges={state.badges} streak={state.streak} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 md:mb-0">
        {renderContent()}
      </main>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;