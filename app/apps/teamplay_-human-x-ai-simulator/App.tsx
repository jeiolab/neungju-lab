import React, { useState } from 'react';
import { TabId } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import RelationshipsTab from './components/RelationshipsTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';
import { LayoutDashboard, BookOpen, Network, HelpCircle, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('SIMULATION');

  const tabs = [
    { id: 'THEORY', label: '이론 개념', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { id: 'SIMULATION', label: '시뮬레이션', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { id: 'RELATIONSHIPS', label: '관계 유형', icon: <Network className="w-4 h-4 mr-2" /> },
    { id: 'QUIZ', label: '퀴즈', icon: <HelpCircle className="w-4 h-4 mr-2" /> },
    { id: 'DISCUSSION', label: '토론', icon: <MessageSquare className="w-4 h-4 mr-2" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'THEORY': return <TheoryTab />;
      case 'SIMULATION': return <SimulationTab />;
      case 'RELATIONSHIPS': return <RelationshipsTab />;
      case 'QUIZ': return <QuizTab />;
      case 'DISCUSSION': return <DiscussionTab />;
      default: return <SimulationTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">팀플레이: 인간 X AI</h1>
            </div>
            
            <div className="text-sm text-gray-500 hidden md:block">
              프로젝트 매니저(PM) 훈련 코스
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="min-h-[600px]">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 TeamPlay Simulator. Built for Gemini API Developer Competition.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;