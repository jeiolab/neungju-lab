import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TheoryTab from './components/tabs/TheoryTab';
import SimulationTab from './components/tabs/SimulationTab';
import QuizTab from './components/tabs/QuizTab';
import DeepDiveTab from './components/tabs/DeepDiveTab';
import ReflectionTab from './components/tabs/ReflectionTab';
import { getProgress } from './services/storageService';
import { UserProgress } from './types';
import { Book, PlayCircle, HelpCircle, Layers, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'quiz' | 'deep' | 'reflect'>('theory');
  const [progress, setProgress] = useState<UserProgress>(getProgress());

  const refreshProgress = () => {
    setProgress(getProgress());
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const tabs = [
    { id: 'theory', label: '이론 개념', icon: Book },
    { id: 'sim', label: '시뮬레이션', icon: PlayCircle },
    { id: 'deep', label: '더 알아보기', icon: Layers },
    { id: 'quiz', label: '퀴즈/확인', icon: HelpCircle },
    { id: 'reflect', label: '생각하기', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      <Header progress={progress} />
      
      <main className="max-w-6xl mx-auto p-4 md:p-6 mt-4">
        {activeTab === 'theory' && <TheoryTab progress={progress} onUpdate={refreshProgress} />}
        {activeTab === 'sim' && <SimulationTab onUpdate={refreshProgress} />}
        {activeTab === 'deep' && <DeepDiveTab />}
        {activeTab === 'quiz' && <QuizTab progress={progress} onUpdate={refreshProgress} />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden z-50">
        <div className="flex justify-around items-center h-16">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1
                ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}
              `}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Side/Top Navigation (Simple Tab Bar for Desktop) */}
      <div className="hidden md:flex justify-center gap-4 mb-6 sticky top-20 z-40">
        <div className="bg-white/80 backdrop-blur shadow-sm p-1.5 rounded-xl border border-slate-200 inline-flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
              `}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
