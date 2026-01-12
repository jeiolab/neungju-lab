'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  Terminal, 
  Lock, 
  Unlock, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';
import { LEVELS, TOTAL_TIME, SCORE_PER_LEVEL, PENALTY_PER_HINT } from './constants';
import { GameState, ToolType } from './types';
import { CaesarWheel } from './components/tools/CaesarWheel';
import { ScytaleGrid } from './components/tools/ScytaleGrid';
import { HashAnalyzer } from './components/tools/HashAnalyzer';
import { Certificate } from './components/Certificate';
import { generateHint } from './services/geminiService';

const CryptoHackerApp: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevelIndex: 0,
    score: 0,
    timeRemaining: TOTAL_TIME,
    isGameOver: false,
    gameWon: false,
    history: ["시스템 초기화 중...", "연결 수립됨.", "입력 대기 중..."]
  });
  
  const [userInput, setUserInput] = useState("");
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  const handleReset = () => {
    setGameState({
      currentLevelIndex: 0,
      score: 0,
      timeRemaining: TOTAL_TIME,
      isGameOver: false,
      gameWon: false,
      history: ["시스템 초기화 중...", "연결 수립됨.", "입력 대기 중..."]
    });
    setUserInput("");
    setAiFeedback(null);
    setIsToolOpen(false);
  };

  // Timer logic
  useEffect(() => {
    if (gameState.isGameOver) return;
    
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          return { ...prev, isGameOver: true };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver]);

  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const normalizedInput = userInput.trim().toUpperCase().replace(/\s/g, '');
    const normalizedSolution = currentLevel.solution.toUpperCase().replace(/\s/g, '');

    if (normalizedInput === normalizedSolution) {
      // Correct Answer - 계속 새로운 문제 생성
      setGameState(prev => {
        // 랜덤하게 다음 레벨 선택 (현재 레벨 제외)
        const availableIndices = LEVELS.map((_, idx) => idx).filter(idx => idx !== prev.currentLevelIndex);
        const nextLevelIndex = availableIndices.length > 0
          ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
          : Math.floor(Math.random() * LEVELS.length);
        
        return {
          ...prev,
          score: prev.score + SCORE_PER_LEVEL,
          currentLevelIndex: nextLevelIndex,
          gameWon: false, // 계속 게임 진행
          history: [...prev.history, `[접근 허가] 레벨 ${currentLevel.id} 통과. 다음 임무로 이동...`]
        };
      });
      setUserInput("");
      setAiFeedback(null);
    } else {
      // Wrong Answer - Trigger AI Hint
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 5), // Small penalty for wrong guess
        history: [...prev.history, `[접근 거부] '${userInput}' 오답.`]
      }));
      
      setIsLoadingHint(true);
      const hint = await generateHint(
        `Cipher: ${currentLevel.cipherText}. Type: ${currentLevel.toolAllowed}`,
        userInput
      );
      setAiFeedback(hint);
      setIsLoadingHint(false);
    }
  };

  const useHint = () => {
    setGameState(prev => ({
      ...prev,
      score: Math.max(0, prev.score - PENALTY_PER_HINT),
      history: [...prev.history, `[힌트 요청] -${PENALTY_PER_HINT}점`]
    }));
    setAiFeedback(currentLevel.hint);
  };

  const renderTool = () => {
    switch (currentLevel.toolAllowed) {
      case ToolType.CAESAR_WHEEL: return <CaesarWheel />;
      case ToolType.SCYTALE_GRID: return <ScytaleGrid />;
      case ToolType.HASH_ANALYZER: return <HashAnalyzer />;
      default: return <div>사용 가능한 도구 없음</div>;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (gameState.gameWon) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
          <Certificate 
            score={gameState.score} 
            timeRemaining={gameState.timeRemaining} 
            totalTime={TOTAL_TIME}
            onRestart={handleReset} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
        <Header />
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
          <div className="min-h-[60vh] bg-white text-red-600 flex flex-col items-center justify-center border border-slate-200 rounded-xl p-6 md:p-8">
            <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 animate-pulse" />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-center">시스템 침해 감지됨</h1>
            <p className="mb-6 md:mb-8 text-slate-600 text-sm md:text-base text-center">작전 실패. 시간이 만료되었습니다.</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2.5 md:py-3 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-colors text-sm md:text-base"
            >
              시스템 재부팅
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <button 
              onClick={handleReset} 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left w-full"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">암호 방어 작전</h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">화이트 해커 아카데미</p>
              </div>
            </button>
          </header>
        <div className="bg-white text-slate-900 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar / Dashboard */}
          <aside className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 md:p-6 flex flex-col gap-4 md:gap-6 z-10">

            <div className="space-y-4">
              <div className="bg-white p-3 md:p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 uppercase mb-1.5 tracking-wider">보안 레벨</div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 leading-tight">
                  레벨 {currentLevel.id}
                </div>
                <div className="text-xs md:text-sm text-slate-600 mt-1 line-clamp-2">{currentLevel.title}</div>
                <div className="w-full bg-slate-200 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${Math.min((gameState.score / (SCORE_PER_LEVEL * 10)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 uppercase mb-1.5 tracking-wider">남은 시간</div>
                <div className={`text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-2 ${gameState.timeRemaining < 60 ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
                  <Clock className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <span className="font-mono">{formatTime(gameState.timeRemaining)}</span>
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded border border-slate-200">
                <div className="text-xs text-slate-500 uppercase mb-1.5 tracking-wider">평판 점수</div>
                <div className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600">
                  {gameState.score.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-auto flex-1 overflow-y-auto min-h-[100px] text-xs space-y-2 text-slate-600 p-3 bg-white rounded border border-slate-200 shadow-sm">
              {gameState.history.slice().reverse().map((log, i) => (
                <div key={i}>&gt; {log}</div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 relative flex flex-col max-w-5xl mx-auto w-full">
            
            {/* Header */}
            <header className="mb-6 md:mb-8 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 md:w-6 md:h-6 text-red-600 shrink-0" />
                  <span>임무: {currentLevel.title}</span>
                </h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{currentLevel.storyContext}</p>
              </div>
              <button 
                onClick={() => setIsToolOpen(!isToolOpen)}
                className="md:hidden p-2 bg-blue-600 rounded text-white text-sm shrink-0 ml-2"
              >
                {isToolOpen ? '닫기' : '도구'}
              </button>
            </header>

            {/* Game Area */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
              
              {/* Puzzle Section */}
              <section className="flex-1 bg-white border border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
                 <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <ShieldAlert className="w-32 h-32 text-slate-400" />
                 </div>

                 <div className="mb-6 md:mb-8">
                   <label className="text-blue-600 text-xs md:text-sm font-bold uppercase tracking-widest block mb-2">감청된 데이터</label>
                   <div className="bg-slate-50 border-l-4 border-red-500 p-4 md:p-6 rounded font-mono text-xl md:text-2xl lg:text-3xl text-slate-900 shadow-sm tracking-wider break-all">
                     {currentLevel.cipherText}
                   </div>
                   <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
                     <span className="text-blue-600 font-semibold">목표: </span> 
                     {currentLevel.description}
                   </p>
                 </div>

                 {/* Input Area */}
                 <form onSubmit={handleSubmit} className="max-w-md">
                    <label className="text-slate-600 text-xs uppercase block mb-2">해독된 비밀번호</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="비밀번호 입력"
                        className="flex-1 bg-white border border-slate-300 text-slate-900 p-2.5 md:p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 font-mono text-base md:text-lg uppercase placeholder:text-slate-400"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded font-semibold transition-colors flex items-center gap-2 text-sm md:text-base"
                      >
                        <Unlock className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">제출</span>
                      </button>
                    </div>
                 </form>

                 {/* Feedback Area */}
                 <div className="mt-4 md:mt-6 min-h-[60px] md:min-h-[80px]">
                   {isLoadingHint && (
                     <div className="flex items-center gap-2 text-blue-600 animate-pulse text-sm md:text-base">
                       <Cpu className="w-4 h-4 shrink-0" /> 
                       <span>암호화 패턴 분석 중...</span>
                     </div>
                   )}
                   {aiFeedback && !isLoadingHint && (
                     <div className="bg-blue-50 border border-blue-200 p-3 md:p-4 rounded text-slate-700 text-sm md:text-base flex items-start gap-3 leading-relaxed">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 shrink-0 mt-0.5 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-semibold block text-blue-600 mb-1">멘토 피드백</span>
                          <span>{aiFeedback}</span>
                        </div>
                     </div>
                   )}
                   {!aiFeedback && !isLoadingHint && (
                      <button 
                        onClick={useHint}
                        className="text-xs md:text-sm text-slate-500 hover:text-blue-600 underline transition-colors"
                      >
                        힌트 요청 (-{PENALTY_PER_HINT}점)
                      </button>
                   )}
                 </div>
              </section>

              {/* Tools Panel (Desktop: Always visible col, Mobile: Toggle) */}
              <section className={`
                ${isToolOpen ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-4 flex items-center justify-center' : 'hidden'}
                lg:block lg:static lg:w-96 lg:bg-transparent lg:p-0
              `}>
                 <div className="w-full max-w-md lg:max-w-none relative">
                   {isToolOpen && (
                     <button 
                       onClick={() => setIsToolOpen(false)}
                       className="lg:hidden absolute -top-10 right-0 text-slate-900 font-semibold text-sm px-3 py-1 bg-white rounded border border-slate-200 hover:bg-slate-50"
                     >
                       닫기 ✕
                     </button>
                   )}
                   
                   <div className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 shadow-sm">
                     <div className="bg-blue-50 p-2 rounded-t-lg mb-2 text-center text-blue-600 font-semibold text-xs uppercase tracking-wider">
                       사용 가능한 도구
                     </div>
                     {renderTool()}
                   </div>

                   <div className="mt-3 md:mt-4 text-center">
                     <p className="text-xs text-slate-500 leading-relaxed">
                       임무 요건에 따라 도구가 자동 선택되었습니다.
                     </p>
                   </div>
                 </div>
              </section>

            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CryptoHackerApp;

