import React, { useState } from 'react';
import { Header } from './components/Header';
import { TabSimulation } from './components/TabSimulation';
import { TabTheory } from './components/TabTheory';
import { TabQuiz } from './components/TabQuiz';
import { TabReflection } from './components/TabReflection';
import { UserState } from './types';
import { BookOpen, Puzzle, HelpCircle, PenTool, Layout } from 'lucide-react';

enum Tab {
  THEORY = 'theory',
  SIMULATION = 'simulation',
  QUIZ = 'quiz',
  REFLECTION = 'reflection',
  DEEPDIVE = 'deepdive'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);
  const [userState, setUserState] = useState<UserState>({
    level: 1,
    streak: 1,
    badges: [],
    completedScenarios: [],
    quizScore: 0
  });

  const handleScenarioComplete = (scenarioId: string, isPerfect: boolean) => {
    if (!userState.completedScenarios.includes(scenarioId)) {
      setUserState(prev => ({
        ...prev,
        level: prev.level + 1,
        completedScenarios: [...prev.completedScenarios, scenarioId],
        badges: isPerfect && !prev.badges.includes('perfect') 
          ? [...prev.badges, 'perfect'] 
          : prev.badges
      }));
    }
  };

  const handleQuizScore = (score: number) => {
    if (score >= 8 && !userState.badges.includes('quiz_master')) {
         setUserState(prev => ({
            ...prev,
            badges: [...prev.badges, 'quiz_master'],
            quizScore: score
         }));
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case Tab.THEORY: return <TabTheory />;
      case Tab.SIMULATION: return <TabSimulation onComplete={handleScenarioComplete} />;
      case Tab.QUIZ: return <TabQuiz onScoreUpdate={handleQuizScore} />;
      case Tab.REFLECTION: return <TabReflection />;
      case Tab.DEEPDIVE: 
        return (
             <div className="p-8 text-center max-w-2xl mx-auto">
                 <h2 className="text-2xl font-bold mb-4">더 알아보기: 초연결/초지능/초융합</h2>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-left space-y-4">
                     <div>
                         <span className="font-bold text-indigo-600 block">초연결 (Hyper-connectivity)</span>
                         <p className="text-sm text-slate-600">사람, 사물, 공간 등 모든 것이 인터넷으로 거미줄처럼 연결된 상태.</p>
                     </div>
                     <div>
                         <span className="font-bold text-purple-600 block">초지능 (Super-intelligence)</span>
                         <p className="text-sm text-slate-600">연결된 데이터를 AI가 학습하여 인간의 지적 능력을 뛰어넘는 서비스를 제공하는 것.</p>
                     </div>
                     <div>
                         <span className="font-bold text-green-600 block">초융합 (Hyper-convergence)</span>
                         <p className="text-sm text-slate-600">현실 세계와 디지털 세계가 섞여서 새로운 산업과 가치가 만들어지는 현상.</p>
                     </div>
                 </div>
                 <div className="mt-6 text-sm text-slate-500">
                     * OX 퀴즈는 퀴즈 탭에서 통합하여 제공됩니다.
                 </div>
             </div>
        );
      default: return <TabSimulation onComplete={handleScenarioComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header userState={userState} />
      
      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-8 min-w-max">
            <button 
                onClick={() => setActiveTab(Tab.THEORY)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === Tab.THEORY ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <BookOpen className="w-4 h-4" /> 개념 학습
            </button>
            <button 
                onClick={() => setActiveTab(Tab.SIMULATION)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === Tab.SIMULATION ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <Puzzle className="w-4 h-4" /> 파이프라인 퍼즐
            </button>
            <button 
                onClick={() => setActiveTab(Tab.DEEPDIVE)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === Tab.DEEPDIVE ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <Layout className="w-4 h-4" /> 더 알아보기
            </button>
            <button 
                onClick={() => setActiveTab(Tab.QUIZ)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === Tab.QUIZ ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <HelpCircle className="w-4 h-4" /> 퀴즈
            </button>
            <button 
                onClick={() => setActiveTab(Tab.REFLECTION)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === Tab.REFLECTION ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <PenTool className="w-4 h-4" /> 생각해볼 문제
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 py-6">
        {renderContent()}
      </main>

      <footer className="bg-slate-100 text-slate-400 py-6 text-center text-xs">
         <p>교육용 AI 서비스 파이프라인 시뮬레이터 | Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
