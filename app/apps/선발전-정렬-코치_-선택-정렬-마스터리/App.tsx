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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header progress={progress} />
      
      {/* Navigation - 상단 고정 */}
      <nav className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex justify-center gap-2 py-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
                `}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto p-4 md:p-6 mt-4">
        {activeTab === 'theory' && <TheoryTab progress={progress} onUpdate={refreshProgress} />}
        {activeTab === 'sim' && <SimulationTab onUpdate={refreshProgress} />}
        {activeTab === 'deep' && <DeepDiveTab />}
        {activeTab === 'quiz' && <QuizTab progress={progress} onUpdate={refreshProgress} />}
        {activeTab === 'reflect' && <ReflectionTab />}
      </main>
    </div>
  );
};

export default App;
