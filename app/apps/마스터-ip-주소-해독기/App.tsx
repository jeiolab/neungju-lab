import React, { useState } from 'react';
import { ViewState } from './types';
import { Theory } from './views/Theory';
import { Simulation } from './views/Simulation';
import { Challenge } from './views/Challenge';
import { Quiz } from './views/Quiz';
import { Terminal, Book, Cpu, Crosshair, Zap, Github } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.THEORY:
        return <Theory />;
      case ViewState.SIMULATION:
        return <Simulation />;
      case ViewState.CHALLENGE:
        return <Challenge />;
      case ViewState.QUIZ:
        return <Quiz />;
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => setCurrentView(ViewState.HOME)}
            className="flex items-center gap-2 font-mono font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
              <Terminal className="text-green-500 w-5 h-5" />
            </div>
            <span>IP_HACKER</span>
          </button>

          <div className="hidden md:flex gap-1">
            <NavButton 
              active={currentView === ViewState.THEORY} 
              onClick={() => setCurrentView(ViewState.THEORY)} 
              icon={<Book className="w-4 h-4" />}
              label="개념 설명"
            />
            <NavButton 
              active={currentView === ViewState.SIMULATION} 
              onClick={() => setCurrentView(ViewState.SIMULATION)} 
              icon={<Cpu className="w-4 h-4" />}
              label="시뮬레이션"
            />
            <NavButton 
              active={currentView === ViewState.QUIZ} 
              onClick={() => setCurrentView(ViewState.QUIZ)} 
              icon={<Crosshair className="w-4 h-4" />}
              label="퀴즈"
            />
            <NavButton 
              active={currentView === ViewState.CHALLENGE} 
              onClick={() => setCurrentView(ViewState.CHALLENGE)} 
              icon={<Zap className="w-4 h-4" />}
              label="챌린지"
            />
          </div>
        </div>
        
        {/* Mobile Nav Scroller */}
        <div className="md:hidden overflow-x-auto flex gap-2 p-2 px-4 border-t border-slate-100 hide-scrollbar">
           <NavButtonMobile active={currentView === ViewState.THEORY} onClick={() => setCurrentView(ViewState.THEORY)} label="개념" />
           <NavButtonMobile active={currentView === ViewState.SIMULATION} onClick={() => setCurrentView(ViewState.SIMULATION)} label="시뮬레이션" />
           <NavButtonMobile active={currentView === ViewState.QUIZ} onClick={() => setCurrentView(ViewState.QUIZ)} label="퀴즈" />
           <NavButtonMobile active={currentView === ViewState.CHALLENGE} onClick={() => setCurrentView(ViewState.CHALLENGE)} label="챌린지" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
        {renderView()}
      </main>
    </div>
  );
};

// Home View Component (Internal)
const Home: React.FC<{ onViewChange: (v: ViewState) => void }> = ({ onViewChange }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center animate-in zoom-in-95 duration-500">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold mb-6 border border-green-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
        </span>
        SYSTEM ONLINE
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
        마스터 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">IP 주소</span><br />
        2진수 해독기
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        네트워크 엔지니어의 필수 기술, 서브넷 마스크와 2진수 변환.<br/>
        게임을 통해 쉽고 재미있게 배워보세요.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <button 
          onClick={() => onViewChange(ViewState.THEORY)}
          className="group relative p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all text-left"
        >
          <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Book className="text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">기초 이론</h3>
          <p className="text-sm text-slate-500 mt-1">2진수와 가중치 이해하기</p>
        </button>

        <button 
          onClick={() => onViewChange(ViewState.SIMULATION)}
          className="group relative p-6 bg-slate-900 border-2 border-slate-900 rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all text-left"
        >
          <div className="bg-slate-700 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Cpu className="text-green-400" />
          </div>
          <h3 className="font-bold text-lg text-white">시뮬레이션 시작</h3>
          <p className="text-sm text-slate-400 mt-1">직접 스위치를 켜보세요</p>
        </button>
      </div>
    </div>
  );
};

// UI Helpers
const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-slate-100 text-slate-900 shadow-sm' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }
    `}
  >
    {icon}
    {label}
  </button>
);

const NavButtonMobile: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`
      whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium border transition-all
      ${active 
        ? 'bg-slate-900 text-white border-slate-900' 
        : 'bg-white text-slate-600 border-slate-200'
      }
    `}
  >
    {label}
  </button>
);

export default App;