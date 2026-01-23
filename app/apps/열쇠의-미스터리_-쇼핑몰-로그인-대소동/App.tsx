import React, { useState } from 'react';
import { Tab, GameState } from './types';
import GamificationBar from './components/GamificationBar';
import KeyComparison from './components/KeyComparison';
import KeyExchangePuzzle from './components/KeyExchangePuzzle';
import HttpsExplainer from './components/HttpsExplainer';
import Quiz from './components/Quiz';
import ThinkAboutIt from './components/ThinkAboutIt';
import { BookOpen, Puzzle, Lock, HelpCircle, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.COMPARISON);
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    xp: 0,
    maxXp: 100,
  });

  const addXp = (amount: number) => {
    setGameState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;

      if (newXp >= prev.maxXp) {
        newXp -= prev.maxXp;
        newLevel += 1;
        newMaxXp = Math.floor(prev.maxXp * 1.5);
        alert(`레벨 업! 현재 레벨: ${newLevel}`);
      }
      return { level: newLevel, xp: newXp, maxXp: newMaxXp };
    });
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.COMPARISON:
        return <KeyComparison />;
      case Tab.PUZZLE:
        return <KeyExchangePuzzle onSuccess={() => addXp(50)} onFail={() => addXp(5)} />;
      case Tab.HTTPS:
        return <HttpsExplainer />;
      case Tab.QUIZ:
        return <Quiz onCorrect={() => addXp(20)} onWrong={() => addXp(0)} />;
      case Tab.THINK:
        return <ThinkAboutIt />;
      default:
        return <KeyComparison />;
    }
  };

  const navItems = [
    { id: Tab.COMPARISON, label: '열쇠의 종류', icon: <BookOpen size={18} /> },
    { id: Tab.PUZZLE, label: '키 교환 퍼즐', icon: <Puzzle size={18} /> },
    { id: Tab.HTTPS, label: 'HTTPS의 비밀', icon: <Lock size={18} /> },
    { id: Tab.QUIZ, label: '보안 모의고사', icon: <HelpCircle size={18} /> },
    { id: Tab.THINK, label: '생각해볼 문제', icon: <BrainCircuit size={18} /> },
  ];

  return (
    <div className="min-h-screen pb-20">
      <GamificationBar gameState={gameState} />
      
      <main className="container mx-auto mt-6 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
           {/* Navigation Tabs */}
           <div className="flex flex-wrap border-b border-slate-200">
             {navItems.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setCurrentTab(item.id)}
                 className={`
                   flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors border-b-2
                   ${currentTab === item.id 
                     ? 'border-blue-600 text-blue-600 bg-blue-50' 
                     : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                 `}
               >
                 {item.icon}
                 <span>{item.label}</span>
               </button>
             ))}
           </div>

           {/* Content Area */}
           <div className="flex-1 p-6 bg-slate-50/50">
             {renderContent()}
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;
