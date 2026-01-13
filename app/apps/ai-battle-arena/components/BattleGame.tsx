import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { CardData, LearningType } from '../types';
import { INITIAL_CARDS } from '../constants';
import { generateChallengeCard } from '../services/geminiService';
import { CheckCircle, XCircle, Timer, RotateCcw, Sparkles } from 'lucide-react';

interface BattleGameProps {
  onScoreUpdate: (xpEarned: number, score: number) => void;
}

const GAME_DURATION = 60; // seconds

const BattleGame: React.FC<BattleGameProps> = ({ onScoreUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<CardData[]>([...INITIAL_CARDS]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Motion values for drag effect
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const bg = useTransform(x, [-150, 0, 150], ["rgba(59, 130, 246, 0.2)", "rgba(15, 23, 42, 0)", "rgba(168, 85, 247, 0.2)"]);
  const cardBorderColor = useTransform(x, [-150, 0, 150], ["#3b82f6", "#334155", "#a855f7"]);

  const currentCard = cards[currentCardIndex];
  
  // Timer logic
  useEffect(() => {
    // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to support browser environments
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      onScoreUpdate(score * 10, score); // End game bonus
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, score, onScoreUpdate]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCurrentCardIndex(0);
    setCards([...INITIAL_CARDS].sort(() => Math.random() - 0.5));
    setIsPlaying(true);
    setFeedback(null);
  };

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!currentCard || !isPlaying) return;

    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleAnswer(LearningType.SUPERVISED);
    } else if (info.offset.x > threshold) {
      handleAnswer(LearningType.UNSUPERVISED);
    }
  };

  const handleAnswer = async (selectedType: LearningType) => {
    if (!currentCard) return;

    const isCorrect = currentCard.type === selectedType;
    
    if (isCorrect) {
      setScore(s => s + 100);
      setFeedback('CORRECT');
      onScoreUpdate(10, 0); // Immediate small XP
    } else {
      setTimeLeft(t => Math.max(0, t - 5)); // Penalty
      setFeedback('WRONG');
    }

    // Wait for animation then next card
    setTimeout(async () => {
      setFeedback(null);
      x.set(0);

      // If running low on cards, generate new ones via AI
      if (currentCardIndex >= cards.length - 2 && !loadingAi) {
        setLoadingAi(true);
        const newCard = await generateChallengeCard('MEDIUM');
        if (newCard) {
          setCards(prev => [...prev, newCard]);
        }
        setLoadingAi(false);
      }

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // No more cards but time remains? Loop or end? Just loop for now
        setCards(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentCardIndex(0);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 relative overflow-hidden">
      <motion.div style={{ backgroundColor: bg }} className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300" />
      
      {!isPlaying && timeLeft === GAME_DURATION && (
        <div className="z-10 text-center space-y-6 bg-slate-900/80 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm max-w-md w-full">
          <h2 className="text-4xl font-gaming text-white mb-2">READY?</h2>
          <p className="text-slate-400">
            카드를 왼쪽으로 끌면 <span className="text-blue-400 font-bold">지도학습</span>,<br/>
            오른쪽으로 끌면 <span className="text-purple-400 font-bold">비지도학습</span>입니다.
          </p>
          <button 
            onClick={startGame}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-xl hover:scale-105 transition-transform shadow-lg shadow-blue-900/50"
          >
            START BATTLE
          </button>
        </div>
      )}

      {!isPlaying && timeLeft === 0 && (
        <div className="z-10 text-center space-y-6 bg-slate-900/90 p-8 rounded-2xl border border-slate-700 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <h2 className="text-4xl font-gaming text-yellow-400">GAME OVER</h2>
          <div className="text-6xl font-bold text-white mb-4">{score}</div>
          <p className="text-slate-400">최종 점수 획득!</p>
          <button 
            onClick={startGame}
            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-5 h-5" /> 다시 도전하기
          </button>
        </div>
      )}

      {/* Game HUD */}
      <div className="absolute top-4 w-full max-w-2xl flex justify-between px-6 z-10">
        <div className="flex items-center gap-2 text-xl font-bold text-white bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600">
          <Timer className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
          {timeLeft}s
        </div>
        <div className="text-2xl font-gaming text-yellow-400 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600">
          {score}
        </div>
      </div>

      {/* Card Area */}
      {isPlaying && (
        <div className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center mt-12">
          {/* Directions Labels */}
          <div className="absolute left-[-80px] top-1/2 -translate-y-1/2 text-blue-500 font-bold text-lg opacity-50 hidden md:block rotate-[-90deg]">
            ◀ SUPERVISED
          </div>
          <div className="absolute right-[-80px] top-1/2 -translate-y-1/2 text-purple-500 font-bold text-lg opacity-50 hidden md:block rotate-[90deg]">
             UNSUPERVISED ▶
          </div>

          <AnimatePresence mode='wait'>
            {currentCard && (
              <motion.div
                key={currentCard.id}
                style={{ x, rotate, opacity, borderColor: cardBorderColor }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7} // Add resistance
                onDragEnd={handleDragEnd}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
                className="w-full h-80 md:h-96 bg-slate-800 rounded-2xl shadow-2xl border-4 flex flex-col items-center justify-center p-6 cursor-grab active:cursor-grabbing relative z-20"
              >
                <div className="absolute top-4 right-4 px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 border border-slate-700">
                  {currentCard.difficulty}
                </div>
                
                <p className="text-xl md:text-2xl font-bold text-center text-white leading-relaxed select-none">
                  {currentCard.text}
                </p>

                {feedback && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1.5, rotate: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 rounded-xl"
                  >
                    {feedback === 'CORRECT' ? (
                      <div className="text-green-400 flex flex-col items-center">
                        <CheckCircle className="w-20 h-20" />
                        <span className="font-gaming text-2xl mt-2">NICE!</span>
                      </div>
                    ) : (
                      <div className="text-red-500 flex flex-col items-center">
                        <XCircle className="w-20 h-20" />
                        <span className="font-gaming text-2xl mt-2">MISS!</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {loadingAi && (
            <div className="absolute bottom-[-40px] flex items-center gap-2 text-slate-400 text-sm animate-pulse">
              <Sparkles className="w-4 h-4" /> AI가 새로운 문제를 생성중입니다...
            </div>
          )}
        </div>
      )}
      
      {/* Mobile Touch Indicators */}
      {isPlaying && (
        <div className="flex justify-between w-full max-w-sm mt-8 px-4 md:hidden">
           <button onClick={() => handleAnswer(LearningType.SUPERVISED)} className="text-blue-400 border border-blue-400/30 bg-blue-900/20 px-4 py-2 rounded-lg text-sm">
             지도학습 (Tap)
           </button>
           <button onClick={() => handleAnswer(LearningType.UNSUPERVISED)} className="text-purple-400 border border-purple-400/30 bg-purple-900/20 px-4 py-2 rounded-lg text-sm">
             비지도학습 (Tap)
           </button>
        </div>
      )}
    </div>
  );
};

export default BattleGame;