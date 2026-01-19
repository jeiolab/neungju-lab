import React, { useState, useEffect } from 'react';
import { UserStats, Badge } from './types';
import { INITIAL_STATS, BADGES } from './constants';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import JobGameTab from './components/JobGameTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('concepts');
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('careerJudge_v1_stats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      // Simple streak logic check
      const lastLogin = new Date(parsed.lastLoginDate);
      const today = new Date();
      const isSameDay = lastLogin.toDateString() === today.toDateString();
      const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === lastLogin.toDateString();
      
      let newStreak = parsed.streak;
      if (!isSameDay) {
         if (isYesterday) newStreak += 1;
         else newStreak = 1;
      }

      setUserStats({
        ...parsed,
        streak: newStreak,
        lastLoginDate: new Date().toDateString()
      });
    }
    setIsLoading(false);
  }, []);

  // Save to LocalStorage whenever stats change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('careerJudge_v1_stats', JSON.stringify(userStats));
    }
  }, [userStats, isLoading]);

  const updateStats = (newXp: number, extraData: Partial<UserStats> = {}) => {
    setUserStats(prev => {
      const totalXp = prev.xp + newXp;
      const newLevel = Math.floor(totalXp / 100) + 1;
      
      // Check badges
      const tempStats = { ...prev, xp: totalXp, level: newLevel, ...extraData };
      const newBadges = [...prev.badges];
      
      BADGES.forEach(badge => {
        if (!newBadges.includes(badge.id) && badge.condition(tempStats)) {
          newBadges.push(badge.id);
          // Badge unlock alert could go here
          alert(`🎉 배지 획득: ${badge.name}\n${badge.description}`);
        }
      });

      return {
        ...tempStats,
        badges: newBadges
      };
    });
  };

  const handleGameComplete = (isCorrect: boolean, jobId: string) => {
    const xpGain = isCorrect ? 20 : 5; // Reward even for trying
    const newHistory = [...userStats.gameHistory, { jobId, isCorrect }];
    updateStats(xpGain, { gameHistory: newHistory });
  };

  const handleQuizComplete = (isCorrect: boolean, questionId: number) => {
    const xpGain = isCorrect ? 30 : 5;
    const newHistory = [...userStats.quizHistory, { questionId, isCorrect }];
    updateStats(xpGain, { quizHistory: newHistory });
    
    // Update mastery based on question concept if correct
    if (isCorrect) {
       // Ideally we map Q-ID to Concept-ID, assumed in types but for simplicity logic here
       // In a real app, map Question -> Concept ID
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-50">로딩중...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 sm:pb-10 font-sans">
      <Header stats={userStats} />

      <main className="max-w-4xl mx-auto px-4 pt-6">
        <TabNavigation currentTab={currentTab} onTabChange={setCurrentTab} />
        
        <div className="mt-4">
          {currentTab === 'concepts' && <ConceptTab mastery={userStats.conceptMastery} />}
          {currentTab === 'simulation' && <SimulationTab />}
          {currentTab === 'game' && <JobGameTab onComplete={handleGameComplete} gameHistory={userStats.gameHistory} />}
          {currentTab === 'quiz' && <QuizTab onComplete={handleQuizComplete} quizHistory={userStats.quizHistory} />}
          {currentTab === 'reflection' && <ReflectionTab />}
        </div>
      </main>
    </div>
  );
};

export default App;