'use client';

import React, { useState } from 'react';
import { Tab } from './types';
import TheoryView from './components/TheoryView';
import SimulationView from './components/SimulationView';
import QuizView from './components/QuizView';
import EssayView from './components/EssayView';
import { BookOpen, Activity, HelpCircle, PenTool, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('simulation');

  const tabs = [
    { id: 'theory', label: '이론 학습', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulation', label: '방어 시뮬레이션', icon: <Activity className="w-4 h-4" /> },
    { id: 'quiz', label: '공격 일지', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'essay', label: '생각해볼 문제', icon: <PenTool className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryView />;
      case 'simulation': return <SimulationView />;
      case 'quiz': return <QuizView />;
      case 'essay': return <EssayView />;
      default: return <SimulationView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-lab-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-primary-500 p-2 rounded-lg">
                 <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tighter text-lab-800">
                위협 <span className="text-primary-600">데이터베이스</span>
              </span>
            </div>
            
            <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-lab-100 text-primary-700' 
                      : 'text-lab-500 hover:text-lab-900 hover:bg-lab-50'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-lab-50">
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full py-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;