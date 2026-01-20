import React, { useState } from 'react';
import { BookOpen, Flag, Brain, Activity } from 'lucide-react';
import SimulationTab from './SimulationTab';
import TheoryTab from './TheoryTab';
import QuizTab from './QuizTab';

enum Tab {
  RACE = 'race',
  THEORY = 'theory',
  QUIZ = 'quiz',
}

const SortRacerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.RACE);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Sort Racer
              </h1>
              <p className="text-xs text-slate-400">알고리즘 효율성 분석 코치</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab(Tab.THEORY)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === Tab.THEORY 
                  ? 'bg-slate-700 text-white shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 inline-block mr-2" />
              이론
            </button>
            <button
              onClick={() => setActiveTab(Tab.RACE)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === Tab.RACE 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flag className="w-4 h-4 inline-block mr-2" />
              레이스
            </button>
            <button
              onClick={() => setActiveTab(Tab.QUIZ)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === Tab.QUIZ 
                  ? 'bg-slate-700 text-white shadow-inner' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Brain className="w-4 h-4 inline-block mr-2" />
              퀴즈
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6">
        {activeTab === Tab.RACE && <SimulationTab />}
        {activeTab === Tab.THEORY && <TheoryTab />}
        {activeTab === Tab.QUIZ && <QuizTab />}
      </main>

      <footer className="p-4 text-center text-slate-600 text-sm border-t border-slate-800">
        © 2025 Sort Racer. Algorithms Visualization Project.
      </footer>
    </div>
  );
};

export default SortRacerApp;
