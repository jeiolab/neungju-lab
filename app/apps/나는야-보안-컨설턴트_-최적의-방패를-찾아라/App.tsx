import React, { useState } from 'react';
import TechComparison from './components/TechComparison';
import ConsultationGame from './components/ConsultationGame';
import FutureSecurity from './components/FutureSecurity';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';
import GuidebookModal from './components/GuidebookModal';
import { Shield, Book, Gamepad2, Brain, Coffee, Award } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [gameScore, setGameScore] = useState(0);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                나는야 보안 컨설턴트
              </h1>
            </div>
            
            <button
                onClick={() => setIsGuidebookOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg"
            >
                <Award className="w-4 h-4" /> 
                <span className="hidden sm:inline">나만의 가이드북</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <nav className="fixed bottom-0 left-0 w-full bg-slate-800 border-t border-slate-700 pb-safe z-50">
        <div className="flex justify-around items-center max-w-7xl mx-auto">
            <button 
                onClick={() => setActiveTab('comparison')} 
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${activeTab === 'comparison' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Book className="w-5 h-5 mb-1" />
                <span className="text-[10px] sm:text-xs">기술도감</span>
            </button>
            <button 
                onClick={() => setActiveTab('game')} 
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${activeTab === 'game' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Gamepad2 className="w-5 h-5 mb-1" />
                <span className="text-[10px] sm:text-xs">의뢰(게임)</span>
            </button>
            <button 
                onClick={() => setActiveTab('future')} 
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${activeTab === 'future' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Brain className="w-5 h-5 mb-1" />
                <span className="text-[10px] sm:text-xs">미래보안</span>
            </button>
            <button 
                onClick={() => setActiveTab('quiz')} 
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${activeTab === 'quiz' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Award className="w-5 h-5 mb-1" />
                <span className="text-[10px] sm:text-xs">시험</span>
            </button>
             <button 
                onClick={() => setActiveTab('discussion')} 
                className={`flex flex-col items-center py-3 px-2 flex-1 transition-colors ${activeTab === 'discussion' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <Coffee className="w-5 h-5 mb-1" />
                <span className="text-[10px] sm:text-xs">토론</span>
            </button>
        </div>
      </nav>

      {/* Guidebook Modal */}
      <GuidebookModal 
        isOpen={isGuidebookOpen} 
        onClose={() => setIsGuidebookOpen(false)} 
        score={gameScore} 
      />
      
      {/* Spacer for Bottom Nav */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
}

export default App;