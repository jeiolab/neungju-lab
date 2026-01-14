import React, { useState } from 'react';
import { AppView } from './types';
import { Wizard } from './components/Wizard';
import { Theory } from './components/Theory';
import { Simulation } from './components/Simulation';
import { Quiz } from './components/Quiz';
import { Thinking } from './components/Thinking';
import { Shield, BookOpen, Activity, CheckSquare, Brain, Home } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');

  const NavButton = ({ target, icon: Icon, label }: { target: AppView, icon: any, label: string }) => (
    <button 
      onClick={() => setView(target)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-20 md:w-24
        ${view === target ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-500 hover:bg-gray-100'}
      `}
    >
      <Icon size={24} className="mb-1" />
      <span className="text-xs md:text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Shield size={20} />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 hidden md:block">수행평가 메이커: 안전한 공유</h1>
            <h1 className="text-lg font-bold text-gray-800 md:hidden">안전한 공유</h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
             <button onClick={() => setView('home')} className={`px-4 py-2 rounded-lg font-medium ${view === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>홈</button>
             <button onClick={() => setView('theory')} className={`px-4 py-2 rounded-lg font-medium ${view === 'theory' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>이론</button>
             <button onClick={() => setView('simulation')} className={`px-4 py-2 rounded-lg font-medium ${view === 'simulation' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>시뮬레이션</button>
             <button onClick={() => setView('wizard')} className={`px-4 py-2 rounded-lg font-medium ${view === 'wizard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>프로젝트 설계</button>
             <button onClick={() => setView('quiz')} className={`px-4 py-2 rounded-lg font-medium ${view === 'quiz' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>퀴즈</button>
             <button onClick={() => setView('thinking')} className={`px-4 py-2 rounded-lg font-medium ${view === 'thinking' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}>생각하기</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 md:py-10">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold mb-6">고1 정보 - 정보 윤리</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              공유는 <span className="text-indigo-600">가치있게</span>,<br/>
              정보는 <span className="text-green-600">안전하게</span>!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mb-12">
              수행평가 프로젝트를 계획하고 계신가요?<br/>
              개인정보 보호와 저작권을 지키면서, 협업의 효과를 극대화하는 멋진 프로젝트 계획서를 만들어보세요.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
              <button onClick={() => setView('wizard')} className="bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center text-lg font-bold">
                🚀 프로젝트 만들기 시작
              </button>
              <button onClick={() => setView('simulation')} className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 p-5 rounded-2xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center text-lg font-bold">
                ⚖️ 공유 범위 시뮬레이션
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-3 gap-8 text-gray-500">
               <div className="flex flex-col items-center">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-2"><BookOpen size={24}/></div>
                 <span className="text-sm">기본 개념 학습</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-2"><CheckSquare size={24}/></div>
                 <span className="text-sm">퀴즈로 확인</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-2"><Brain size={24}/></div>
                 <span className="text-sm">심화 사고</span>
               </div>
            </div>
          </div>
        )}

        {view === 'theory' && <Theory />}
        {view === 'simulation' && <Simulation />}
        {view === 'wizard' && <Wizard />}
        {view === 'quiz' && <Quiz />}
        {view === 'thinking' && <Thinking />}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        <NavButton target="home" icon={Home} label="홈" />
        <NavButton target="theory" icon={BookOpen} label="이론" />
        <NavButton target="wizard" icon={Activity} label="설계" />
        <NavButton target="quiz" icon={CheckSquare} label="퀴즈" />
      </div>
    </div>
  );
};

export default App;