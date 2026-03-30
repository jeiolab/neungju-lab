import React, { useState, useEffect } from 'react';
import { UserState, UserLevel, Misconception, EncryptionCategory, Badge } from './types';
import { INITIAL_BADGES } from './constants';
import GameTab from './components/GameTab';
import TheoryTab from './components/TheoryTab';
import StoryTab from './components/StoryTab';
import QuizTab from './components/QuizTab';
import ThinkingTab from './components/ThinkingTab';
import MisconceptionModal from './components/MisconceptionModal';
import { Shield, Book, History, Brain, Trophy, AlertTriangle, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('game');
  const [userState, setUserState] = useState<UserState>({
    score: 0,
    level: '인턴 감별사',
    badges: INITIAL_BADGES,
    misconceptions: [],
    completedScenarios: []
  });
  const [showMisconceptions, setShowMisconceptions] = useState(false);

  // Level Up Logic
  useEffect(() => {
    let newLevel: UserLevel = '인턴 감별사';
    if (userState.score >= 300) newLevel = '시니어 감별사';
    else if (userState.score >= 100) newLevel = '주니어 감별사';

    if (newLevel !== userState.level) {
      setUserState(prev => ({ ...prev, level: newLevel }));
    }
    
    // Check for badges
    setUserState(prev => {
      const newBadges = prev.badges.map(b => {
        if (b.unlocked) return b;
        if (b.id === 'b4' && prev.score >= 300) return { ...b, unlocked: true };
        // Simplified badge logic for demo: unlock category badges if score > 50 and some scenarios done
        // Real implementation would track stats per category
        if (prev.score > 50 && Math.random() > 0.8) return { ...b, unlocked: true }; 
        return b;
      });
      return { ...prev, badges: newBadges };
    });

  }, [userState.score]);

  const updateScore = (points: number) => {
    setUserState(prev => ({ ...prev, score: prev.score + points }));
  };

  const recordMisconception = (scenarioTitle: string, userCat: string, correctCat: string) => {
    const newMistake: Misconception = {
      id: Date.now().toString(),
      scenarioTitle,
      userCategory: userCat,
      correctCategory: correctCat,
      timestamp: Date.now()
    };
    setUserState(prev => ({
      ...prev,
      misconceptions: [newMistake, ...prev.misconceptions]
    }));
  };

  const completeScenario = (id: string) => {
    if (!userState.completedScenarios.includes(id)) {
        setUserState(prev => ({ ...prev, completedScenarios: [...prev.completedScenarios, id]}));
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'game': return <GameTab userState={userState} updateScore={updateScore} recordMisconception={recordMisconception} completeScenario={completeScenario} />;
      case 'story': return <StoryTab />;
      case 'quiz': return <QuizTab updateScore={updateScore} />;
      case 'thinking': return <ThinkingTab level={userState.level} />;
      default: return <GameTab userState={userState} updateScore={updateScore} recordMisconception={recordMisconception} completeScenario={completeScenario} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20 md:pb-0">
      {/* Header / Stats Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight hidden md:block">암호 방식 감별사</h1>
              <p className="text-xs font-medium text-indigo-600">{userState.level}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">SCORE</span>
              <span className="text-xl font-bold font-mono text-indigo-600">{userState.score}</span>
            </div>
            <button 
              onClick={() => setShowMisconceptions(true)}
              className="p-2 relative hover:bg-slate-100 rounded-full transition-colors"
              title="오개념 도감"
            >
              <AlertTriangle className="w-6 h-6 text-slate-500" />
              {userState.misconceptions.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:bottom-auto md:top-20 md:left-0 md:w-20 md:h-screen md:border-r md:border-t-0 md:flex md:flex-col md:items-center md:pt-6 z-20 hidden md:flex">
         {/* Desktop Sidebar Nav */}
         <NavButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-20 md:hidden pb-safe">
         <NavButtons activeTab={activeTab} setActiveTab={setActiveTab} mobile />
      </nav>

      <MisconceptionModal 
        isOpen={showMisconceptions} 
        onClose={() => setShowMisconceptions(false)} 
        misconceptions={userState.misconceptions} 
      />
    </div>
  );
};

const NavButtons = ({ activeTab, setActiveTab, mobile }: { activeTab: string, setActiveTab: (t: string) => void, mobile?: boolean }) => {
  const tabs = [
    { id: 'theory', icon: Book, label: '이론' },
    { id: 'game', icon: Shield, label: '실전' },
    { id: 'story', icon: History, label: '역사' },
    { id: 'quiz', icon: Trophy, label: '퀴즈' },
    { id: 'thinking', icon: Brain, label: '생각' },
  ];

  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === tab.id 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-slate-400 hover:text-slate-600'
          } ${mobile ? 'flex-1' : 'w-16 h-16 mb-4'}`}
        >
          <tab.icon size={mobile ? 20 : 24} />
          <span className="text-[10px] font-medium mt-1">{tab.label}</span>
        </button>
      ))}
    </>
  );
};

export default App;