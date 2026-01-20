import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TheoryTab } from './components/TheoryTab';
import { GameTab } from './components/GameTab';
import { DeepDiveTab } from './components/DeepDiveTab';
import { QuizTab } from './components/QuizTab';
import { DiscussionTab } from './components/DiscussionTab';
import { ProfileTab } from './components/ProfileTab';
import { TabView, UserStats, RefinedProblem } from './types';
import { PROBLEM_CARDS } from './constants';

const INITIAL_STATS: UserStats = {
  score: 0,
  streak: 1,
  lastPlayedDate: new Date().toDateString(),
  badges: [],
  solvedCount: 0,
  refinedCount: 0,
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabView>('THEORY');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [refinedProblems, setRefinedProblems] = useState<RefinedProblem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('computable_app_stats');
    const savedRefined = localStorage.getItem('computable_app_refined');
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      // Simple streak logic
      const today = new Date().toDateString();
      if (parsedStats.lastPlayedDate !== today) {
         // Logic to increment streak if consecutive day, reset if gap > 1 day could go here
         // For now, we just update the date
         parsedStats.lastPlayedDate = today;
      }
      setStats(parsedStats);
    }
    
    if (savedRefined) {
      setRefinedProblems(JSON.parse(savedRefined));
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('computable_app_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('computable_app_refined', JSON.stringify(refinedProblems));
  }, [refinedProblems]);

  const handleScoreUpdate = (points: number) => {
    setStats(prev => {
        const newScore = Math.max(0, prev.score + points);
        const newStats = { ...prev, score: newScore, solvedCount: prev.solvedCount + 1 };
        
        // Badge Logic
        if (newStats.solvedCount >= 5 && !newStats.badges.includes('master_classifier')) {
            newStats.badges = [...newStats.badges, 'master_classifier'];
            alert("뱃지 획득! 🏅 판별 마스터");
        }
        
        return newStats;
    });
  };

  const handleRefineComplete = (problemId: string, text: string) => {
      const problem = PROBLEM_CARDS.find(p => p.id === problemId);
      const newEntry: RefinedProblem = {
          originalId: problemId,
          title: problem?.title || 'Unknown Problem',
          userRefinement: text,
          timestamp: Date.now()
      };
      setRefinedProblems(prev => [newEntry, ...prev]);
      
      setStats(prev => {
          const newCount = prev.refinedCount + 1;
          const newBadges = [...prev.badges];
          if (newCount >= 1 && !newBadges.includes('first_refine')) {
              newBadges.push('first_refine');
              alert("뱃지 획득! 🏅 첫 번째 재정의");
          }
          return { ...prev, refinedCount: newCount, badges: newBadges };
      });
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'THEORY': return <TheoryTab />;
      case 'GAME': return <GameTab onScoreUpdate={handleScoreUpdate} onRefineComplete={handleRefineComplete} />;
      case 'DEEP_DIVE': return <DeepDiveTab />;
      case 'QUIZ': return <QuizTab onScoreUpdate={handleScoreUpdate} />;
      case 'DISCUSSION': return <DiscussionTab />;
      case 'PROFILE': return <ProfileTab stats={stats} refinedProblems={refinedProblems} />;
      default: return <TheoryTab />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab} score={stats.score}>
      {renderContent()}
    </Layout>
  );
};

export default App;