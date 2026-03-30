import React, { useState } from 'react';
import { BookOpen, PlayCircle, Info, HelpCircle, MessageCircle } from 'lucide-react';
import TheoryTab from './components/Tabs/TheoryTab';
import SimulationTab from './components/Tabs/SimulationTab';
import MoreInfoTab from './components/Tabs/MoreInfoTab';
import QuizTab from './components/Tabs/QuizTab';
import DiscussionTab from './components/Tabs/DiscussionTab';

enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  MORE_INFO = 'more_info',
  QUIZ = 'quiz',
  DISCUSSION = 'discussion'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.SIMULATION: return <SimulationTab />;
      case Tab.MORE_INFO: return <MoreInfoTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.DISCUSSION: return <DiscussionTab />;
      default: return <SimulationTab />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '개념 배우기', icon: <BookOpen size={18} /> },
    { id: Tab.SIMULATION, label: '실습하기', icon: <PlayCircle size={18} /> },
    { id: Tab.MORE_INFO, label: '더 알아보기', icon: <Info size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: Tab.DISCUSSION, label: '토론하기', icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <span className="text-xl font-bold">🤖</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">로봇 키우기: 당근과 채찍</h1>
          </div>
          
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === item.id 
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] h-full overflow-hidden">
             {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default App;
