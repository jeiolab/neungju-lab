import React, { useState } from 'react';
import { Tab } from './types';
import { XorLab } from './components/XorLab';
import { Quiz } from './components/Quiz';
import { DigitalLanguage, ModernCrypto } from './components/KnowledgeBase';
import { ThoughtLab } from './components/ThoughtLab';
import { Beaker, BookOpen, BrainCircuit, MessageCircleQuestion, Terminal, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.XOR_LAB);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Beaker className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  블록 암호 연구소
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">0과 1의 춤</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;