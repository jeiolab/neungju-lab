import React, { useState } from 'react';
import Simulation from './components/Simulation';
import TheoryCards from './components/TheoryCards';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import LearnMore from './components/LearnMore';
import { Layout, Book, Activity, Brain, CheckCircle, Award } from 'lucide-react';

// Tabs
enum Tab {
  THEORY = '이론 개념',
  SIMULATION = '시뮬레이션',
  QUIZ = '퀴즈',
  REFLECTION = '생각하기',
  LEARN_MORE = '더 알아보기'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [decisionsMade, setDecisionsMade] = useState(0);

  const handleDecisionMade = () => {
    setDecisionsMade(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryCards />;
      case Tab.SIMULATION: return <Simulation onDecisionMade={handleDecisionMade} />;
      case Tab.QUIZ: return <Quiz onComplete={setQuizScore} />;
      case Tab.REFLECTION: return <Reflection />;
      case Tab.LEARN_MORE: return <LearnMore />;
      default: return <Simulation onDecisionMade={handleDecisionMade} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <Activity size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-none">ML 트레이드오프 코치</h1>
                    <p className="text-xs text-gray-500 font-medium">정확도 vs 설명가능성 vs 시간</p>
                </div>
            </div>
            
            {/* Stats / Badges */}
            <div className="hidden md:flex items-center gap-4">
                {decisionsMade >= 3 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100 animate-bounce">
                        <Award size={14} /> 트레이드오프 마스터
                    </div>
                )}
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">오늘의 결정</p>
                    <p className="text-sm font-bold text-gray-800">{decisionsMade}회</p>
                </div>
                {quizScore !== null && (
                    <div className="text-right border-l pl-4">
                        <p className="text-xs text-gray-400 uppercase font-bold">퀴즈 점수</p>
                        <p className="text-sm font-bold text-emerald-600">{quizScore}/10</p>
                    </div>
                )}
            </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto no-scrollbar">
            {[
                { id: Tab.SIMULATION, icon: <Layout size={18} /> },
                { id: Tab.THEORY, icon: <Book size={18} /> },
                { id: Tab.REFLECTION, icon: <Brain size={18} /> },
                { id: Tab.QUIZ, icon: <CheckCircle size={18} /> },
                { id: Tab.LEARN_MORE, icon: <Activity size={18} /> },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab.icon}
                    {tab.id}
                </button>
            ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;