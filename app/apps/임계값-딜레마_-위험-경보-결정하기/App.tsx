import React, { useState } from 'react';
import { TabState } from './types';
import { Concept } from './components/Concept';
import { Simulation } from './components/Simulation';
import { Quiz } from './components/Quiz';
import { BookOpen, Activity, HelpCircle, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabState>('CONCEPT');
  const [level, setLevel] = useState(1);

  const handleConceptComplete = () => {
    setActiveTab('SIMULATION');
  };

  const handleLevelUp = () => {
    setLevel(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Activity size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">임계값 딜레마 <span className="text-slate-400 font-normal text-sm ml-2">로지스틱 회귀</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                <Trophy size={14} className="text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800">LV.{level} 균형의 달인</span>
             </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto flex">
            <button 
                onClick={() => setActiveTab('CONCEPT')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'CONCEPT' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <BookOpen size={20} />
                <span className="text-xs font-bold">1. 개념 배우기</span>
            </button>
            <button 
                onClick={() => setActiveTab('SIMULATION')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'SIMULATION' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <Activity size={20} />
                <span className="text-xs font-bold">2. 시뮬레이션</span>
            </button>
            <button 
                onClick={() => setActiveTab('QUIZ')}
                className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'QUIZ' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
                <HelpCircle size={20} />
                <span className="text-xs font-bold">3. 퀴즈 도전</span>
            </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="py-8 animate-fade-in">
          {activeTab === 'CONCEPT' && <Concept onComplete={handleConceptComplete} />}
          {activeTab === 'SIMULATION' && <Simulation onLevelUp={handleLevelUp} />}
          {activeTab === 'QUIZ' && <Quiz />}
        </div>
      </main>

      <footer className="p-6 text-center text-slate-400 text-sm">
         <p>Logistic Regression Educational App © 2024</p>
      </footer>
    </div>
  );
};

export default App;