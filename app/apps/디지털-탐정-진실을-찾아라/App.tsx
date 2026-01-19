import React, { useState } from 'react';
import Header from './components/Header';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import MoreInfoTab from './components/MoreInfoTab';
import QuizTab from './components/QuizTab';
import DebateTab from './components/DebateTab';
import { TabId } from './types';
import { Book, Gamepad2, Info, CheckSquare, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: '개념 설명', icon: <Book className="w-4 h-4" /> },
    { id: 'simulation', label: '사건 해결', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'quiz', label: '팩트체크 퀴즈', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'debate', label: '토론장', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'more-info', label: '더 알아보기', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in pb-12">
          {activeTab === 'concept' && <ConceptTab />}
          {activeTab === 'simulation' && <SimulationTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'debate' && <DebateTab />}
          {activeTab === 'more-info' && <MoreInfoTab />}
        </div>
      </main>
    </div>
  );
};

export default App;