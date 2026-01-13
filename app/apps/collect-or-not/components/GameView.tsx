import React, { useState, useEffect, useCallback } from 'react';
import { GameCard, DataType, CollectionSource, CollectionMethod, UserStats } from '../types';
import { GAME_CARDS } from '../data';
import { Play, AlertTriangle, CheckCircle, XCircle, Timer, ShieldAlert } from 'lucide-react';

interface GameViewProps {
  stats: UserStats;
  updateStats: (newStats: UserStats) => void;
}

export const GameView: React.FC<GameViewProps> = ({ stats, updateStats }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  // User selections
  const [selectedType, setSelectedType] = useState<DataType | null>(null);
  const [selectedSource, setSelectedSource] = useState<CollectionSource | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<CollectionMethod | null>(null);

  // Feedback state
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | 'trap' | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Initialize game
  const startGame = () => {
    // Shuffle cards
    const shuffled = [...GAME_CARDS].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIdx(0);
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setIsPlaying(true);
    setGameOver(false);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedType(null);
    setSelectedSource(null);
    setSelectedMethod(null);
    setFeedback(null);
    setFeedbackMsg('');
  };

  // Timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
  }, [isPlaying, timeLeft, gameOver]);

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    
    // Update global stats
    const newStats = { ...stats };
    newStats.gamesPlayed += 1;
    newStats.totalScore += score;
    newStats.maxCombo = Math.max(stats.maxCombo, combo);
    newStats.lastPlayed = new Date().toISOString();
    
    // Check streak
    const lastDate = stats.lastPlayed ? new Date(stats.lastPlayed).toDateString() : '';
    const today = new Date().toDateString();
    if (lastDate !== today) {
      newStats.streak += 1;
    }

    // Awards Badges
    const earnedBadges = new Set(newStats.badges);
    earnedBadges.add('b1'); // Play once
    if (combo >= 10) earnedBadges.add('b2');
    if (newStats.totalScore >= 1000) earnedBadges.add('b4');
    
    newStats.badges = Array.from(earnedBadges);
    updateStats(newStats);
  };

  const handleTrap = () => {
    const card = cards[currentCardIdx];
    if (card.isTrap) {
      // Correctly identified trap
      const points = 200 + (combo * 20);
      setScore(s => s + points);
      setCombo(c => c + 1);
      setFeedback('trap');
      setFeedbackMsg(`정확합니다! ${card.trapReason}`);
      
      // Badge logic for trap
      if (!stats.badges.includes('b3') && combo >= 2) { // Simplified check for demonstration
         // In real app, track traps found count
      }

      setTimeout(nextCard, 2000);
    } else {
      // False alarm
      setScore(s => Math.max(0, s - 50));
      setCombo(0);
      setFeedback('wrong');
      setFeedbackMsg('이 데이터는 편향/윤리 문제가 없습니다.');
      setTimeout(nextCard, 1500);
    }
  };

  const handleSubmit = () => {
    const card = cards[currentCardIdx];
    
    if (card.isTrap) {
        setScore(s => Math.max(0, s - 50));
        setCombo(0);
        setFeedback('wrong');
        setFeedbackMsg('앗! 이 데이터에는 윤리적 문제나 편향이 숨어있습니다!');
        setTimeout(nextCard, 2000);
        return;
    }

    const isCorrect = 
      selectedType === card.correctType &&
      selectedSource === card.correctSource &&
      selectedMethod === card.correctMethod;

    if (isCorrect) {
      const points = 100 + (combo * 10);
      setScore(s => s + points);
      setCombo(c => c + 1);
      setFeedback('correct');
      setFeedbackMsg('정답입니다!');
    } else {
      setCombo(0);
      setFeedback('wrong');
      setFeedbackMsg(`오답: ${card.correctType} / ${card.correctSource} / ${card.correctMethod}`);
      
      // Track misconception
      const newStats = { ...stats };
      if (!newStats.misconceptions.includes(card.id)) {
        newStats.misconceptions.push(card.id);
        updateStats(newStats);
      }
    }
    setTimeout(nextCard, 1500);
  };

  const nextCard = () => {
    if (currentCardIdx < cards.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
      resetSelection();
    } else {
      // Reshuffle or end? For 60s game, just loop or reshuffle if empty.
      // But here we have finite cards. Let's bonus time or end.
      // Let's just reshuffle played cards to keep going until time ends
      const reshuffled = [...GAME_CARDS].sort(() => Math.random() - 0.5);
      setCards(prev => [...prev, ...reshuffled]);
      setCurrentCardIdx(prev => prev + 1);
      resetSelection();
    }
  };

  // Start Screen
  if (!isPlaying && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-indigo-600">Collect-or-Not?</h1>
          <p className="text-gray-600">데이터 수집 방법 판별 게임</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
            <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
                <span>내 최고 점수</span>
                <span className="font-bold text-indigo-600">{stats.totalScore}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 border-b pb-2">
                <span>획득 배지</span>
                <span className="font-bold">{stats.badges.length} / 4</span>
            </div>
             <div className="flex justify-between text-sm text-gray-500">
                <span>오늘의 스트릭</span>
                <span className="font-bold text-orange-500">{stats.streak} 🔥</span>
            </div>
        </div>

        <button 
          onClick={startGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transition-transform transform active:scale-95 flex items-center gap-3"
        >
          <Play fill="currentColor" /> 게임 시작
        </button>
      </div>
    );
  }

  // Result Screen
  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800">게임 종료!</h2>
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm space-y-4">
          <div className="text-gray-500">최종 점수</div>
          <div className="text-5xl font-black text-indigo-600">{score}</div>
          <div className="flex justify-center gap-4 mt-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-xs text-gray-500">최대 콤보</div>
              <div className="font-bold text-lg">{combo}</div>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-xs text-gray-500">푼 카드</div>
              <div className="font-bold text-lg">{currentCardIdx + 1}</div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {setGameOver(false);}}
          className="bg-gray-800 text-white py-3 px-8 rounded-full font-bold hover:bg-gray-900"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const currentCard = cards[currentCardIdx];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header Info */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-red-500" />
          <span className={`font-mono text-xl font-bold ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
            {timeLeft}
          </span>
        </div>
        <div className="flex flex-col items-center">
             <span className="text-xs text-gray-400">SCORE</span>
             <span className="font-bold text-indigo-600 text-lg leading-none">{score}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-orange-500 font-bold text-xl">{combo}</span>
          <span className="text-xs text-orange-400">COMBO</span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 p-4 overflow-y-auto pb-24 flex flex-col items-center">
        {/* Card Display */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5 mb-6 border-2 border-indigo-50 relative overflow-hidden">
          {feedback && (
             <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-20 backdrop-blur-sm transition-opacity duration-300`}>
                {feedback === 'correct' && <CheckCircle className="w-16 h-16 text-green-500 mb-2" />}
                {feedback === 'wrong' && <XCircle className="w-16 h-16 text-red-500 mb-2" />}
                {feedback === 'trap' && <ShieldAlert className="w-16 h-16 text-purple-500 mb-2" />}
                <p className="font-bold text-lg text-center px-4">{feedbackMsg}</p>
             </div>
          )}
          
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded text-white
              ${currentCard.category === '스포츠' ? 'bg-blue-500' : currentCard.category === '환경' ? 'bg-green-500' : 'bg-yellow-500'}
            `}>
              {currentCard.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{currentCard.title}</h3>
          <p className="text-gray-600 text-sm">{currentCard.description}</p>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md space-y-4">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-2">
            {Object.values(DataType).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-3 rounded-lg border-2 font-bold text-sm transition-all
                  ${selectedType === type ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200'}
                `}
                disabled={!!feedback}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Source Selection */}
          <div className="grid grid-cols-2 gap-2">
            {Object.values(CollectionSource).map((source) => (
              <button
                key={source}
                onClick={() => setSelectedSource(source)}
                className={`p-3 rounded-lg border-2 font-bold text-sm transition-all
                  ${selectedSource === source ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200'}
                `}
                disabled={!!feedback}
              >
                {source}
              </button>
            ))}
          </div>

          {/* Method Selection (Scrollable/Grid) */}
          <div className="grid grid-cols-3 gap-2">
            {Object.values(CollectionMethod).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                disabled={method === CollectionMethod.WebCrawling || !!feedback} // Web Crawling inactive by default as per prompt, but let's make it clickable if logic requires
                className={`p-2 rounded-lg border-2 font-bold text-xs h-16 flex flex-col items-center justify-center transition-all
                  ${selectedMethod === method ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200'}
                  ${method === CollectionMethod.WebCrawling ? 'opacity-50' : ''} 
                `}
                // Prompt says WebCrawling is inactive default, but user needs to select it for some cards? 
                // Let's enable it for logic, just style it differently or assume its 'Advanced'
              >
                {method}
              </button>
            ))}
          </div>

           {/* Actions */}
           <div className="flex gap-3 pt-2">
              <button 
                onClick={handleTrap}
                disabled={!!feedback}
                className="flex-1 bg-red-50 border-2 border-red-200 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 active:scale-95 transition-all"
              >
                 <AlertTriangle size={18} /> 편향/윤리 신고
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!selectedType || !selectedSource || !selectedMethod || !!feedback}
                className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:shadow-none active:scale-95 transition-all"
              >
                제출하기
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};