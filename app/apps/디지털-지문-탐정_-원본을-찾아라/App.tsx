import React, { useState } from 'react';
import { Tab } from './types';
import TabConcept from './components/TabConcept';
import TabGenerator from './components/TabGenerator';
import TabBlockchain from './components/TabBlockchain';
import TabQuiz from './components/TabQuiz';
import TabDiscussion from './components/TabDiscussion';
import { ShieldCheck, Database, Link, BrainCircuit, MessageCircleQuestion } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);

  const renderTabContent = () => {
    switch (activeTab) {
      case Tab.CONCEPT:
        return <TabConcept />;
      case Tab.GENERATOR:
        return <TabGenerator />;
      case Tab.BLOCKCHAIN:
        return <TabBlockchain />;
      case Tab.QUIZ:
        return <TabQuiz />;
      case Tab.DISCUSSION:
        return <TabDiscussion />;
      default:
        return <TabConcept />;
    }
  };

  const navItems = [
    { id: Tab.CONCEPT, label: '해시란?', icon: <Database size={18} /> },
    { id: Tab.GENERATOR, label: '해시 생성기', icon: <BrainCircuit size={18} /> },
    { id: Tab.BLOCKCHAIN, label: '블록체인', icon: <Link size={18} /> },
    { id: Tab.QUIZ, label: '위조 판별 퀴즈', icon: <ShieldCheck size={18} /> },
    { id: Tab.DISCUSSION, label: '생각해보기', icon: <MessageCircleQuestion size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-blue-500 rounded-lg">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">디지털 지문 탐정</h1>
              <p className="text-xs text-slate-400 font-medium">Digital Forensic: Find the Original</p>
            </div>
          </div>
          
          <nav className="flex space-x-1 bg-slate-800 p-1 rounded-xl overflow-x-auto max-w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] p-6">
          {renderTabContent()}
        </div>
      </main>

    </div>
  );
};

export default App;