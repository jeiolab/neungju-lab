import React, { useState, useEffect } from 'react';
import GamificationBar from './components/GamificationBar';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import { UserState, Badge } from './types';
import { BADGES } from './constants';
import { Book, Crosshair, HelpCircle, Brain, Layout } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [userState, setUserState] = useState<UserState>({
    points: 0,
    level: 1,
    streak: 0,
    badges: [],
    decisions: {},
    completedQuizzes: [],
    mastery: { WiFi: 0, Bluetooth: 0, NFC: 0, RFID: 0, Cellular: 0 }
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('net_app5_mastery');
    if (savedState) {
      try {
        setUserState(JSON.parse(savedState));
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('net_app5_mastery', JSON.stringify(userState));
  }, [userState]);

  const addPoints = (amount: number) => {
    setUserState(prev => {
      const newPoints = prev.points + amount;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  const unlockBadge = (badge: Badge) => {
    if (!userState.badges.includes(badge.name)) {
      setUserState(prev => ({
        ...prev,
        badges: [...prev.badges, badge.name]
      }));
      // Could add a toast notification here
      alert(`🏆 배지 획득: ${badge.name}!`);
    }
  };

  const handleDecisionComplete = (scenarioId: string, score: number) => {
    addPoints(score > 80 ? 20 : 10);
    
    // Check for "First Decision" badge logic (simplified)
    const badge = BADGES.find(b => b.id === 'b1');
    if (badge) unlockBadge(badge);

    // Update decisions history
    setUserState(prev => ({
        ...prev,
        decisions: {
            ...prev.decisions,
            [scenarioId]: { tech: 'WiFi', score, timestamp: Date.now() } // Tech is simplified here, in real app pass tech
        }
    }));
  };

  const handleQuizComplete = (quizId: number) => {
    if (!userState.completedQuizzes.includes(quizId)) {
        addPoints(15);
        setUserState(prev => ({
            ...prev,
            completedQuizzes: [...prev.completedQuizzes, quizId]
        }));
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 1: return <ConceptTab />;
      case 2: return <SimulationTab onDecisionComplete={handleDecisionComplete} />;
      case 3: return <LearnMoreTab />;
      case 4: return <QuizTab onQuizComplete={handleQuizComplete} completedQuizzes={userState.completedQuizzes} />;
      case 5: return <ThinkingTab />;
      default: return <ConceptTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20 md:pb-0">
      <GamificationBar userState={userState} />

      <header className="bg-white shadow-sm pt-6 pb-4 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
          무선 기술 선택 회의
        </h1>
        <p className="text-gray-500 text-sm mt-1">상황에 딱 맞는 통신 기술을 찾아라!</p>
      </header>

      <main className="max-w-5xl mx-auto mt-6 mb-24 md:mb-10">
        {renderTab()}
      </main>

      {/* Mobile Bottom Navigation / Desktop Top Tabs could be implemented differently, 
          but using a fixed bottom nav for consistency with "App" feel */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] px-4 py-2 z-50">
        <div className="max-w-5xl mx-auto flex justify-around items-center">
          <button onClick={() => setActiveTab(1)} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Book className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">개념</span>
          </button>
          <button onClick={() => setActiveTab(2)} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Crosshair className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">미션</span>
          </button>
          <button onClick={() => setActiveTab(3)} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Layout className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">탐구</span>
          </button>
          <button onClick={() => setActiveTab(4)} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <HelpCircle className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">퀴즈</span>
          </button>
          <button onClick={() => setActiveTab(5)} className={`flex flex-col items-center p-2 rounded-lg ${activeTab === 5 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <Brain className="w-6 h-6" />
            <span className="text-xs font-bold mt-1">설계</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
