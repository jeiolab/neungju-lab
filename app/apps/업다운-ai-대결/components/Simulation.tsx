import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameConfig, LeaderboardEntry, GuessHistory } from '../types';
import { RANGES, INITIAL_CONFIG } from '../constants';
import NumberLine from './NumberLine';
import { Play, RotateCcw, ChevronUp, ChevronDown, Check, Trophy, AlertCircle } from 'lucide-react';

const Simulation: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.USER_HOST);
  const [config, setConfig] = useState<GameConfig>(INITIAL_CONFIG);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [message, setMessage] = useState('');
  
  // Game State
  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(100);
  const [currentGuess, setCurrentGuess] = useState<number>(0); // AI's guess or User's input
  const [targetNumber, setTargetNumber] = useState<number>(0); // For Mode B
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<GuessHistory[]>([]);

  // Mode B Input
  const [userInputValue, setUserInputValue] = useState('');

  // Ranking
  const [ranking, setRanking] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('upDownRanking');
    if (stored) setRanking(JSON.parse(stored));
  }, []);

  const saveRanking = (entry: LeaderboardEntry) => {
    const newRanking = [...ranking, entry].sort((a, b) => a.attempts - b.attempts).slice(0, 5);
    setRanking(newRanking);
    localStorage.setItem('upDownRanking', JSON.stringify(newRanking));
  };

  const getOptimalAttempts = () => Math.ceil(Math.log2(config.max - config.min + 1));

  const resetGame = () => {
    setIsPlaying(false);
    setGameEnded(false);
    setLow(config.min);
    setHigh(config.max);
    setAttempts(0);
    setHistory([]);
    setMessage('');
    setUserInputValue('');
    setCurrentGuess(0);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
    setLow(config.min);
    setHigh(config.max);

    if (mode === GameMode.USER_HOST) {
      // Mode A: AI makes first guess immediately
      const firstGuess = Math.floor((config.min + config.max) / 2);
      setCurrentGuess(firstGuess);
      setAttempts(1);
      setMessage("숫자를 생각하세요! 이 숫자가 맞나요?");
    } else {
      // Mode B: Generate random target
      const target = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
      setTargetNumber(target);
      setMessage("숫자를 정했습니다. 맞춰보세요!");
    }
  };

  // --- Mode A Logic (User is Host, AI Guesses) ---
  const handleAiGuess = (result: 'UP' | 'DOWN' | 'CORRECT') => {
    const newHistory = [...history, { value: currentGuess, result, turn: attempts }];
    setHistory(newHistory);

    if (result === 'CORRECT') {
      endGame(true);
      return;
    }

    let newLow = low;
    let newHigh = high;

    if (result === 'UP') {
      // The answer is higher than currentGuess
      newLow = currentGuess + 1;
    } else {
      // The answer is lower than currentGuess
      newHigh = currentGuess - 1;
    }

    if (newLow > newHigh) {
      setGameEnded(true);
      setMessage("잠깐, 뭔가 이상해요. 힌트를 잘못 주신 것 같아요!");
      return;
    }

    setLow(newLow);
    setHigh(newHigh);

    // AI Binary Search Step
    const nextGuess = Math.floor((newLow + newHigh) / 2);
    setCurrentGuess(nextGuess);
    setAttempts(p => p + 1);
  };

  // --- Mode B Logic (AI is Host, User Guesses) ---
  const handleUserGuess = (e?: React.FormEvent) => {
    e?.preventDefault();
    const val = parseInt(userInputValue);
    if (isNaN(val) || val < config.min || val > config.max) {
      setMessage(`${config.min}에서 ${config.max} 사이의 숫자를 입력해주세요.`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setCurrentGuess(val);

    let result: 'UP' | 'DOWN' | 'CORRECT';
    
    if (val === targetNumber) {
      result = 'CORRECT';
      setHistory([...history, { value: val, result, turn: newAttempts }]);
      endGame(true);
      return;
    } else if (val < targetNumber) {
      result = 'UP';
      // Optimization for visualization: If user guesses 30 and target is 70, 
      // we know everything <= 30 is invalid.
      if (val >= low) setLow(val + 1);
      setMessage("업 (Up)! 더 큰 숫자입니다.");
    } else {
      result = 'DOWN';
      if (val <= high) setHigh(val - 1);
      setMessage("다운 (Down)! 더 작은 숫자입니다.");
    }
    
    setHistory([...history, { value: val, result, turn: newAttempts }]);
    setUserInputValue('');
  };

  const endGame = (success: boolean) => {
    setGameEnded(true);
    if (success) {
      const optimal = getOptimalAttempts();
      let msg = `${attempts}번 만에 맞혔습니다! (최적: ${optimal}번)`;
      if (attempts <= optimal) {
        msg += " 🏆 인간 계산기 배지 획득!";
      }
      setMessage(msg);
      saveRanking({
        date: new Date().toLocaleDateString(),
        attempts,
        range: config.max,
        mode
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Settings Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-800">게임 설정</h2>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => { setMode(GameMode.USER_HOST); resetGame(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === GameMode.USER_HOST ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                모드 A: 술래(사용자)
              </button>
              <button 
                onClick={() => { setMode(GameMode.AI_HOST); resetGame(); }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === GameMode.AI_HOST ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                모드 B: 술래(AI)
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">범위:</span>
            <select 
              className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
              value={config.max}
              onChange={(e) => {
                const max = parseInt(e.target.value);
                setConfig({ ...config, max });
                resetGame();
              }}
              disabled={isPlaying}
            >
              {RANGES.map(r => (
                <option key={r.max} value={r.max}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 min-h-[400px] flex flex-col items-center justify-center relative">
        
        {!isPlaying && !gameEnded && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play size={32} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              {mode === GameMode.USER_HOST ? "AI를 이길 준비가 되셨나요?" : "컴퓨터처럼 계산할 수 있나요?"}
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {mode === GameMode.USER_HOST 
                ? `${config.min}~${config.max} 사이의 숫자를 생각하세요. AI가 이진 탐색으로 맞힐 것입니다.`
                : `AI가 ${config.min}~${config.max} 사이의 숫자를 골랐습니다. 최소한의 횟수로 맞춰보세요.`
              }
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-transform transform hover:scale-105"
            >
              게임 시작
            </button>
          </div>
        )}

        {(isPlaying || gameEnded) && (
          <div className="w-full max-w-3xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">시도 횟수</span>
                <span className="text-3xl font-mono font-bold text-slate-800">{attempts}</span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">최적 횟수</span>
                <span className="text-3xl font-mono font-bold text-blue-600">
                   {getOptimalAttempts()}
                </span>
              </div>
            </div>

            <NumberLine 
              globalMin={config.min} 
              globalMax={config.max} 
              currentMin={low} 
              currentMax={high}
              targetGuess={isPlaying ? currentGuess : undefined}
              isModeA={mode === GameMode.USER_HOST}
            />

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {gameEnded ? (
                  <span className={attempts <= getOptimalAttempts() ? "text-green-600" : "text-slate-800"}>
                    {message}
                  </span>
                ) : message}
              </h3>
              
              {gameEnded && attempts <= getOptimalAttempts() && (
                 <div className="mt-2 inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold border border-yellow-200">
                   <Trophy size={16} className="mr-1" /> 인간 계산기
                 </div>
              )}
            </div>

            {/* Controls */}
            {!gameEnded && mode === GameMode.USER_HOST && (
               <div className="flex justify-center gap-4">
                 <button 
                  onClick={() => handleAiGuess('UP')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg font-semibold transition-all"
                 >
                   <ChevronUp /> 업 (Up)
                 </button>
                 <button 
                  onClick={() => handleAiGuess('CORRECT')}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold shadow-md transition-all"
                 >
                   <Check /> 정답!
                 </button>
                 <button 
                  onClick={() => handleAiGuess('DOWN')}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg font-semibold transition-all"
                 >
                   <ChevronDown /> 다운 (Down)
                 </button>
               </div>
            )}

            {!gameEnded && mode === GameMode.AI_HOST && (
              <form onSubmit={handleUserGuess} className="flex gap-4 justify-center">
                <input 
                  type="number" 
                  value={userInputValue}
                  onChange={(e) => setUserInputValue(e.target.value)}
                  placeholder="숫자 입력..."
                  className="px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-48 text-lg text-center font-mono"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all"
                >
                  확인
                </button>
              </form>
            )}

            {gameEnded && (
              <div className="flex justify-center mt-6">
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
                >
                  <RotateCcw size={18} /> 다시 하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard Mini View */}
      {ranking.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" /> 최고 기록
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
             {ranking.map((entry, idx) => (
               <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                 <span className="font-medium text-slate-600">
                   {entry.mode === GameMode.AI_HOST ? '나(술래)' : '나(출제)'} ({entry.range})
                 </span>
                 <span className="font-bold text-blue-600">{entry.attempts}회 시도</span>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;