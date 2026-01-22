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
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
                <Shield className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  나는야 보안 컨설턴트
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">최적의 방패를 찾아라</p>
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
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setIsGuidebookOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white ml-2 shadow-sm"
              >
                <Award size={18} />
                <span>가이드북</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
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
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsGuidebookOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-sm"
            >
              <Award size={18} />
              나만의 가이드북
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          {activeTab === 'comparison' && (
            <h2 className="text-3xl font-bold text-slate-800">암호 기술 <span className="text-indigo-600">비교 도감</span></h2>
          )}
          {activeTab === 'game' && (
            <h2 className="text-3xl font-bold text-slate-800">보안 컨설턴트 <span className="text-indigo-600">시뮬레이션</span></h2>
          )}
          {activeTab === 'future' && (
            <h2 className="text-3xl font-bold text-slate-800">미래 보안 기술 <span className="text-indigo-600">탐구</span></h2>
          )}
          {activeTab === 'quiz' && (
            <h2 className="text-3xl font-bold text-slate-800">보안 상식 <span className="text-indigo-600">퀴즈 챌린지</span></h2>
          )}
          {activeTab === 'discussion' && (
            <h2 className="text-3xl font-bold text-slate-800">보안에 대한 <span className="text-indigo-600">깊이 있는 생각</span></h2>
          )}
        </div>

        {renderContent()}
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