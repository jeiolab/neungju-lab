import React, { useState } from 'react';
import { TabType } from './types';
import TheoryTab from './components/Tabs/TheoryTab';
import SimulationTab from './components/Tabs/SimulationTab';
import DeepDiveTab from './components/Tabs/DeepDiveTab';
import QuizTab from './components/Tabs/QuizTab';
import DiscussionTab from './components/Tabs/DiscussionTab';
import { BookOpen, Gamepad2, Microscope, HelpCircle, MessageSquare, Award } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.THEORY);
  const [theoryCompleted, setTheoryCompleted] = useState(false);

  const tabs = [
    { id: TabType.THEORY, label: '개념 비교', icon: BookOpen },
    { id: TabType.SIMULATION, label: '코딩 대결', icon: Gamepad2 },
    { id: TabType.DEEP_DIVE, label: '더 알아보기', icon: Microscope },
    { id: TabType.QUIZ, label: '퀴즈', icon: HelpCircle },
    { id: TabType.DISCUSSION, label: '토론하기', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white shadow">
               VS
             </div>
             <h1 className="text-lg md:text-xl font-bold tracking-tight">규칙 vs 데이터: 코딩 대결</h1>
          </div>
          
          {theoryCompleted && (
            <div className="hidden md:flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 animate-fade-in">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-slate-300">알고리즘 설계자</span>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${isActive 
                      ? 'border-blue-400 text-blue-400' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {activeTab === TabType.THEORY && (
          <TheoryTab onComplete={() => setTheoryCompleted(true)} />
        )}
        {activeTab === TabType.SIMULATION && <SimulationTab />}
        {activeTab === TabType.DEEP_DIVE && <DeepDiveTab />}
        {activeTab === TabType.QUIZ && <QuizTab />}
        {activeTab === TabType.DISCUSSION && <DiscussionTab />}
      </main>
    </div>
  );
};

export default App;
