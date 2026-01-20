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
          ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={18} />
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
               <Swords size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                RPG 히어로 팩토리
              </h1>
              <p className="text-xs text-gray-500">OOP 개념 시각화 학습</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b border-gray-200">
           <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
              <NavButton tab={Tab.THEORY} icon={BookOpen} label="개념(이론)" />
              <NavButton tab={Tab.SIMULATION} icon={Gamepad2} label="공장 & 실습" />
              <NavButton tab={Tab.INHERITANCE} icon={GitBranch} label="상속" />
              <NavButton tab={Tab.QUIZ} icon={HelpCircle} label="퀴즈" />
              <NavButton tab={Tab.DISCUSSION} icon={MessageCircle} label="더 알아보기" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-gray-50">
        <div className="h-full overflow-y-auto">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;