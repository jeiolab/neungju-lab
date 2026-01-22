import React, { useState, useEffect, useCallback } from 'react';
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
import { GameState, ToolType, LevelStatus } from './types';
import { CaesarWheel } from './components/tools/CaesarWheel';
import { ScytaleGrid } from './components/tools/ScytaleGrid';
import { HashAnalyzer } from './components/tools/HashAnalyzer';
import { Certificate } from './components/Certificate';
import { generateHint } from './services/geminiService';

const App: React.FC = () => {
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

  // Timer logic
  useEffect(() => {
    if (gameState.isGameOver || gameState.gameWon) return;
    
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
  }, [gameState.isGameOver, gameState.gameWon]);

  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const normalizedInput = userInput.trim().toUpperCase().replace(/\s/g, '');
    const normalizedSolution = currentLevel.solution.toUpperCase().replace(/\s/g, '');

    if (normalizedInput === normalizedSolution) {
      // Correct Answer
      const isLastLevel = gameState.currentLevelIndex === LEVELS.length - 1;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + SCORE_PER_LEVEL,
        currentLevelIndex: isLastLevel ? prev.currentLevelIndex : prev.currentLevelIndex + 1,
        gameWon: isLastLevel,
        history: [...prev.history, `[접근 허가] 레벨 ${currentLevel.id} 통과.`]
      }));
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
      <Certificate 
        score={gameState.score} 
        timeRemaining={gameState.timeRemaining} 
        totalTime={TOTAL_TIME}
        onRestart={() => window.location.reload()} 
      />
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen bg-slate-50 text-red-600 flex flex-col items-center justify-center">
        <AlertTriangle className="w-24 h-24 mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">시스템 침해 감지됨</h1>
        <p className="mb-8 text-slate-600">작전 실패. 시간이 만료되었습니다.</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
        >
          시스템 재부팅
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar / Dashboard */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 z-10 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600">
          <Terminal className="w-6 h-6" />
          <h1 className="font-bold">크립토 해커</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 uppercase mb-1">보안 레벨</div>
            <div className="text-2xl font-bold text-slate-800">
              {gameState.currentLevelIndex + 1} / {LEVELS.length}
            </div>
            <div className="w-full bg-slate-200 h-1 mt-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-500" 
                style={{ width: `${((gameState.currentLevelIndex) / LEVELS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 uppercase mb-1">남은 시간</div>
            <div className={`text-2xl font-bold flex items-center gap-2 ${gameState.timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
              <Clock className="w-5 h-5" />
              {formatTime(gameState.timeRemaining)}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="text-xs text-slate-500 uppercase mb-1">평판 점수</div>
            <div className="text-2xl font-bold text-yellow-600">
              {gameState.score}
            </div>
          </div>
        </div>

        <div className="mt-auto flex-1 overflow-y-auto min-h-[100px] text-xs space-y-2 font-mono text-green-700 p-2 bg-green-50 rounded-lg border border-green-200 shadow-inner">
          {gameState.history.slice().reverse().map((log, i) => (
            <div key={i}>&gt; {log}</div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 relative flex flex-col max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-500" />
              임무: {currentLevel.title}
            </h2>
            <p className="text-slate-600">{currentLevel.storyContext}</p>
          </div>
          <button 
            onClick={() => setIsToolOpen(!isToolOpen)}
            className="md:hidden p-2 bg-indigo-600 rounded-lg text-white shadow-md"
          >
            {isToolOpen ? '도구 닫기' : '도구 열기'}
          </button>
        </header>

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* Puzzle Section */}
          <section className="flex-1 bg-white border-2 border-slate-200 rounded-xl p-6 relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <ShieldAlert className="w-32 h-32" />
             </div>

             <div className="mb-8">
               <label className="text-indigo-600 text-sm font-bold uppercase tracking-widest block mb-2">감청된 데이터</label>
               <div className="bg-slate-50 border-l-4 border-red-500 p-6 rounded-lg font-mono text-2xl md:text-4xl text-slate-800 shadow-sm tracking-widest break-all">
                 {currentLevel.cipherText}
               </div>
               <p className="mt-4 text-slate-600 italic">
                 <span className="text-yellow-600 font-bold">목표: </span> 
                 {currentLevel.description}
               </p>
             </div>

             {/* Input Area */}
             <form onSubmit={handleSubmit} className="max-w-md">
                <label className="text-slate-600 text-xs uppercase block mb-1 font-semibold">해독된 비밀번호</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="flex-1 bg-slate-50 border-2 border-slate-300 text-slate-800 p-3 rounded-lg focus:outline-none focus:border-indigo-500 font-mono text-lg uppercase placeholder:text-slate-400"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-md"
                  >
                    <Unlock className="w-5 h-5" />
                    제출
                  </button>
                </div>
             </form>

             {/* Feedback Area */}
             <div className="mt-6 min-h-[80px]">
               {isLoadingHint && (
                 <div className="flex items-center gap-2 text-yellow-600 animate-pulse">
                   <Cpu className="w-4 h-4" /> 암호화 패턴 분석 중...
                 </div>
               )}
               {aiFeedback && !isLoadingHint && (
                 <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg text-yellow-800 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-yellow-700 mb-1">멘토 피드백</span>
                      {aiFeedback}
                    </div>
                 </div>
               )}
               {!aiFeedback && !isLoadingHint && (
                  <button 
                    onClick={useHint}
                    className="text-xs text-slate-500 hover:text-indigo-600 underline mt-2"
                  >
                    힌트 요청 (-{PENALTY_PER_HINT}점)
                  </button>
               )}
             </div>
          </section>

          {/* Tools Panel (Desktop: Always visible col, Mobile: Toggle) */}
          <section className={`
            ${isToolOpen ? 'fixed inset-0 z-50 bg-slate-900/90 p-4 flex items-center justify-center' : 'hidden'}
            lg:block lg:static lg:w-96 lg:bg-transparent lg:p-0
          `}>
             <div className="w-full max-w-md lg:max-w-none relative">
               {isToolOpen && (
                 <button 
                   onClick={() => setIsToolOpen(false)}
                   className="lg:hidden absolute -top-12 right-0 text-white font-bold"
                 >
                   닫기 X
                 </button>
               )}
               
               <div className="bg-white border-2 border-indigo-200 rounded-xl p-1 shadow-md">
                 <div className="bg-indigo-50 p-2 rounded-t-lg mb-1 text-center text-indigo-600 font-bold text-xs uppercase tracking-widest">
                   사용 가능한 도구
                 </div>
                 {renderTool()}
               </div>

               <div className="mt-4 text-center">
                 <p className="text-xs text-slate-500">
                   임무 요건에 따라 도구가 자동 선택되었습니다.
                 </p>
               </div>
             </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default App;