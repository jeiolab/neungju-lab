import React, { useState } from 'react';
import TechComparison from './components/TechComparison';
import ConsultationGame from './components/ConsultationGame';
import FutureSecurity from './components/FutureSecurity';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';
import GuidebookModal from './components/GuidebookModal';
import { Shield, Book, Gamepad2, Brain, Coffee, Award, Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [gameScore, setGameScore] = useState(0);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setIsGuidebookOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'comparison': return <TechComparison />;
      case 'game': return <ConsultationGame onGameComplete={handleGameComplete} />;
      case 'future': return <FutureSecurity />;
      case 'quiz': return <Quiz />;
      case 'discussion': return <Discussion />;
      default: return <ConsultationGame onGameComplete={handleGameComplete} />;
    }
  };

  const navItems = [
    { id: 'comparison', label: '기술도감', icon: <Book size={18} /> },
    { id: 'game', label: '의뢰(게임)', icon: <Gamepad2 size={18} /> },
    { id: 'future', label: '미래보안', icon: <Brain size={18} /> },
    { id: 'quiz', label: '시험', icon: <Award size={18} /> },
    { id: 'discussion', label: '토론', icon: <Coffee size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                  나는야 보안 컨설턴트
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">최적의 방패를 찾아라</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setIsGuidebookOpen(true)}
                className="ml-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
              >
                <Award size={16} />
                <span>가이드북</span>
              </button>
            </nav>

            {/* Mobile: 가이드북 + Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsGuidebookOpen(true)}
                className="p-2 rounded-lg bg-blue-50 text-blue-600"
                title="가이드북"
              >
                <Award size={20} />
              </button>
              <button
                className="p-2 text-slate-600"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700'
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Guidebook Modal */}
      <GuidebookModal
        isOpen={isGuidebookOpen}
        onClose={() => setIsGuidebookOpen(false)}
        score={gameScore}
      />
    </div>
  );
}

export default App;
