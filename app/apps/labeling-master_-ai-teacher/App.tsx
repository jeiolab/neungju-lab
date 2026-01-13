import React, { useState, useEffect } from 'react';
import { TabType, UserState, UserLevel } from './types';
import ProgressBar from './components/ProgressBar';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabLearnMore from './components/TabLearnMore';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import { Book, Cpu, Table, HelpCircle, MessageCircle, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('labelingMasterState');
    if (saved) return JSON.parse(saved);
    return {
      points: 0,
      level: UserLevel.NOVICE,
      streak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      completedSimulations: 0,
      quizMistakes: []
    };
  });

  useEffect(() => {
    localStorage.setItem('labelingMasterState', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    // Streak logic check
    const today = new Date().toISOString().split('T')[0];
    if (userState.lastLoginDate !== today) {
        // Simple logic: if last login was yesterday, increment. If older, reset to 1.
        // For this demo, we just update the date.
        setUserState(prev => ({ ...prev, lastLoginDate: today }));
    }
  }, []);

  const updatePoints = (amount: number) => {
    setUserState(prev => {
      const newPoints = prev.points + amount;
      let newLevel = prev.level;
      if (newPoints >= 100 && newPoints < 300) newLevel = UserLevel.INTERMEDIATE;
      else if (newPoints >= 300 && newPoints < 600) newLevel = UserLevel.EXPERT;
      else if (newPoints >= 600) newLevel = UserLevel.MASTER;

      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  const handleMistake = (qId: number) => {
    setUserState(prev => {
        if (prev.quizMistakes.includes(qId)) return prev;
        return { ...prev, quizMistakes: [...prev.quizMistakes, qId] };
    });
  };

  const tabs = [
    { id: 'theory', label: '이론 개념', icon: Book },
    { id: 'simulation', label: 'AI 훈련소', icon: Cpu },
    { id: 'learn-more', label: '더 알아보기', icon: Table },
    { id: 'quiz', label: '확인 문제', icon: HelpCircle },
    { id: 'discussion', label: '생각해보기', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">L</div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">라벨링 마스터</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex items-center text-orange-500 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 mr-1" fill="currentColor" />
                <span>{userState.streak}일째</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* User Progress */}
        <ProgressBar points={userState.points} level={userState.level} />

        {/* Navigation Tabs (Mobile optimized scroll) */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all
                        ${activeTab === tab.id 
                            ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                            : 'bg-white text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
            {activeTab === 'theory' && <TabTheory onComplete={() => updatePoints(5)} />}
            {activeTab === 'simulation' && <TabSimulation onScore={updatePoints} />}
            {activeTab === 'learn-more' && <TabLearnMore />}
            {activeTab === 'quiz' && <TabQuiz onScore={updatePoints} onMistake={handleMistake} savedMistakes={userState.quizMistakes} />}
            {activeTab === 'discussion' && <TabDiscussion />}
        </div>
      </main>
      
      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>© 2024 Labeling Master. All rights reserved.</p>
        <p>AI Tutor for High School Students</p>
      </footer>
    </div>
  );
};

export default App;