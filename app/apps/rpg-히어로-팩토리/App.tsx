import React, { useState } from 'react';
import { Tab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import InheritanceTab from './components/InheritanceTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { BookOpen, Gamepad2, GitBranch, HelpCircle, MessageCircle, Swords } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.SIMULATION: return <SimulationTab />;
      case Tab.INHERITANCE: return <InheritanceTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.DISCUSSION: return <DiscussionTab />;
      default: return <TheoryTab />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
        activeTab === tab 
          ? 'border-indigo-500 text-indigo-400 bg-slate-800/50' 
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
               <Swords size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                RPG 히어로 팩토리
              </h1>
              <p className="text-xs text-slate-500">OOP 개념 시각화 학습</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-slate-900 border-b border-slate-800">
           <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
              <NavButton tab={Tab.THEORY} icon={BookOpen} label="개념(이론)" />
              <NavButton tab={Tab.SIMULATION} icon={Gamepad2} label="공장 & 실습" />
              <NavButton tab={Tab.INHERITANCE} icon={GitBranch} label="상속" />
              <NavButton tab={Tab.QUIZ} icon={HelpCircle} label="퀴즈" />
              <NavButton tab={Tab.DISCUSSION} icon={MessageCircle} label="더 알아보기" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;