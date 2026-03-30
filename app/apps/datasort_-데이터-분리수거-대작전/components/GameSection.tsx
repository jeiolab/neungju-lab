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
        ${color}
        hover:scale-105 active:scale-95 shadow-md
      `}
    >
      <div className="text-3xl md:text-5xl mb-2">
        {type === 'int' && '🔢'}
        {type === 'float' && '📏'}
        {type === 'str' && '🔤'}
        {type === 'bool' && '⚖️'}
      </div>
      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider">{label}</h3>
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-fadeIn max-w-4xl mx-auto">
      {/* HUD */}
      <div className="bg-white rounded-xl p-4 mb-6 flex justify-between items-center shadow-sm border border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase">Time Limit</p>
          <p className={`text-2xl font-mono font-bold ${gameState.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
            {gameState.timeLeft}s
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase">Score</p>
          <p className="text-3xl font-mono font-bold text-blue-600">{gameState.score}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase">Combo</p>
          <p className="text-2xl font-mono font-bold text-yellow-500">{gameState.combo}x</p>
        </div>
      </div>

      {/* Main Game Area */}
      {!gameState.isPlaying && !gameState.gameOver && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">데이터 분리수거 준비 완료?</h2>
          <p className="text-gray-600 mb-8 text-center max-w-md">
            화면에 나타나는 데이터를 올바른 자료형 통에 드래그하여 넣으세요.<br/>
            연속으로 성공하면 '메모리 세이버' 칭호와 추가 점수를 얻습니다!
          </p>
          <button
            onClick={startGame}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-lg flex items-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            작전 시작
          </button>
        </div>
      )}

      {gameState.gameOver && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-gray-300 p-8 animate-slideIn">
          <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">작전 종료!</h2>
          <p className="text-gray-600 mb-6">최종 점수: <span className="text-blue-600 font-bold text-2xl">{gameState.score}</span></p>
          <p className="text-gray-500 text-sm mb-6">최고 기록: {gameState.highScore}</p>
          
          {gameState.mistakes.length > 0 && (
             <div className="bg-red-50 border border-red-300 p-4 rounded-lg mb-6 w-full max-w-md">
               <h3 className="text-red-700 font-bold mb-2 text-sm">오답 분석 노트</h3>
               <ul className="text-red-600 text-xs list-disc pl-4 h-24 overflow-y-auto">
                 {gameState.mistakes.map((m, idx) => <li key={idx}>{m}</li>)}
               </ul>
             </div>
          )}

          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            다시 도전
          </button>
        </div>
      )}

      {gameState.isPlaying && (
        <div className="flex-1 relative flex flex-col">
          {/* Spawn Area */}
          <div className="flex-1 flex items-center justify-center relative min-h-[200px] mb-4">
            {feedback.msg && (
              <div className={`absolute top-0 animate-bounce font-bold text-xl z-20 ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback.msg}
              </div>
            )}
            
            {currentItem && (
              <div
                draggable
                onDragStart={handleDragStart}
                className="w-48 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-xl border-2 border-indigo-700 flex items-center justify-center text-3xl font-bold cursor-grab active:cursor-grabbing hover:scale-110 transition-transform select-none z-10"
              >
                {currentItem.display}
              </div>
            )}
            
            <p className="absolute bottom-0 left-0 right-0 text-center text-gray-800 text-base font-bold bg-white/95 py-3 px-4 rounded-lg shadow-md border border-gray-300">
              데이터를 드래그해서 아래 알맞은 통에 넣으세요!
            </p>
          </div>

          {/* Bins */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Bin type="int" label="정수 (int)" color="bg-blue-500 border-blue-700 hover:bg-blue-600 text-white shadow-lg" />
            <Bin type="float" label="실수 (float)" color="bg-green-500 border-green-700 hover:bg-green-600 text-white shadow-lg" />
            <Bin type="str" label="문자열 (str)" color="bg-yellow-500 border-yellow-700 hover:bg-yellow-600 text-white shadow-lg" />
            <Bin type="bool" label="불린 (bool)" color="bg-purple-500 border-purple-700 hover:bg-purple-600 text-white shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSection;
