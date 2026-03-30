import React, { useState } from 'react';
import { Tab, EndingType } from './types';
import Game from './components/Game';
import { TheoryTab, CaseStudiesTab, QuizTab, DebateTab } from './components/Tabs';
import { BookOpen, Scale, ShieldCheck, MessageSquare, Award, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY); // Start with Theory
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Game End State
  const [gameResult, setGameResult] = useState<{ending: EndingType, score: {conv: number, priv: number}} | null>(null);
  const [badges, setBadges] = useState<string[]>([]);

  const handleGameEnd = (ending: EndingType, score: {conv: number, priv: number}) => {
    setGameResult({ ending, score });
    
    // Badge Logic
    const newBadges = [...badges];
    if (Math.abs(score.conv - score.priv) <= 10 && !newBadges.includes("솔로몬의 판결")) {
      newBadges.push("솔로몬의 판결");
    }
    setBadges(newBadges);
  };

  const resetGame = () => {
    setGameResult(null);
  };

  const navItems = [
    { id: Tab.THEORY, label: '디지털의 명과 암', icon: <BookOpen size={20} /> },
    { id: Tab.GAME, label: '밸런스 게임', icon: <Scale size={20} /> },
    { id: Tab.CASES, label: '사례 연구', icon: <ShieldCheck size={20} /> },
    { id: Tab.QUIZ, label: '윤리 퀴즈', icon: <Award size={20} /> },
    { id: Tab.DEBATE, label: '토론장', icon: <MessageSquare size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TheoryTab />;
      case Tab.CASES: return <CaseStudiesTab />;
      case Tab.QUIZ: return <QuizTab />;
      case Tab.DEBATE: return <DebateTab />;
      case Tab.GAME:
        if (gameResult) {
          return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
               <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-slate-100">
                  <div className="text-6xl mb-6">
                    {gameResult.ending === 'INVISIBLE' ? '👻' : gameResult.ending === 'OPEN_DOOR' ? '🚪' : '⚖️'}
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-slate-900">
                    {gameResult.ending === 'INVISIBLE' ? '투명인간형' : gameResult.ending === 'OPEN_DOOR' ? '열린 문형' : '스마트 시민형'}
                  </h2>
                  <p className="text-slate-500 mb-8 text-lg">
                    {gameResult.ending === 'INVISIBLE' && "보안을 너무 중시하여 디지털 세상에서 존재감이 사라졌습니다. 조금은 불편할 수도 있겠네요."}
                    {gameResult.ending === 'OPEN_DOOR' && "편리함을 위해 모든 것을 열어두었군요! 하지만 당신의 정보는 이미 공공재일지도 모릅니다."}
                    {gameResult.ending === 'SMART_CITIZEN' && "편리함과 프라이버시 사이에서 훌륭한 균형을 잡았습니다. 진정한 디지털 시민이시군요!"}
                  </p>
                  
                  <div className="flex justify-center gap-8 mb-8">
                     <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">편리함</div>
                        <div className="text-2xl font-bold text-blue-600">{gameResult.score.conv}</div>
                     </div>
                     <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">보안</div>
                        <div className="text-2xl font-bold text-green-600">{gameResult.score.priv}</div>
                     </div>
                  </div>

                  {badges.includes("솔로몬의 판결") && (
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full inline-flex items-center gap-2 mb-8 font-bold text-sm">
                      <Award size={16}/> 획득 배지: 솔로몬의 판결
                    </div>
                  )}

                  <button 
                    onClick={resetGame}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    다시 도전하기
                  </button>
               </div>
            </div>
          );
        }
        return <Game onGameEnd={handleGameEnd} />;
      default: return <TheoryTab />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-indigo-600 leading-tight">
            스마트<br/><span className="text-slate-900">라이프 밸런스</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2">Digital Ethics Arbiter</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">👤</div>
             <div>
               <p className="text-xs font-bold">게스트 사용자</p>
               <p className="text-[10px] text-slate-400">배지: {badges.length}개</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
          <h1 className="font-bold text-lg">스마트 라이프 밸런스</h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-white z-10 pt-16 md:hidden animate-fade-in flex flex-col">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium border ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                      : 'border-transparent text-slate-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;