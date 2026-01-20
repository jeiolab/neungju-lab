import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart2, BookOpen, Trophy, Settings, ChevronRight, HelpCircle } from 'lucide-react';
import { GameConfig, GameState, Strategy, GuessLog } from './types';
import { THEORY_CARDS, BADGES } from './constants';
import { getStats, updateStatsAfterGame } from './services/storageService';
import { Visualizer } from './components/Visualizer';
import { QuizSection } from './components/QuizSection';

const App: React.FC = () => {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState<'THEORY' | 'GAME' | 'STATS' | 'QUIZ'>('GAME');
  const [stats, setStats] = useState(getStats());
  const [showConfetti, setShowConfetti] = useState(false);
  const [newBadgeAlert, setNewBadgeAlert] = useState<string | null>(null);

  // --- Game Config State ---
  const [config, setConfig] = useState<GameConfig>({
    min: 1,
    max: 100,
    target: 50,
    strategy: 'BINARY',
    isPractice: false,
  });
  const [userInputGuess, setUserInputGuess] = useState<string>('');
  
  // --- Game Execution State ---
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isWon: false,
    attempts: 0,
    currentMin: 1,
    currentMax: 100,
    logs: [],
    startTime: 0,
  });

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [gameState.logs]);

  // --- Logic ---

  const startGame = () => {
    const target = config.isPractice 
      ? config.target 
      : Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;

    setGameState({
      isPlaying: true,
      isWon: false,
      attempts: 0,
      currentMin: config.min,
      currentMax: config.max,
      logs: [],
      startTime: Date.now()
    });
    
    // If we randomly generated, update config target strictly for internal tracking (not shown to user unless practice)
    setConfig(prev => ({ ...prev, target }));
    setUserInputGuess('');
  };

  const handleGuess = (val: number) => {
    if (!gameState.isPlaying || gameState.isWon) return;
    if (val < gameState.currentMin || val > gameState.currentMax) {
      alert(`범위를 벗어났습니다! ${gameState.currentMin}에서 ${gameState.currentMax} 사이를 입력하세요.`);
      return;
    }

    const isCorrect = val === config.target;
    let newMin = gameState.currentMin;
    let newMax = gameState.currentMax;
    let result: 'UP' | 'DOWN' | 'CORRECT' = 'CORRECT';
    let suggestion = '';

    // Calculate Coach Suggestion (Binary Logic)
    const idealGuess = Math.floor((gameState.currentMin + gameState.currentMax) / 2);
    const diff = Math.abs(val - idealGuess);
    if (diff === 0) suggestion = "훌륭해요! 정확히 중간값을 선택하여 범위를 절반으로 줄였습니다.";
    else if (diff < (gameState.currentMax - gameState.currentMin) * 0.1) suggestion = "좋은 선택입니다. 중간값에 가깝습니다.";
    else suggestion = `효율적인 탐색을 위해서는 ${idealGuess}(중간값) 근처를 추천합니다.`;

    if (val < config.target) {
      newMin = val + 1;
      result = 'UP';
    } else if (val > config.target) {
      newMax = val - 1;
      result = 'DOWN';
    }

    const newLog: GuessLog = {
      guess: val,
      result,
      timestamp: Date.now(),
      rangeAfter: { min: newMin, max: newMax },
      suggestion
    };

    const newAttempts = gameState.attempts + 1;

    setGameState(prev => ({
      ...prev,
      attempts: newAttempts,
      currentMin: newMin,
      currentMax: newMax,
      isWon: isCorrect,
      isPlaying: !isCorrect,
      logs: [...prev.logs, newLog]
    }));

    setUserInputGuess('');

    if (isCorrect) {
      handleWin(newAttempts);
    }
  };

  const handleWin = (attempts: number) => {
    const rangeKey = `${config.min}-${config.max}`;
    const { stats: newStats, newBadges } = updateStatsAfterGame(attempts, true, rangeKey, config, gameState);
    setStats(newStats);
    
    if (newBadges.length > 0) {
      setNewBadgeAlert(newBadges[0].name);
      setTimeout(() => setNewBadgeAlert(null), 3000);
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false, isWon: false }));
    setUserInputGuess('');
  };

  const calculateMaxBinaryAttempts = () => {
      const range = config.max - config.min + 1;
      return Math.floor(Math.log2(range)) + 1;
  }

  // --- Render Helpers ---

  const renderTheory = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {THEORY_CARDS.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">{card.icon}</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
          <p className="text-slate-600 mb-4 leading-relaxed">{card.content}</p>
          <div className="flex flex-wrap gap-2">
            {card.keywords.map(k => (
              <span key={k} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">#{k}</span>
            ))}
          </div>
        </div>
      ))}
      <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">💡 생각해볼 문제</h3>
        <p className="text-blue-800">
           범위가 1부터 1,000,000(백만)이라면? <br/>
           순차 탐색은 운이 나쁘면 백만 번 확인해야 하지만, 
           이진 탐색은 약 <strong>20번</strong> 만에 찾을 수 있습니다. <br/>
           직접 실험실에서 범위를 늘려서 테스트해보세요!
        </p>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="max-w-3xl mx-auto p-4">
      {/* Config Panel */}
      {!gameState.isPlaying && !gameState.isWon && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 mb-8 animate-in slide-in-from-bottom-5">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
             <Settings className="w-6 h-6 mr-2 text-indigo-600"/>실험 설정
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">탐색 범위 (최대값)</label>
              <div className="flex gap-4">
                 {[100, 1000, 10000].map(val => (
                   <button 
                    key={val}
                    onClick={() => setConfig({ ...config, max: val })}
                    className={`px-4 py-2 rounded-lg border transition-all ${config.max === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                   >
                     1 ~ {val.toLocaleString()}
                   </button>
                 ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">모드 선택</label>
              <div className="flex gap-4">
                  <button 
                    onClick={() => setConfig({...config, isPractice: false})}
                    className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${!config.isPractice ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-500'}`}
                  >
                      🧪 랜덤 실험 (Blind)
                  </button>
                  <button 
                    onClick={() => setConfig({...config, isPractice: true})}
                    className={`flex-1 py-3 rounded-xl border-2 text-center transition-all ${config.isPractice ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-bold' : 'border-slate-100 text-slate-500'}`}
                  >
                      🏋️ 연습 모드 (Open)
                  </button>
              </div>
            </div>

            {config.isPractice && (
               <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">목표 숫자 설정</label>
                  <input 
                    type="number" 
                    value={config.target}
                    onChange={(e) => setConfig({...config, target: Number(e.target.value)})}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
               </div>
            )}

            <button 
              onClick={startGame}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] flex justify-center items-center text-lg"
            >
              <Play className="w-5 h-5 mr-2 fill-current" /> 실험 시작
            </button>
          </div>
        </div>
      )}

      {/* Active Game Interface */}
      {(gameState.isPlaying || gameState.isWon) && (
        <div className="animate-in fade-in duration-500">
           {/* Header Stats */}
           <div className="flex justify-between items-center mb-6 bg-slate-800 text-white p-4 rounded-xl shadow-lg">
              <div className="text-center px-4 border-r border-slate-600">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">시도 횟수</div>
                  <div className="text-2xl font-mono font-bold text-yellow-400">{gameState.attempts}</div>
              </div>
              <div className="text-center px-4 border-r border-slate-600">
                   <div className="text-xs text-slate-400 uppercase tracking-wider">이진 탐색 최적</div>
                   <div className="text-xl font-mono">~{calculateMaxBinaryAttempts()}회</div>
              </div>
              <div className="text-center px-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider">남은 범위</div>
                  <div className="text-xl font-mono">{gameState.currentMax - gameState.currentMin + 1}</div>
              </div>
           </div>

           {/* Visualizer */}
           <Visualizer 
              min={config.min}
              max={config.max}
              currentMin={gameState.currentMin}
              currentMax={gameState.currentMax}
              target={gameState.isWon || config.isPractice ? config.target : undefined}
              lastGuess={gameState.logs.length > 0 ? gameState.logs[gameState.logs.length-1].guess : undefined}
           />

           {/* Win State */}
           {gameState.isWon && (
               <div className="bg-green-100 border-2 border-green-500 p-8 rounded-2xl text-center mb-8 animate-bounce-in">
                   <h2 className="text-3xl font-black text-green-800 mb-2">🎉 실험 성공!</h2>
                   <p className="text-green-700 mb-6">
                       총 <strong>{gameState.attempts}</strong>번 만에 숫자를 찾았습니다.<br/>
                       {gameState.attempts <= calculateMaxBinaryAttempts() 
                         ? "이진 탐색만큼 효율적이었습니다! 훌륭해요." 
                         : `이진 탐색을 사용했다면 약 ${calculateMaxBinaryAttempts()}번 만에 찾을 수 있었습니다.`}
                   </p>
                   <button 
                     onClick={resetGame}
                     className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-colors flex items-center mx-auto"
                   >
                       <RotateCcw className="w-4 h-4 mr-2"/> 다시 하기
                   </button>
               </div>
           )}

           {/* Input Area */}
           {gameState.isPlaying && (
            <div className="flex gap-2 mb-8">
                <input 
                  type="number"
                  placeholder={`${gameState.currentMin} ~ ${gameState.currentMax} 사이 입력`}
                  className="flex-1 p-4 text-lg border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                  value={userInputGuess}
                  onChange={(e) => setUserInputGuess(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess(Number(userInputGuess))}
                  autoFocus
                />
                <button 
                  onClick={() => handleGuess(Number(userInputGuess))}
                  className="bg-indigo-600 text-white px-8 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-transform active:scale-95"
                >
                    확인
                </button>
            </div>
           )}

           {/* Log & Feed */}
           <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
               <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">실험 로그</h3>
               <div className="space-y-3">
                   {gameState.logs.length === 0 && <div className="text-gray-400 text-center py-4 italic">아직 시도가 없습니다.</div>}
                   {gameState.logs.map((log, i) => (
                       <div key={i} className="flex flex-col bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                           <div className="flex justify-between items-center mb-1">
                               <span className="font-mono font-bold text-indigo-900">#{i+1} : {log.guess}</span>
                               <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.result === 'UP' ? 'bg-red-100 text-red-600' : log.result === 'DOWN' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                   {log.result === 'CORRECT' ? '정답' : log.result}
                               </span>
                           </div>
                           <p className="text-xs text-gray-500">{log.suggestion}</p>
                       </div>
                   ))}
                   <div ref={logsEndRef} />
               </div>
           </div>
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="p-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-black text-indigo-600">{stats.totalGames}</div>
                <div className="text-xs text-slate-500 mt-1">총 실험 횟수</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-black text-orange-500">{stats.streak}일</div>
                <div className="text-xs text-slate-500 mt-1">연속 출석</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-black text-blue-500">{stats.bestAttempts['1-1000'] || '-'}</div>
                <div className="text-xs text-slate-500 mt-1">1000 범위 최고기록</div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-black text-emerald-500">{stats.badges.length}</div>
                <div className="text-xs text-slate-500 mt-1">획득 배지</div>
            </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> 나의 배지
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {BADGES.map(badge => {
                const hasBadge = stats.badges.includes(badge.id);
                return (
                    <div key={badge.id} className={`p-4 rounded-xl border ${hasBadge ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 grayscale opacity-50'} flex flex-col items-center text-center transition-all`}>
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <div className="font-bold text-sm mb-1">{badge.name}</div>
                        <div className="text-xs text-gray-500">{badge.description}</div>
                        {!hasBadge && <div className="mt-2 text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500">잠김</div>}
                    </div>
                )
            })}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Alert Overlay */}
      {newBadgeAlert && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-full shadow-xl z-50 animate-bounce font-bold flex items-center">
              <Trophy className="w-5 h-5 mr-2"/>
              새로운 배지 획득: {newBadgeAlert}
          </div>
      )}
      {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
               {/* Simplified CSS confetti effect would go here, or just basic celebration UI */}
          </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">UD</div>
            <h1 className="font-bold text-lg hidden sm:block">UP/DOWN 탐색 실험실</h1>
          </div>
          <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-500">
             Level {Math.floor(stats.totalGames / 5) + 1}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pt-6">
        {activeTab === 'GAME' && renderGame()}
        {activeTab === 'THEORY' && renderTheory()}
        {activeTab === 'STATS' && renderStats()}
        {activeTab === 'QUIZ' && (
            <div className="p-4">
                 <QuizSection apiKey={process.env.API_KEY} />
            </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 h-16 flex justify-around items-center z-40 pb-safe">
        <button 
          onClick={() => setActiveTab('GAME')}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'GAME' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <Play className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-medium">실험실</span>
        </button>
        <button 
          onClick={() => setActiveTab('THEORY')}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'THEORY' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <BookOpen className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-medium">이론</span>
        </button>
        <button 
          onClick={() => setActiveTab('QUIZ')}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'QUIZ' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <HelpCircle className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-medium">퀴즈</span>
        </button>
        <button 
          onClick={() => setActiveTab('STATS')}
          className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'STATS' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <BarChart2 className="w-6 h-6 mb-0.5" />
          <span className="text-[10px] font-medium">리포트</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
