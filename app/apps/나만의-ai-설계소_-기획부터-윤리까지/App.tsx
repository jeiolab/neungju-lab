import React, { useState } from 'react';
import { Layout, BrainCircuit, BookOpen, MessageCircleQuestion, Scale, ClipboardList } from 'lucide-react';
import TabTheory from './components/TabTheory';
import TabSimulation from './components/TabSimulation';
import TabCases from './components/TabCases';
import TabQuiz from './components/TabQuiz';
import TabDilemma from './components/TabDilemma';
import SummaryModal from './components/SummaryModal';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('simulation');
  const [showSummary, setShowSummary] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TabTheory />;
      case 'simulation': return <TabSimulation />;
      case 'cases': return <TabCases />;
      case 'quiz': return <TabQuiz />;
      case 'dilemma': return <TabDilemma />;
      default: return <TabSimulation />;
    }
  };

  const navItems: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'theory', label: '이론 개념', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: 'AI 설계 위저드', icon: <BrainCircuit size={18} /> },
    { id: 'cases', label: '실패 사례', icon: <Layout size={18} /> },
    { id: 'quiz', label: '자격 시험', icon: <ClipboardList size={18} /> },
    { id: 'dilemma', label: '윤리 실험실', icon: <Scale size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BrainCircuit size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 hidden sm:block">
              나만의 AI 설계소
            </h1>
          </div>
          
          <button 
            onClick={() => setShowSummary(true)}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            <MessageCircleQuestion size={18} />
            <span className="hidden sm:inline">총정리 요약</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-4 h-12 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-fade-in-up">
            {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2024 My AI Design Lab. Powered by Google Gemini.</p>
          <p className="mt-2">올바른 AI 윤리가 더 나은 미래를 만듭니다.</p>
        </div>
      </footer>

      {/* Modals */}
      {showSummary && <SummaryModal onClose={() => setShowSummary(false)} />}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;