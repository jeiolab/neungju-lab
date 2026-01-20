import React, { useState, useEffect } from 'react';
import { INITIAL_STATS } from './constants';
import { UserStats, GameMode } from './types';
import Simulation from './components/Simulation';
import Game from './components/Game';
import Dashboard from './components/Dashboard';
import QuizSection from './components/QuizSection';
import Reflection from './components/Reflection';
import { LayoutDashboard, BookOpen, Gamepad2, PenTool, BrainCircuit, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load stats from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('binarySearchGameStats');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load stats", e);
      }
    }
  }, []);

  // Save stats whenever they change
  const updateStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('binarySearchGameStats', JSON.stringify(newStats));
  };

  const NavItem = ({ targetMode, icon: Icon, label }: { targetMode: GameMode; icon: any; label: string }) => (
    <button
      onClick={() => {
        setMode(targetMode);
        setIsMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left ${
        mode === targetMode 
          ? 'bg-indigo-600 text-white shadow-md font-bold' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="font-bold text-indigo-700 text-lg">이진 탐색 판별 게임</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-40 transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-extrabold text-indigo-700 leading-tight">
            이진 탐색<br/>
            <span className="text-slate-900 text-lg font-normal">가능? 불가능?</span>
          </h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavItem targetMode={GameMode.DASHBOARD} icon={LayoutDashboard} label="내 대시보드" />
          <NavItem targetMode={GameMode.THEORY} icon={BookOpen} label="원리 시뮬레이션" />
          <NavItem targetMode={GameMode.GAME} icon={Gamepad2} label="판별 게임 시작" />
          <NavItem targetMode={GameMode.QUIZ} icon={PenTool} label="확인 퀴즈" />
          <NavItem targetMode={GameMode.REFLECTION} icon={BrainCircuit} label="심화 탐구" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <p className="text-xs text-indigo-600 font-bold mb-1">현재 점수</p>
            <p className="text-2xl font-extrabold text-indigo-800">{stats.score.toLocaleString()}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto pt-4 md:pt-0">
            {mode === GameMode.DASHBOARD && <Dashboard stats={stats} />}
            {mode === GameMode.THEORY && (
              <div className="space-y-8">
                 <div className="text-center mb-8">
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">왜 정렬이 필요할까?</h2>
                   <p className="text-slate-600">직접 데이터를 섞고 정렬하며 이진 탐색의 작동 원리를 눈으로 확인해보세요.</p>
                 </div>
                 <Simulation />
              </div>
            )}
            {mode === GameMode.GAME && <Game userStats={stats} updateStats={updateStats} />}
            {mode === GameMode.QUIZ && <QuizSection />}
            {mode === GameMode.REFLECTION && <Reflection />}
        </div>
      </main>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default App;