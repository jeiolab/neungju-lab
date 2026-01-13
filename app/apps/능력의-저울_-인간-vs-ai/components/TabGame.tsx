import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_TASKS } from '../constants';
import { Classification, TaskCard } from '../types';
import { Play, Pause, RefreshCw, Trophy, AlertCircle } from 'lucide-react';

interface TabGameProps {
  onScoreUpdate: (score: number) => void;
}

const TabGame: React.FC<TabGameProps> = ({ onScoreUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState<TaskCard | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  
  const timerRef = useRef<number | null>(null);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setFeedback(null);
    nextItem();
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const nextItem = () => {
    const randomItem = GAME_TASKS[Math.floor(Math.random() * GAME_TASKS.length)];
    setCurrentItem(randomItem);
  };

  const handleDecision = (decision: Classification) => {
    if (!currentItem || !isPlaying) return;

    if (currentItem.category === decision) {
      const points = 10;
      setScore((prev) => prev + points);
      setFeedback({ text: '+10 정확한 판단!', color: 'text-green-400' });
    } else {
      setScore((prev) => Math.max(0, prev - 5));
      setFeedback({ text: '오답! 다시 생각해보세요.', color: 'text-red-400' });
    }

    setTimeout(() => setFeedback(null), 800);
    nextItem();
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, endGame]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4">
      {!isPlaying && timeLeft === 30 && (
        <div className="text-center space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-600 shadow-2xl max-w-md">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">업무 분류 시뮬레이션</h2>
          <p className="text-slate-300">
            화면에 나타나는 업무가 <strong>인간</strong>의 영역인지, <strong>AI</strong>의 영역인지, 혹은 <strong>협업</strong>이 필요한지 빠르게 판단하세요!
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all flex items-center gap-2 mx-auto"
          >
            <Play size={20} /> 분석 시작
          </button>
        </div>
      )}

      {!isPlaying && timeLeft === 0 && (
        <div className="text-center space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-600 shadow-2xl max-w-md">
          <h2 className="text-2xl font-bold text-white">시뮬레이션 종료</h2>
          <div className="text-4xl font-bold text-yellow-400 mb-2">{score} 점</div>
          <p className="text-slate-300">
            {score > 100 ? "탁월한 통찰력입니다! 분석가 자질이 충분하군요." : "조금 더 학습이 필요합니다."}
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={20} /> 다시 도전
          </button>
        </div>
      )}

      {isPlaying && currentItem && (
        <div className="w-full max-w-2xl space-y-8">
          {/* Header Stats */}
          <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Time:</span>
              <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Score:</span>
              <span className="text-xl font-mono font-bold text-yellow-400">{score}</span>
            </div>
          </div>

          {/* Game Area */}
          <div className="relative h-64 bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-600 overflow-hidden">
            {feedback && (
              <div className={`absolute top-4 font-bold text-lg animate-bounce ${feedback.color}`}>
                {feedback.text}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-105">
              <div className="text-6xl mb-2 text-center">{currentItem.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 text-center">{currentItem.title}</h3>
              <p className="text-xs text-slate-500 text-center mt-1">{currentItem.description}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleDecision(Classification.HUMAN)}
              className="p-4 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-white transition-colors border-b-4 border-orange-800 active:border-b-0 active:translate-y-1"
            >
              인간 (Human)
            </button>
            <button
              onClick={() => handleDecision(Classification.COLLAB)}
              className="p-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white transition-colors border-b-4 border-purple-800 active:border-b-0 active:translate-y-1"
            >
              협업 (Collab)
            </button>
            <button
              onClick={() => handleDecision(Classification.AI)}
              className="p-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-white transition-colors border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1"
            >
              AI
            </button>
          </div>
          
          <div className="text-center text-xs text-slate-500">
            * 삼양 164p 데이터 처리 능력 비교 기준에 따름
          </div>
        </div>
      )}
    </div>
  );
};

export default TabGame;