import React, { useState } from 'react';
import { BookOpen, Gamepad2, BrainCircuit, PenTool, HelpCircle } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import AdvancedTab from './components/AdvancedTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

function App() {
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'advanced' | 'quiz' | 'reflection'>('sim');

  const tabs = [
    { id: 'theory', label: '개념 배우기', icon: BookOpen },
    { id: 'sim', label: '실습 게임', icon: Gamepad2 },
    { id: 'advanced', label: '더 알아보기', icon: BrainCircuit },
    { id: 'quiz', label: '퀴즈', icon: HelpCircle },
    { id: 'reflection', label: '생각하기', icon: PenTool },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span className="text-2xl">🕵️‍♂️</span> 예/아니요 탐정
            <span className="hidden md:inline-block text-slate-400 font-light text-sm ml-2">| 의사결정트리 마스터</span>
          </h1>
          
          <nav className="flex gap-1 md:gap-2">
             {/* Mobile: Icons only, Desktop: Icon + Text */}
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`
                    p-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all
                    ${activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-600 font-bold' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}
                 `}
                 title={tab.label}
               >
                 <tab.icon size={20} />
                 <span className="hidden md:inline text-sm">{tab.label}</span>
               </button>
             ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'theory' && <TheoryTab />}
        {activeTab === 'sim' && <SimulationTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'reflection' && <ReflectionTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          © 2025 Yes/No Detective. Decision Tree Educational App.
        </div>
      </footer>
    </div>
  );
}

export default App;