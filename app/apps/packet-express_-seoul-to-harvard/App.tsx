import React, { useState } from 'react';
import { Tab } from './types';
import { Layout, BookOpen, PlayCircle, Info, HelpCircle, MessageSquare } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.SIMULATION: return <SimulationTab />;
      case Tab.LEARN_MORE: return <LearnMoreTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.DISCUSSION: return <DiscussionTab />;
      default: return <SimulationTab />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 개념', icon: <BookOpen size={18} /> },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: <PlayCircle size={18} /> },
    { id: Tab.LEARN_MORE, label: '더 알아보기', icon: <Info size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: Tab.DISCUSSION, label: '생각해보기', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Packet Express</h1>
                <p className="text-xs text-slate-400 font-medium">데이터 물류 센터: 서울에서 하버드까지</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Mobile Navigation (Simple Overflow Scroll) */}
        <div className="md:hidden overflow-x-auto pb-2 px-4 scrollbar-hide">
            <div className="flex space-x-2 w-max">
                {navItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                        ${activeTab === item.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 text-slate-300'
                        }`}
                    >
                    {item.icon}
                    {item.label}
                    </button>
                ))}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-xl min-h-[600px] border border-slate-100 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; 2024 Packet Express Educational Tool. Built with React & Tailwind.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
