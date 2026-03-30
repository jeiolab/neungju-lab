import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { AlgorithmType, Scenario, MasteryStats } from '../types';
import { SCENARIOS } from '../constants';
import { RefreshCcw, ThumbsUp, AlertTriangle } from 'lucide-react';

interface TabSimulationProps {
  updateMastery: (type: AlgorithmType, isCorrect: boolean) => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ updateMastery }) => {
  const [cards, setCards] = useState<Scenario[]>([...SCENARIOS].sort(() => Math.random() - 0.5));
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Animation values for the top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-150, -100, 0, 100, 150], [0.5, 1, 1, 1, 0.5]);
  const background = useTransform(
    x,
    [-150, 0, 150],
    ['rgb(238, 242, 255)', 'rgb(255, 255, 255)', 'rgb(253, 242, 248)']
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeLeft > 0 && !isGameOver) {
      timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isGameOver]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentCard = cards[cards.length - 1];
    if (!currentCard) return;

    // Logic: Left = Classification, Right = Regression
    const isCorrect = 
      (direction === 'left' && currentCard.type === AlgorithmType.CLASSIFICATION) ||
      (direction === 'right' && currentCard.type === AlgorithmType.REGRESSION);

    updateMastery(currentCard.type, isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 10 + combo * 2);
      setCombo((prev) => prev + 1);
      setFeedback({ msg: "정답! 🎉", type: 'success' });
    } else {
      setCombo(0);
      setFeedback({ 
        msg: direction === 'left' 
             ? `틀렸어요! 이건 '${currentCard.type === AlgorithmType.REGRESSION ? '회귀' : '분류'}' 문제입니다.` 
             : `틀렸어요! 이건 '${currentCard.type === AlgorithmType.CLASSIFICATION ? '분류' : '회귀'}' 문제입니다.`,
        type: 'error' 
      });
    }

    // Remove card after a short delay to allow animation to complete conceptually
    // But for React state, we remove immediately and let Framer handle exit
    setTimeout(() => {
        setCards((prev) => prev.slice(0, prev.length - 1));
        setFeedback(null);
    }, 400); // Wait a bit for feedback to be visible
  };

  const onDragEnd = (info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else if (info.offset.x > threshold) {
      handleSwipe('right');
    }
  };

  const restartGame = () => {
    setCards([...SCENARIOS].sort(() => Math.random() - 0.5));
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setIsGameOver(false);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="text-xs text-gray-500">시간</div>
          <div className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-gray-800'}`}>
            {timeLeft}s
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">점수</div>
          <div className="text-xl font-bold text-indigo-600">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">콤보</div>
          <div className="text-xl font-bold text-orange-500">x{combo}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
        {isGameOver ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full animate-in zoom-in duration-300">
                <h3 className="text-2xl font-bold mb-4">게임 종료!</h3>
                <p className="text-gray-600 mb-6">최종 점수: <span className="text-indigo-600 font-bold text-3xl">{score}</span></p>
                <button 
                    onClick={restartGame}
                    className="flex items-center justify-center w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold"
                >
                    <RefreshCcw className="w-5 h-5 mr-2" /> 다시 도전하기
                </button>
            </div>
        ) : (
            <>
                {cards.length === 0 ? (
                     <div className="text-center text-gray-500">
                        <p>모든 문제를 풀었습니다!</p>
                        <p className="text-sm mt-2">시간이 남았다면 보너스 점수!</p>
                        <button onClick={restartGame} className="mt-4 text-indigo-600 underline">다시 섞기</button>
                     </div>
                ) : (
                    <div className="relative w-full h-[350px]">
                        <AnimatePresence>
                            {cards.map((card, index) => {
                                if (index === cards.length - 1) {
                                    return (
                                        <motion.div
                                            key={card.id}
                                            style={{ x, rotate, opacity, background }}
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            onDragEnd={(_, info) => onDragEnd(info)}
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                            className="absolute top-0 left-0 right-0 bottom-0 bg-white rounded-2xl shadow-xl flex flex-col justify-center items-center p-6 border border-gray-100 cursor-grab active:cursor-grabbing z-50"
                                        >
                                            <div className="text-sm text-gray-400 font-bold mb-4 uppercase tracking-widest">문제</div>
                                            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6 leading-relaxed">
                                                {card.question}
                                            </h3>
                                            <div className="text-sm text-gray-400 absolute bottom-6">
                                                ← 분류 (Discrete) &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 회귀 (Continuous) →
                                            </div>
                                            
                                            {/* Feedback Overlay */}
                                            {feedback && (
                                                <div className={`absolute inset-0 rounded-2xl flex items-center justify-center bg-opacity-90 z-50 ${feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    <div className="text-center p-4">
                                                        {feedback.type === 'success' ? <ThumbsUp className="w-16 h-16 text-green-600 mx-auto mb-2" /> : <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-2" />}
                                                        <p className={`font-bold text-lg ${feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{feedback.msg}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                }
                                // Render cards underneath for stack effect (simplified)
                                if (index === cards.length - 2) {
                                     return (
                                        <div
                                            key={card.id}
                                            className="absolute top-4 left-0 right-0 bottom-0 bg-gray-50 rounded-2xl shadow-md border border-gray-200 transform scale-95 -z-10"
                                        />
                                     )
                                }
                                return null;
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </>
        )}
      </div>

      {/* Controls */}
      {!isGameOver && cards.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button 
                onClick={() => handleSwipe('left')}
                className="flex-1 bg-white border-2 border-indigo-100 text-indigo-600 py-3 rounded-xl font-bold shadow-sm hover:bg-indigo-50 active:scale-95 transition"
            >
                ← 분류
            </button>
            <button 
                onClick={() => handleSwipe('right')}
                className="flex-1 bg-white border-2 border-pink-100 text-pink-600 py-3 rounded-xl font-bold shadow-sm hover:bg-pink-50 active:scale-95 transition"
            >
                회귀 →
            </button>
          </div>
      )}
    </div>
  );
};

export default TabSimulation;