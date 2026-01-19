import React, { useState } from 'react';
import { AppView } from './types';
import { CONCEPTS } from './constants';
import ConceptCard from './components/ConceptCard';
import PuzzleGame from './components/PuzzleGame';
import Simulation from './components/Simulation';
import Quiz from './components/Quiz';
import { BookOpen, Puzzle, Activity, HelpCircle, GraduationCap, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mastery, setMastery] = useState(0);

  const handlePuzzleComplete = (score: number) => {
    setMastery(prev => Math.min(100, prev + 30));
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-3xl font-bold mb-2">개인정보 처리 흐름 마스터</h1>
              <p className="opacity-90 max-w-2xl">
                정보의 수집부터 파기까지, 데이터의 생명주기를 이해하고 안전한 정보 보호 습관을 길러봅시다.
              </p>
              <div className="mt-6 flex gap-4">
                 <button 
                  onClick={() => setCurrentView(AppView.LEARN)}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-2 rounded-lg font-bold hover:bg-white/30 transition"
                 >
                   학습 시작하기
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <DashboardCard 
                 title="흐름 퍼즐" 
                 desc="처리 단계를 순서대로 조립하세요" 
                 icon={<Puzzle className="w-8 h-8 text-indigo-500"/>}
                 onClick={() => setCurrentView(AppView.PUZZLE)}
               />
               <DashboardCard 
                 title="위험 시뮬레이션" 
                 desc="보유기간에 따른 위험도를 확인하세요" 
                 icon={<Activity className="w-8 h-8 text-rose-500"/>}
                 onClick={() => setCurrentView(AppView.SIMULATION)}
               />
               <DashboardCard 
                 title="AI 퀴즈" 
                 desc="서술형 문제로 개념을 다지세요" 
                 icon={<GraduationCap className="w-8 h-8 text-green-500"/>}
                 onClick={() => setCurrentView(AppView.QUIZ)}
               />
            </div>
          </div>
        );
      case AppView.LEARN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {CONCEPTS.map((concept, idx) => (
              <ConceptCard key={idx} data={concept} />
            ))}
          </div>
        );
      case AppView.PUZZLE:
        return <PuzzleGame onComplete={handlePuzzleComplete} />;
      case AppView.SIMULATION:
        return <Simulation />;
      case AppView.QUIZ:
        return <Quiz />;
      default:
        return <div>페이지를 찾을 수 없습니다.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="bg-white w-full md:w-64 flex-shrink-0 border-r border-slate-200 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8" onClick={() => setCurrentView(AppView.DASHBOARD)}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer">
            P
          </div>
          <span className="font-bold text-slate-800 text-lg cursor-pointer">Privacy Puzzle</span>
        </div>

        <div className="space-y-2 flex-grow">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="대시보드" 
            isActive={currentView === AppView.DASHBOARD} 
            onClick={() => setCurrentView(AppView.DASHBOARD)} 
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="개념 학습" 
            isActive={currentView === AppView.LEARN} 
            onClick={() => setCurrentView(AppView.LEARN)} 
          />
          <NavItem 
            icon={<Puzzle size={20} />} 
            label="흐름 퍼즐" 
            isActive={currentView === AppView.PUZZLE} 
            onClick={() => setCurrentView(AppView.PUZZLE)} 
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="시뮬레이션" 
            isActive={currentView === AppView.SIMULATION} 
            onClick={() => setCurrentView(AppView.SIMULATION)} 
          />
          <NavItem 
            icon={<HelpCircle size={20} />} 
            label="퀴즈 & 평가" 
            isActive={currentView === AppView.QUIZ} 
            onClick={() => setCurrentView(AppView.QUIZ)} 
          />
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 mb-2">나의 마스터리</div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${mastery}%` }} />
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-xs text-slate-500">Lv.1 초심자</span>
             <span className="text-xs font-bold text-indigo-600">{mastery} XP</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto h-screen">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === AppView.DASHBOARD && '안녕하세요! 👋'}
              {currentView === AppView.LEARN && '핵심 개념 익히기'}
              {currentView === AppView.PUZZLE && '개인정보 흐름 조립'}
              {currentView === AppView.SIMULATION && '보안 정책 시뮬레이터'}
              {currentView === AppView.QUIZ && '실력 확인하기'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {currentView === AppView.DASHBOARD && '오늘도 안전한 정보 보호 생활을 시작해봐요.'}
              {currentView === AppView.LEARN && '카드를 읽으며 용어와 원칙을 학습하세요.'}
              {currentView === AppView.PUZZLE && '블록을 맞춰 올바른 처리 순서를 완성하세요.'}
              {currentView === AppView.SIMULATION && '다양한 설정값에 따라 위험도가 어떻게 변하는지 관찰하세요.'}
              {currentView === AppView.QUIZ && '객관식 문제와 AI가 채점하는 서술형 문제에 도전하세요.'}
            </p>
          </div>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
      ${isActive 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
  >
    {icon}
    {label}
  </button>
);

const DashboardCard = ({ title, desc, icon, onClick }: { title: string, desc: string, icon: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 text-left flex flex-col h-full"
  >
    <div className="mb-4 p-3 bg-slate-50 rounded-lg w-fit">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </button>
);

export default App;