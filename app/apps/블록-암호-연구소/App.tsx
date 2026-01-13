import React, { useState } from 'react';
import { Tab } from './types';
import { XorLab } from './components/XorLab';
import { Quiz } from './components/Quiz';
import { DigitalLanguage, ModernCrypto } from './components/KnowledgeBase';
import { ThoughtLab } from './components/ThoughtLab';
import { Beaker, BookOpen, BrainCircuit, MessageCircleQuestion, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.XOR_LAB);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DIGITAL_LANGUAGE: return <DigitalLanguage />;
      case Tab.XOR_LAB: return <XorLab />;
      case Tab.MODERN_CRYPTO: return <ModernCrypto />;
      case Tab.QUIZ: return <Quiz />;
      case Tab.THOUGHTS: return <ThoughtLab />;
      default: return <XorLab />;
    }
  };

  const navItems = [
    { id: Tab.DIGITAL_LANGUAGE, label: '디지털 언어', icon: <Terminal size={18} /> },
    { id: Tab.XOR_LAB, label: 'XOR 실험실', icon: <Beaker size={18} /> },
    { id: Tab.QUIZ, label: '비트 퀴즈', icon: <BrainCircuit size={18} /> },
    { id: Tab.MODERN_CRYPTO, label: '현대 암호', icon: <BookOpen size={18} /> },
    { id: Tab.THOUGHTS, label: '선배에게 질문', icon: <MessageCircleQuestion size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-200 font-sans selection:bg-cyber-accent selection:text-cyber-900">
      
      {/* Header */}
      <header className="bg-cyber-900/90 backdrop-blur-md border-b border-cyber-700 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyber-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_#06b6d4]">
              <span className="text-2xl">💾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">블록 암호 연구소</h1>
              <p className="text-xs text-cyber-400 font-mono">0과 1의 춤</p>
            </div>
          </div>

          <nav className="flex gap-1 bg-cyber-800/50 p-1 rounded-xl overflow-x-auto max-w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === item.id 
                    ? 'bg-cyber-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-800'}
                `}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-600 text-sm">
        <p>호기심 많은 후배들을 위해 만듦. 01010111 01101111 01110111!</p>
      </footer>

    </div>
  );
};

export default App;