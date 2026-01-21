import React, { useState } from 'react';
import { TabId } from './types';
import { TheoryTab } from './components/Tabs/TheoryTab';
import { SimulationTab } from './components/Tabs/SimulationTab';
import { QuizTab } from './components/Tabs/QuizTab';
import { LearnMoreTab } from './components/Tabs/LearnMoreTab';
import { ReflectionTab } from './components/Tabs/ReflectionTab';
import { BookOpen, Gamepad2, GraduationCap, BrainCircuit, MessageSquareQuote } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 학습', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: '시뮬레이션', icon: <Gamepad2 size={18} /> },
    { id: 'learn-more', label: '더 알아보기', icon: <GraduationCap size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <BrainCircuit size={18} /> },
    { id: 'reflection', label: '생각 나누기', icon: <MessageSquareQuote size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab />;
      case 'learn-more': return <LearnMoreTab />;
      case 'quiz': return <QuizTab />;
      case 'reflection': return <ReflectionTab />;
      default: return <SimulationTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">데이터 가디언</h1>
              <p className="text-xs text-slate-400">주제 4: 빅데이터 수집과 윤리</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-800 p-1 rounded-lg overflow-x-auto max-w-full">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2024 데이터 가디언 교육 프로젝트. React & Tailwind로 제작됨.</p>
      </footer>
    </div>
  );
};

export default App;