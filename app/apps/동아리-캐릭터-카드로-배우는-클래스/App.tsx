import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Theory } from './components/Theory';
import { Simulation } from './components/Simulation';
import { DeepDive } from './components/DeepDive';
import { Quiz } from './components/Quiz';
import { Discussion } from './components/Discussion';
import { Tab, UserProgress } from './types';

const STORAGE_KEY = 'classcard_v1_progress';

const INITIAL_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  badges: [],
  streak: 1,
  lastLogin: new Date().toISOString().split('T')[0],
  quizScore: 0,
  solvedQuestions: []
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('theory');
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [loading, setLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic streak logic
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastLogin !== today) {
           // If logged in yesterday, increment. If skipped a day, reset.
           // Simplified for demo: just increment if date changed
           parsed.streak += 1;
           parsed.lastLogin = today;
        }
        setProgress(parsed);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setLoading(false);
  }, []);

  // Save progress on change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, loading]);

  const handleProgressUpdate = (newProgress: Partial<UserProgress>) => {
    setProgress(prev => {
      const updated = { ...prev, ...newProgress };
      
      // Level Up Logic: Every 50 XP
      const newLevel = Math.floor(updated.xp / 50) + 1;
      
      // Badge Logic
      const newBadges = [...updated.badges];
      if (updated.solvedQuestions.length >= 5 && !newBadges.includes("Quiz Rookie")) {
          newBadges.push("Quiz Rookie");
      }
      if (newLevel >= 3 && !newBadges.includes("Class Master")) {
          newBadges.push("Class Master");
      }

      return { ...updated, level: newLevel, badges: newBadges };
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading...</div>;

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} progress={progress}>
      <div className="animate-fadeIn">
        {activeTab === 'theory' && <Theory onProgressUpdate={handleProgressUpdate} progress={progress} />}
        {activeTab === 'simulation' && <Simulation />}
        {activeTab === 'deepdive' && <DeepDive />}
        {activeTab === 'quiz' && <Quiz onProgressUpdate={handleProgressUpdate} progress={progress} />}
        {activeTab === 'discussion' && <Discussion />}
      </div>
    </Layout>
  );
};

export default App;
