import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TheorySection } from './components/TheorySection';
import { SimulationDashboard } from './components/SimulationDashboard';
import { QuizSection } from './components/QuizSection';
import { ThinkingSection } from './components/ThinkingSection';
import { UserState } from './types';
import { loadUserState, saveUserState } from './services/storageService';
import { BookOpen, Play, HelpCircle, MessageSquare, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(loadUserState());
  const [activeTab, setActiveTab] = useState<'simulation' | 'theory' | 'quiz' | 'thinking'>('simulation');

  const handleUpdateUser = (newState: UserState) => {
    setUserState(newState);
    saveUserState(newState);
  };

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-medium transition-colors duration-200
        ${activeTab === id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}
      `}
    >
      <Icon size={20} className="mb-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">SortAlgo Trade-off Coach</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
                <span className="text-xs text-slate-500 font-medium">레벨</span>
                <span className="text-sm font-bold text-indigo-700">
                    Lv.{userState.level}
                </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <Play className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 flex gap-8">
            <TabButton id="simulation" icon={Play} label="시뮬레이션" />
            <TabButton id="theory" icon={BookOpen} label="이론" />
            <TabButton id="quiz" icon={HelpCircle} label="퀴즈" />
            <TabButton id="thinking" icon={MessageSquare} label="생각해보기" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === 'simulation' && <SimulationDashboard userState={userState} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'theory' && <TheorySection />}
        {activeTab === 'quiz' && <QuizSection userState={userState} onUpdateUser={handleUpdateUser} />}
        {activeTab === 'thinking' && <ThinkingSection />}
      </main>
    </div>
  );
};

export default App;