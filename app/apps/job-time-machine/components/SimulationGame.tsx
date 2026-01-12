import React, { useState, useEffect } from 'react';
import { JOB_CARDS } from '../constants';
import { JobType, JobCard } from '../types';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

const SimulationGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [animating, setAnimating] = useState<'left' | 'right' | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentCard = JOB_CARDS[currentIndex];
  const progress = (currentIndex / JOB_CARDS.length) * 100;

  const handleChoice = (choice: JobType) => {
    if (animating || gameStatus === 'finished') return;

    const isCorrect = currentCard.type === choice;
    const direction = choice === JobType.PAST ? 'left' : 'right';

    setAnimating(direction);
    
    if (isCorrect) {
      const points = 100 + (combo * 20);
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      setFeedback('correct');
    } else {
      setCombo(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setAnimating(null);
      if (currentIndex < JOB_CARDS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameStatus('finished');
      }
    }, 800);
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setGameStatus('playing');
  };

  const getRankTitle = (finalScore: number) => {
    if (finalScore >= 1200) return '미래 예측 전문가 🎓';
    if (finalScore >= 800) return '시간 여행자 🚀';
    return '직업 탐험가 🔍';
  };

  if (gameStatus === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center p-6 animate-fade-in">
        <Trophy size={64} className="text-yellow-400 mb-6 drop-shadow-lg" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">시뮬레이션 완료!</h2>
        <p className="text-gray-500 mb-8">당신의 미래 예측 능력은?</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 w-full max-w-md">
          <div className="text-5xl font-black text-blue-600 mb-2">{score}점</div>
          <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-lg mb-6">
            {getRankTitle(score)}
          </div>
          <p className="text-gray-600 mb-6">
            {score >= 1000 
              ? "대단해요! 직업의 변화 흐름을 완벽하게 파악하고 계시네요." 
              : "잘했어요! 조금 더 공부하면 완벽한 미래 전문가가 될 수 있어요."}
          </p>
          <button 
            onClick={resetGame}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={20} />
            <span>다시 도전하기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto relative min-h-[600px]">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-blue-100">
          <span className="text-sm text-gray-500 font-bold mr-1">SCORE</span>
          <span className="text-xl font-black text-blue-600">{score}</span>
        </div>
        {combo > 1 && (
          <div className="animate-bounce bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md">
            {combo} COMBO!
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Card Area */}
      <div className="relative w-full h-[420px] card-stack-container flex justify-center items-center">
        {/* Feedback Overlay */}
        {feedback && (
          <div className={`absolute z-20 top-10 flex flex-col items-center animate-ping-once
            ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
            {feedback === 'correct' ? <CheckCircle size={80} /> : <XCircle size={80} />}
          </div>
        )}

        {/* The Card */}
        <div 
          className={`absolute w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-500 ease-in-out transform
            ${animating === 'left' ? '-translate-x-[150%] rotate-[-20deg] opacity-0' : ''}
            ${animating === 'right' ? 'translate-x-[150%] rotate-[20deg] opacity-0' : ''}
          `}
        >
          <div className="h-1/2 overflow-hidden bg-gray-100 relative">
             <img 
               src={`https://picsum.photos/seed/${currentCard.imageKeyword}/400/300`} 
               alt={currentCard.title}
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex items-end p-6">
                <h3 className="text-2xl font-bold text-white shadow-sm">{currentCard.title}</h3>
             </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-white relative">
             <p className="text-gray-600 leading-relaxed text-sm md:text-base">
               {feedback && animating ? currentCard.description : "이 직업은 과거로 사라졌을까요, 아니면 미래에 새로 생겨나거나 유망할까요?"}
             </p>
             
             <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-600 font-medium text-center">
                카드를 좌우로 분류해주세요!
             </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between w-full mt-8 px-4 gap-4">
        <button
          onClick={() => handleChoice(JobType.PAST)}
          disabled={!!animating}
          className="flex-1 py-4 bg-white border-2 border-red-100 rounded-2xl shadow-sm flex flex-col items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-300 transition-all active:scale-95 disabled:opacity-50"
        >
          <ThumbsDown className="mb-1" />
          <span className="font-bold">과거/사라짐</span>
        </button>
        <button
          onClick={() => handleChoice(JobType.FUTURE)}
          disabled={!!animating}
          className="flex-1 py-4 bg-white border-2 border-blue-100 rounded-2xl shadow-sm flex flex-col items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all active:scale-95 disabled:opacity-50"
        >
          <ThumbsUp className="mb-1" />
          <span className="font-bold">미래/유망</span>
        </button>
      </div>
    </div>
  );
};

export default SimulationGame;
