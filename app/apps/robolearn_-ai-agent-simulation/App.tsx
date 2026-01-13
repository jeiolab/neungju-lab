import React, { useState } from 'react';
import { TabId } from './types';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabMoreInfo from './components/TabMoreInfo';
import TabQuiz from './components/TabQuiz';
import TabEngineerNote from './components/TabEngineerNote';
import { BookOpen, Gamepad2, Cpu, CheckSquare, PenTool, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('theory');

  const tabs = [
    { id: 'theory', label: '1. 구조 학습', icon: BookOpen },
    { id: 'simulation', label: '2. 시뮬레이션', icon: Gamepad2 },
    { id: 'info', label: '3. 센서와 구동기', icon: Cpu },
    { id: 'quiz', label: '4. 퀴즈', icon: CheckSquare },
    { id: 'note', label: '5. 엔지니어 노트', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Bot className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              RoboLearn <span className="font-normal text-slate-400 text-sm hidden sm:inline">| 지능 에이전트의 이해</span>
            </h1>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden md:block">
            High School AI Education Series
          </div>
        </div>
      </header>

      {/* Navigation Tabs (Mobile optimized scroll) */}
      <nav className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`
                  flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap
                  ${isActive 
                    ? 'border-blue-600 text-blue-700 font-bold bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 overflow-hidden">
        <div className="h-full animate-fade-in-up">
          {activeTab === 'theory' && <TabTheory />}
          {activeTab === 'simulation' && <TabSimulation />}
          {activeTab === 'info' && <TabMoreInfo />}
          {activeTab === 'quiz' && <TabQuiz />}
          {activeTab === 'note' && <TabEngineerNote />}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; 2024 RoboLearn Educational Simulator. Built for AI learning.
        </div>
      </footer>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
