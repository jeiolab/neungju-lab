import React, { useState } from 'react';
import { Tab, Axis, UserStats } from './types';
import { BookOpen, Gamepad2, Layers, CheckSquare, PenTool, Trophy, Flame } from 'lucide-react';
import ConceptTab from './components/ConceptTab';
import GameTab from './components/GameTab';
import DeepDiveTab from './components/DeepDiveTab';
import QuizTab from './components/QuizTab';
import ApplicationTab from './components/ApplicationTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME);
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    score: 0,
    badges: [],
    streak: 1,
    decisionStyle: {
      [Axis.PUBLIC_INTEREST]: 50,
      [Axis.CONVENIENCE]: 50,
      [Axis.PRIVACY]: 50,
    }
  });

  const updateUserStats = (newStats: Partial<UserStats>) => {
    setUserStats(prev => ({ ...prev, ...newStats }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONCEPTS: return <ConceptTab />;
      case Tab.GAME: return <GameTab userStats={userStats} updateUserStats={updateUserStats} />;
      case Tab.DEEP_DIVE: return <DeepDiveTab />;
      case Tab.QUIZ: return <QuizTab addScore={(pts) => updateUserStats({ score: userStats.score + pts })} />;
      case Tab.APPLICATION: return <ApplicationTab />;
      default: return <GameTab userStats={userStats} updateUserStats={updateUserStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            균형 잡기: 정보 보호와 공유
          </h1>
          
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{userStats.streak}일</span>
             </div>
             <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4" />
                <span>{userStats.score}점</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 md:sticky md:top-16 md:bottom-auto md:border-t-0 md:shadow-none md:bg-transparent md:my-6 md:z-0">
         <div className="flex justify-around md:justify-center md:gap-8 p-3 md:p-0">
            {[
                { id: Tab.CONCEPTS, label: '개념', icon: BookOpen },
                { id: Tab.GAME, label: '게임', icon: Gamepad2 },
                { id: Tab.DEEP_DIVE, label: '심화', icon: Layers },
                { id: Tab.QUIZ, label: '퀴즈', icon: CheckSquare },
                { id: Tab.APPLICATION, label: '적용', icon: PenTool },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                        activeTab === item.id 
                        ? 'text-blue-600 md:bg-white md:shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <item.icon className="w-6 h-6" strokeWidth={activeTab === item.id ? 2.5 : 2} />
                    <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
                </button>
            ))}
         </div>
      </nav>
    </div>
  );
};

export default App;
