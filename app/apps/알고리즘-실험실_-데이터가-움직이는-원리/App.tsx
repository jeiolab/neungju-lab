'use client'

import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, BarChart2, HelpCircle, MessageSquare, Award } from 'lucide-react';
import { SortType } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import ComparisonTab from './components/ComparisonTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

enum Tab {
  THEORY = 'THEORY',
  SIMULATION = 'SIMULATION',
  COMPARISON = 'COMPARISON',
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);
  const [currentSortTypeForTheory, setCurrentSortTypeForTheory] = useState<SortType>(SortType.BUBBLE);
  
  // Badge System
  const [completedSorts, setCompletedSorts] = useState<SortType[]>([]);
  const [hasBadge, setHasBadge] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('algorithmLab_completed');
    if (saved) {
      setCompletedSorts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (completedSorts.length >= 3) {
      setHasBadge(true);
    }
  }, [completedSorts]);

  const handleSimulationComplete = (type: SortType) => {
    setCompletedSorts(prev => {
      if (!prev.includes(type)) {
        const newVal = [...prev, type];
        localStorage.setItem('algorithmLab_completed', JSON.stringify(newVal));
        return newVal;
      }
      return prev;
    });
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 개념', icon: BookOpen },
    { id: Tab.SIMULATION, label: '실험실', icon: PlayCircle },
    { id: Tab.COMPARISON, label: '비교하기', icon: BarChart2 },
    { id: Tab.QUIZ, label: '퀴즈', icon: HelpCircle },
    { id: Tab.REFLECTION, label: '생각해보기', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              알고리즘 실험실
            </h1>
          </div>
          
          {hasBadge && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              <Award size={16} /> 정렬 마스터
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        
        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap
                ${activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="animate-fadeIn">
          {activeTab === Tab.THEORY && (
            <div className="space-y-4">
              {/* Sub-nav for Theory */}
              <div className="flex justify-center gap-2 mb-6">
                 {[SortType.BUBBLE, SortType.SELECTION, SortType.INSERTION].map(type => (
                    <button
                        key={type}
                        onClick={() => setCurrentSortTypeForTheory(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold ${currentSortTypeForTheory === type ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                    >
                        {type === SortType.BUBBLE && '버블'}
                        {type === SortType.SELECTION && '선택'}
                        {type === SortType.INSERTION && '삽입'}
                    </button>
                 ))}
              </div>
              <TheoryTab currentSortType={currentSortTypeForTheory} />
            </div>
          )}
          
          {activeTab === Tab.SIMULATION && (
            <SimulationTab onComplete={handleSimulationComplete} />
          )}

          {activeTab === Tab.COMPARISON && (
            <ComparisonTab />
          )}

          {activeTab === Tab.QUIZ && (
            <QuizTab />
          )}

          {activeTab === Tab.REFLECTION && (
            <ReflectionTab />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;