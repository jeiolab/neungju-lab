import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TabNav, { DesktopNav } from './components/TabNav';
import ConceptView from './components/ConceptView';
import SimulationView from './components/SimulationView';
import QuizView from './components/QuizView';
import ThinkView from './components/ThinkView';
import MoreView from './components/MoreView';
import { UserState, TabType } from './types';
import { BADGES } from './constants';

const INITIAL_STATE: UserState = {
  xp: 0,
  level: 1,
  badges: [],
  streak: 0,
  lastLoginDate: '',
  mastery: { c1: 0, c2: 0, c3: 0, c4: 0 },
  wrongNotes: [],
  essayAnswers: {}
};

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('concept');
  const [user, setUser] = useState<UserState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ds1_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic streak logic
        const today = new Date().toDateString();
        if (parsed.lastLoginDate !== today) {
           // If last login was yesterday, increment streak
           const yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           if (parsed.lastLoginDate === yesterday.toDateString()) {
             parsed.streak += 1;
           } else if (parsed.lastLoginDate !== today) {
             // Streak broken
             parsed.streak = 1;
           }
           parsed.lastLoginDate = today;
        }
        setUser(parsed);
      } else {
        setUser({ ...INITIAL_STATE, lastLoginDate: new Date().toDateString(), streak: 1 });
      }
    } catch (e) {
      console.error("Load failed", e);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage & Check Badges
  useEffect(() => {
    if (!isLoaded) return;
    
    // Check for new badges
    const newBadges = [...user.badges];
    let badgeAdded = false;
    BADGES.forEach(badge => {
        if (!user.badges.includes(badge.id) && badge.condition(user)) {
            newBadges.push(badge.id);
            badgeAdded = true;
            // Simple alert for demo (in real app, use toast)
            // alert(`🏆 새 배지 획득: ${badge.name}`);
        }
    });

    const updatedUser = badgeAdded ? { ...user, badges: newBadges } : user;
    if (badgeAdded) setUser(updatedUser);

    localStorage.setItem('ds1_progress', JSON.stringify(updatedUser));
  }, [user, isLoaded]);

  const handleUpdateMastery = (id: string, delta: number) => {
    setUser(prev => {
      const current = prev.mastery[id] || 0;
      const newScore = Math.max(0, Math.min(100, current + delta));
      // XP Logic: Small xp for interaction
      const xpGain = delta > 0 ? 2 : 0;
      return {
        ...prev,
        mastery: { ...prev.mastery, [id]: newScore },
        xp: prev.xp + xpGain,
        level: Math.floor((prev.xp + xpGain) / 100) + 1
      };
    });
  };

  const handleQuizComplete = (score: number, wrongs: any[]) => {
    setUser(prev => ({
      ...prev,
      xp: prev.xp + score,
      level: Math.floor((prev.xp + score) / 100) + 1,
      wrongNotes: [...prev.wrongNotes, ...wrongs]
    }));
  };

  const handleSaveEssay = (id: string, text: string) => {
    setUser(prev => ({
        ...prev,
        essayAnswers: { ...prev.essayAnswers, [id]: text }
    }));
  };

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Layout user={user} activeTab={activeTab}>
      <DesktopNav activeTab={activeTab} onChange={setActiveTab} />
      
      <div className="animate-in fade-in duration-500">
        {activeTab === 'concept' && <ConceptView user={user} onUpdateMastery={handleUpdateMastery} />}
        {activeTab === 'simulation' && <SimulationView />}
        {activeTab === 'quiz' && <QuizView user={user} onComplete={handleQuizComplete} />}
        {activeTab === 'think' && <ThinkView user={user} onSave={handleSaveEssay} />}
        {activeTab === 'more' && <MoreView user={user} />}
      </div>

      <TabNav activeTab={activeTab} onChange={setActiveTab} />
    </Layout>
  );
}

export default App;