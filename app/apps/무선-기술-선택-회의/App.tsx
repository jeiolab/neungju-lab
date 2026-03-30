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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <GamificationBar userState={userState} />

      <header className="bg-white shadow-sm pt-6 pb-4 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
          무선 기술 선택 회의
        </h1>
        <p className="text-gray-500 text-sm mt-1">상황에 딱 맞는 통신 기술을 찾아라!</p>
      </header>

      {/* Desktop Tab Navigation (Top - under header) */}
      <nav className="hidden md:block max-w-5xl mx-auto px-4 mt-6 mb-8">
        <div className="flex space-x-2 bg-gray-200/50 p-1.5 rounded-xl inline-flex">
          {[
            { id: 1, label: '개념', icon: Book },
            { id: 2, label: '미션', icon: Crosshair },
            { id: 3, label: '탐구', icon: Layout },
            { id: 4, label: '퀴즈', icon: HelpCircle },
            { id: 5, label: '설계', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Tab Navigation (Top - under header) */}
      <nav className="md:hidden bg-white border-b border-gray-200 px-4 py-2 z-40 shadow-sm">
        <div className="flex justify-between items-center overflow-x-auto">
          {[
            { id: 1, label: '개념', icon: Book },
            { id: 2, label: '미션', icon: Crosshair },
            { id: 3, label: '탐구', icon: Layout },
            { id: 4, label: '퀴즈', icon: HelpCircle },
            { id: 5, label: '설계', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto mt-6 mb-10">
        {renderTab()}
      </main>
    </div>
  );
};

export default App;
