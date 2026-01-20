import React, { useState } from 'react';
import { Tab } from './types';
import { Simulation } from './components/Simulation';
import { Theory, DeepDive, Think } from './components/Theory';
import { Quiz } from './components/Quiz';
import { BookOpen, ShoppingCart, Brain, HelpCircle, Code } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <Theory />;
      case Tab.SIMULATION:
        return <Simulation />;
      case Tab.DEEP_DIVE:
        return <DeepDive />;
      case Tab.QUIZ:
        return <Quiz />;
      case Tab.THINK:
        return <Think />;
      default:
        return <Theory />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '개념 학습', icon: <BookOpen size={18} /> },
    { id: Tab.SIMULATION, label: '실습 (CVS)', icon: <ShoppingCart size={18} /> },
    { id: Tab.DEEP_DIVE, label: '더 알아보기', icon: <Code size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: Tab.THINK, label: '생각해보기', icon: <Brain size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cvs-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                C
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">CVS Manager <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">OOP Edition</span></h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'bg-cvs-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Nav Placeholder (Simple) */}
          <div className="md:hidden">
              <span className="text-xs font-bold text-cvs-primary">Mobile View</span>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 flex justify-around p-2 pb-safe">
        {navItems.map((item) => (
            <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-1 ${
                activeTab === item.id ? 'text-cvs-primary' : 'text-gray-400'
            }`}
            >
            <div className={activeTab === item.id ? 'transform scale-110 transition-transform' : ''}>
                {item.icon}
            </div>
            <span className="text-[10px] mt-1">{item.label}</span>
            </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;