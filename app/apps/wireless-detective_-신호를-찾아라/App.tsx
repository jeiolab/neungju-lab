import React, { useState } from 'react';
import { BookOpen, Gamepad2, Search, HelpCircle, Lightbulb } from 'lucide-react';
import { TheoryTab } from './components/TheoryTab';
import { GameTab } from './components/GameTab';
import { DeepDiveTab } from './components/DeepDiveTab';
import { QuizTab } from './components/QuizTab';
import { FutureTab } from './components/FutureTab';

enum Tab {
  THEORY = 'THEORY',
  GAME = 'GAME',
  DEEP_DIVE = 'DEEP_DIVE',
  QUIZ = 'QUIZ',
  FUTURE = 'FUTURE'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME); // Default to Game for engagement

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.GAME: return <GameTab />;
      case Tab.DEEP_DIVE: return <DeepDiveTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.FUTURE: return <FutureTab />;
      default: return <GameTab />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 분석', icon: BookOpen },
    { id: Tab.GAME, label: '현장 수사', icon: Gamepad2 },
    { id: Tab.DEEP_DIVE, label: '심층 리포트', icon: Search },
    { id: Tab.QUIZ, label: '진실 게임', icon: HelpCircle },
    { id: Tab.FUTURE, label: '미래 연구소', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold text-xl shadow-md shadow-amber-500/30">W</div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
              Wireless <span className="text-amber-600">Detective</span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 hidden md:block font-medium">CODE NAME: SIGNAL_HUNTER</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile First approach) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-5xl mx-auto px-2">
          <div className="flex justify-between md:justify-center md:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center py-3 px-2 md:px-6 w-full md:w-auto transition-all duration-200 ${
                    isActive 
                      ? 'text-amber-600 border-t-2 border-amber-500 bg-amber-50' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-[10px] md:text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
};

export default App;