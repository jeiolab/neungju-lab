import React, { useState } from 'react';
import { UserLevel } from './types';
import { INITIAL_GRAPH, QUIZZES } from './constants';
import NetworkGraph from './components/NetworkGraph';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ThinkTab from './components/ThinkTab';
import TheoryTab from './components/TheoryTab';
import { BrainCircuit, Users, BookOpen, Puzzle, HelpCircle, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('theory');
  const [userXP, setUserXP] = useState(0);

  const getLevel = (xp: number): UserLevel => {
    if (xp >= 200) return UserLevel.EXPERT;
    if (xp >= 100) return UserLevel.INTERMEDIATE;
    return UserLevel.BEGINNER;
  };

  const level = getLevel(userXP);

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TheoryTab />;
      case 'simulation':
        return <SimulationTab graphData={INITIAL_GRAPH} />;
      case 'quiz':
        return <QuizTab quizzes={QUIZZES} userXP={userXP} onXPChange={setUserXP} />;
      case 'think':
        return <ThinkTab />;
      default:
        return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">인맥의 중심: 관계망 만들기</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
                <span className="text-xs text-slate-500 font-medium">현재 등급</span>
                <span className={`text-sm font-bold ${level === UserLevel.EXPERT ? 'text-purple-600' : level === UserLevel.INTERMEDIATE ? 'text-blue-600' : 'text-slate-700'}`}>
                    {level} (XP: {userXP})
                </span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <GraduationCap className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-8">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'theory' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen className="w-4 h-4" />
            개념 학습
          </button>
          <button 
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'simulation' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            소문 시뮬레이션
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'quiz' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Puzzle className="w-4 h-4" />
            퀴즈 풀기
          </button>
          <button 
            onClick={() => setActiveTab('think')}
            className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'think' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <HelpCircle className="w-4 h-4" />
            생각해볼 문제
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 인맥의 중심: 관계망 만들기. All rights reserved.</p>
          <p className="mt-1 text-xs">AI 기능은 Google Gemini에 의해 제공됩니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
