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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold text-xl shadow-md shadow-amber-500/30">W</div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">
                  Wireless <span className="text-amber-600">Detective</span>
                </h1>
                <p className="text-xs text-slate-500 hidden md:block font-medium">CODE NAME: SIGNAL_HUNTER</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-amber-600 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden overflow-x-auto pb-2 px-4 scrollbar-hide">
            <div className="flex space-x-2 w-max">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                      ${isActive 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                      }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6">
        {renderContent()}
      </main>

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