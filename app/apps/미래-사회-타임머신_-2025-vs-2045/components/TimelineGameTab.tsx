import React, { useState, useEffect } from 'react';
import { GAME_CARDS, RANKS } from '../constants';
import { GameCard } from '../types';
import { ArrowLeft, ArrowRight, RefreshCw, Trophy } from 'lucide-react';

const TimelineGameTab: React.FC = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastResultCorrect, setLastResultCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Shuffle cards
    const shuffled = [...GAME_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setGameOver(false);
  };

  const handleChoice = (choice: '2025' | '2045') => {
    if (showResult || gameOver) return;

    const currentCard = cards[currentIndex];
    const isCorrect = currentCard.era === choice;

    setLastResultCorrect(isCorrect);
    if (isCorrect) setScore(prev => prev + 10);
    
    setShowResult(true);

    // Auto advance after short delay
    setTimeout(() => {
      setShowResult(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setGameOver(true);
        saveScore(score + (isCorrect ? 10 : 0));
      }
    }, 1500);
  };

  const saveScore = (finalScore: number) => {
    const history = JSON.parse(localStorage.getItem('future_game_history') || '[]');
    history.push({ date: new Date().toISOString(), score: finalScore });
    localStorage.setItem('future_game_history', JSON.stringify(history));
  };

  const getRankTitle = (finalScore: number) => {
    const reversedRanks = [...RANKS].reverse();
    return reversedRanks.find(r => finalScore >= r.min)?.title || "시간 여행자";
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
        <Trophy size={64} className="text-yellow-400 mb-4" />
        <h2 className="text-3xl font-bold text-white">게임 종료!</h2>
        <div className="text-xl text-slate-300">
          당신의 점수: <span className="text-cyan-400 font-bold text-4xl">{score}</span> / 100
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <p className="text-slate-400 text-sm mb-1">나의 등급</p>
          <p className="text-2xl font-bold text-fuchsia-400">{getRankTitle(score)}</p>
        </div>
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-colors"
        >
          <RefreshCw size={20} /> 다시 도전하기
        </button>
      </div>
    );
  }

  if (cards.length === 0) return <div className="text-center p-10">로딩 중...</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col items-center pb-20 max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <span className="text-slate-400 font-mono">Card {currentIndex + 1}/{cards.length}</span>
        <span className="text-cyan-400 font-bold font-mono">Score: {score}</span>
      </div>

      {/* Card Container - Use fixed height instead of aspect-ratio to prevent crushing on small screens */}
      <div className="w-full h-[480px] perspective-1000 mb-8 px-4">
        <div className={`
          relative w-full h-full bg-slate-800 rounded-2xl border-2 shadow-2xl overflow-hidden flex flex-col
          transition-all duration-500 transform
          ${showResult ? (lastResultCorrect ? 'border-green-500 scale-105' : 'border-red-500 shake') : 'border-slate-600'}
        `}>
          {/* Image Section - Fixed height */}
          <div className="h-40 bg-slate-900 relative shrink-0">
             <img 
               src={`https://picsum.photos/400/300?random=${currentIndex}`} 
               alt="Scenario" 
               className="w-full h-full object-cover opacity-80"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent"></div>
          </div>
          
          {/* Content Section - Flex grow */}
          <div className="flex-1 flex flex-col items-center p-6 text-center relative z-10 w-full">
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <h3 className="text-xl font-bold text-white break-keep leading-normal">
                {currentCard.title}
              </h3>
              <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
              <p className="text-slate-300 text-sm leading-7 break-keep">
                {currentCard.description}
              </p>
            </div>
            
            {/* Result Section - Fixed height area at bottom to prevent layout shift */}
            <div className="h-16 flex items-end justify-center w-full mt-2">
              {showResult ? (
                <div className="animate-fade-in w-full">
                  <span className={`
                    inline-block px-4 py-1.5 rounded-full text-sm font-bold border mb-2
                    ${lastResultCorrect ? 'bg-green-500/20 text-green-300 border-green-500' : 'bg-red-500/20 text-red-300 border-red-500'}
                  `}>
                    {lastResultCorrect ? '정답!' : '틀렸습니다!'}
                  </span>
                  <div className="text-fuchsia-400 text-sm font-bold truncate px-2">
                    {currentCard.concept}
                  </div>
                </div>
              ) : (
                <div className="h-full"></div> 
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-6 w-full px-4">
        <button 
          onClick={() => handleChoice('2025')}
          disabled={showResult}
          className="group flex flex-col items-center justify-center py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft className="mb-2 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-white">현재 (2025)</span>
          <span className="text-xs text-slate-500 mt-1">이미 실현됨</span>
        </button>

        <button 
          onClick={() => handleChoice('2045')}
          disabled={showResult}
          className="group flex flex-col items-center justify-center py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowRight className="mb-2 text-fuchsia-400 group-hover:translate-x-1 transition-transform" />
          <span className="font-bold text-white">미래 (2045)</span>
          <span className="text-xs text-slate-500 mt-1">곧 다가옴</span>
        </button>
      </div>
      
      <p className="mt-6 text-slate-500 text-sm text-center">
        카드를 보고 시대를 예측하여 버튼을 누르세요.
      </p>
    </div>
  );
};

export default TimelineGameTab;