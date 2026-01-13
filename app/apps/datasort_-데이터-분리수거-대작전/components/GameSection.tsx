import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataType, DataItem, GameState } from '../types';
import { DATA_TEMPLATES } from '../constants';
import { RotateCcw, Play, Trophy } from 'lucide-react';

const GAME_DURATION = 60;

const GameSection: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: GAME_DURATION,
    isPlaying: false,
    combo: 0,
    gameOver: false,
    highScore: 0,
    mistakes: []
  });

  const [currentItem, setCurrentItem] = useState<DataItem | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | null }>({ msg: '', type: null });
  
  // Load high score
  useEffect(() => {
    const savedScore = localStorage.getItem('datasort-highscore');
    if (savedScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedScore, 10) }));
    }
  }, []);

  const spawnItem = useCallback(() => {
    const template = DATA_TEMPLATES[Math.floor(Math.random() * DATA_TEMPLATES.length)];
    const newItem: DataItem = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
    };
    setCurrentItem(newItem);
  }, []);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      timeLeft: GAME_DURATION,
      isPlaying: true,
      combo: 0,
      gameOver: false,
      mistakes: []
    }));
    spawnItem();
    setFeedback({ msg: '', type: null });
  };

  const endGame = useCallback(() => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      localStorage.setItem('datasort-highscore', newHighScore.toString());
      return {
        ...prev,
        isPlaying: false,
        gameOver: true,
        highScore: newHighScore
      };
    });
  }, []);

  // Timer
  useEffect(() => {
    let timer: number;
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = window.setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            endGame();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft, endGame]);

  const handleDrop = (targetType: DataType) => {
    if (!currentItem || !gameState.isPlaying) return;

    if (currentItem.type === targetType) {
      // Correct
      const comboBonus = Math.floor(gameState.combo / 5) * 5;
      setGameState(prev => ({
        ...prev,
        score: prev.score + 10 + comboBonus,
        combo: prev.combo + 1
      }));
      setFeedback({ msg: 'Clean Code! +10', type: 'success' });
      spawnItem();
    } else {
      // Incorrect
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 5),
        combo: 0,
        timeLeft: Math.max(0, prev.timeLeft - 2), // Penalty time
        mistakes: [...prev.mistakes, `${currentItem.display} -> ${targetType} (X)`]
      }));
      setFeedback({ msg: 'Type Error! -5', type: 'error' });
    }

    // Reset feedback after animation
    setTimeout(() => setFeedback({ msg: '', type: null }), 1000);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (currentItem) {
      e.dataTransfer.setData('text/plain', currentItem.id);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropEvent = (e: React.DragEvent, type: DataType) => {
    e.preventDefault();
    handleDrop(type);
  };

  const Bin = ({ type, color, label }: { type: DataType; color: string; label: string }) => (
    <div
      onDragOver={handleDragOver}
      onDrop={(e) => handleDropEvent(e, type)}
      className={`
        h-32 md:h-48 border-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${color} backdrop-blur-sm
        hover:scale-105 active:scale-95 shadow-lg
      `}
    >
      <div className="text-3xl md:text-5xl mb-2">
        {type === 'int' && '🔢'}
        {type === 'float' && '📏'}
        {type === 'str' && '🔤'}
        {type === 'bool' && '⚖️'}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">{label}</h3>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-fadeIn max-w-4xl mx-auto">
      {/* HUD */}
      <div className="bg-slate-800/80 rounded-xl p-4 mb-6 flex justify-between items-center shadow-lg border border-slate-600">
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase">Time Limit</p>
          <p className={`text-2xl font-mono font-bold ${gameState.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {gameState.timeLeft}s
          </p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase">Score</p>
          <p className="text-3xl font-mono font-bold text-cyan-400">{gameState.score}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase">Combo</p>
          <p className="text-2xl font-mono font-bold text-yellow-400">{gameState.combo}x</p>
        </div>
      </div>

      {/* Main Game Area */}
      {!gameState.isPlaying && !gameState.gameOver && (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 p-8">
          <h2 className="text-4xl font-bold text-white mb-4">데이터 분리수거 준비 완료?</h2>
          <p className="text-slate-300 mb-8 text-center max-w-md">
            화면에 나타나는 데이터를 올바른 자료형 통에 드래그하여 넣으세요.<br/>
            연속으로 성공하면 '메모리 세이버' 칭호와 추가 점수를 얻습니다!
          </p>
          <button
            onClick={startGame}
            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold text-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] flex items-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            작전 시작
          </button>
        </div>
      )}

      {gameState.gameOver && (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 rounded-2xl border-2 border-slate-700 p-8 animate-slideIn">
          <Trophy className="w-16 h-16 text-yellow-400 mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-white mb-2">작전 종료!</h2>
          <p className="text-slate-300 mb-6">최종 점수: <span className="text-cyan-400 font-bold text-2xl">{gameState.score}</span></p>
          <p className="text-slate-400 text-sm mb-6">최고 기록: {gameState.highScore}</p>
          
          {gameState.mistakes.length > 0 && (
             <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-6 w-full max-w-md">
               <h3 className="text-red-300 font-bold mb-2 text-sm">오답 분석 노트</h3>
               <ul className="text-red-200 text-xs list-disc pl-4 h-24 overflow-y-auto">
                 {gameState.mistakes.map((m, idx) => <li key={idx}>{m}</li>)}
               </ul>
             </div>
          )}

          <button
            onClick={startGame}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            다시 도전
          </button>
        </div>
      )}

      {gameState.isPlaying && (
        <div className="flex-1 relative flex flex-col">
          {/* Spawn Area */}
          <div className="flex-1 flex items-center justify-center relative min-h-[150px]">
            {feedback.msg && (
              <div className={`absolute top-0 animate-bounce font-bold text-xl ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {feedback.msg}
              </div>
            )}
            
            {currentItem && (
              <div
                draggable
                onDragStart={handleDragStart}
                className="w-48 h-24 bg-white text-slate-900 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center text-3xl font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform select-none z-10"
              >
                {currentItem.display}
              </div>
            )}
            
            <p className="absolute bottom-4 text-slate-500 text-sm animate-pulse">
              데이터를 드래그해서 아래 알맞은 통에 넣으세요!
            </p>
          </div>

          {/* Bins */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Bin type="int" label="정수 (int)" color="bg-blue-600/20 border-blue-500 hover:bg-blue-600/40" />
            <Bin type="float" label="실수 (float)" color="bg-green-600/20 border-green-500 hover:bg-green-600/40" />
            <Bin type="str" label="문자열 (str)" color="bg-yellow-600/20 border-yellow-500 hover:bg-yellow-600/40" />
            <Bin type="bool" label="불린 (bool)" color="bg-purple-600/20 border-purple-500 hover:bg-purple-600/40" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSection;
