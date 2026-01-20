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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sort Racer</h1>
          </div>
        </div>
        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 flex gap-8">
            <button
              onClick={() => setActiveTab(Tab.RACE)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === Tab.RACE 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Flag className="w-5 h-5" />
              <span>레이스</span>
            </button>
            <button
              onClick={() => setActiveTab(Tab.THEORY)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === Tab.THEORY 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>이론</span>
            </button>
            <button
              onClick={() => setActiveTab(Tab.QUIZ)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === Tab.QUIZ 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Brain className="w-5 h-5" />
              <span>퀴즈</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === Tab.RACE && <SimulationTab />}
        {activeTab === Tab.THEORY && <TheoryTab />}
        {activeTab === Tab.QUIZ && <QuizTab />}
      </main>
    </div>
  );
};

export default SortRacerApp;
