import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS } from '../constants';
import { Question, LearningType, Difficulty, UserStats } from '../types';
import { Timer, Star, Frown, CheckCircle, AlertTriangle } from 'lucide-react';

interface GameLoopProps {
  onGameEnd: (score: number, correctCount: number) => void;
  updateStats: (category: LearningType, isCorrect: boolean) => void;
  isQuizMode?: boolean; // Reusing for Quiz
}

const GAME_DURATION = 60;

const GameLoop: React.FC<GameLoopProps> = ({ onGameEnd, updateStats, isQuizMode = false }) => {
  const [timeLeft, setTimeLeft] = useState(isQuizMode ? 999 : GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; msg: string; explanation?: string } | null>(null);
  const [quizCount, setQuizCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Get a random question, possibly filtered by difficulty weights
  const getNextQuestion = useCallback(() => {
    // Simple random selection for now
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    setCurrentQ(QUESTIONS[randomIndex]);
  }, []);

  // Initial Start
  useEffect(() => {
    getNextQuestion();
  }, [getNextQuestion]);

  // Timer Logic
  useEffect(() => {
    if (isQuizMode) return; // No timer for quiz mode in this context, or handle separately

    if (timeLeft <= 0) {
      onGameEnd(score, correctCount);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onGameEnd, score, isQuizMode, correctCount]);

  const handleAnswer = (selectedType: LearningType) => {
    if (!currentQ) return;

    const isCorrect = selectedType === currentQ.type;
    updateStats(currentQ.type, isCorrect);

    if (isCorrect) {
      // Score calculation
      let points = 0;
      switch (currentQ.difficulty) {
        case Difficulty.EASY: points = 10; break;
        case Difficulty.NORMAL: points = 15; break;
        case Difficulty.HARD: points = 25; break;
      }
      
      // Combo Bonus
      const bonus = Math.min(combo * 5, 50); // Max 50 bonus
      setScore((prev) => prev + points + bonus);
      setCombo((prev) => prev + 1);
      setCorrectCount(prev => prev + 1);
      
      setFeedback({ type: 'correct', msg: '정답입니다!', explanation: `+${points + bonus}점!` });
    } else {
      setCombo(0);
      setFeedback({ 
        type: 'wrong', 
        msg: '오답입니다...', 
        explanation: `${currentQ.explanation} (정답: ${currentQ.type})`
      });
    }

    // Delay for feedback then next question
    setTimeout(() => {
      setFeedback(null);
      if (isQuizMode) {
        if (quizCount >= 9) { // 10 questions total
            onGameEnd(score, correctCount + (isCorrect ? 1 : 0));
        } else {
            setQuizCount(prev => prev + 1);
            getNextQuestion();
        }
      } else {
        getNextQuestion();
      }
    }, isCorrect ? 800 : 2500); // Longer delay for wrong answer to read explanation
  };

  if (!currentQ) return <div className="text-white text-center mt-20">로딩 중...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-md">
        <div className="flex items-center text-yellow-400">
          <Star className="w-6 h-6 mr-2 fill-current" />
          <span className="text-2xl font-bold">{score}</span>
        </div>
        
        {!isQuizMode && (
             <div className={`flex items-center text-2xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
             <Timer className="w-6 h-6 mr-2" />
             {timeLeft}s
           </div>
        )}
        {isQuizMode && (
             <div className="text-xl text-blue-300 font-bold">
                 문제 {quizCount + 1} / 10
             </div>
        )}

        <div className="text-sm font-medium text-gray-400">
           콤보: <span className="text-green-400 text-lg">{combo}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col justify-center mb-6 relative">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-600 shadow-2xl min-h-[200px] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Difficulty Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${
                currentQ.difficulty === Difficulty.HARD ? 'bg-red-900/50 text-red-300 border-red-700' :
                currentQ.difficulty === Difficulty.NORMAL ? 'bg-blue-900/50 text-blue-300 border-blue-700' :
                'bg-green-900/50 text-green-300 border-green-700'
            }`}>
                {currentQ.difficulty}
            </div>

            <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-100">
                {currentQ.text}
            </p>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
            <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-20 backdrop-blur-md bg-opacity-90 transition-all ${
                feedback.type === 'correct' ? 'bg-green-900/80' : 'bg-red-900/90'
            }`}>
                {feedback.type === 'correct' ? (
                    <CheckCircle className="w-16 h-16 text-green-300 mb-4 animate-bounce" />
                ) : (
                    <AlertTriangle className="w-16 h-16 text-red-300 mb-4 animate-pulse" />
                )}
                <h3 className="text-3xl font-bold text-white mb-2">{feedback.msg}</h3>
                <p className="text-lg text-white text-center px-6">{feedback.explanation}</p>
            </div>
        )}
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <button 
            onClick={() => handleAnswer(LearningType.SUPERVISED)}
            disabled={!!feedback}
            className="h-24 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl text-white font-bold text-lg shadow-lg border-b-4 border-indigo-800 transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
        >
            <span className="text-2xl mb-1">📘</span>
            지도학습
        </button>
        <button 
            onClick={() => handleAnswer(LearningType.UNSUPERVISED)}
            disabled={!!feedback}
            className="h-24 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-xl text-white font-bold text-lg shadow-lg border-b-4 border-purple-800 transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
        >
            <span className="text-2xl mb-1">🔮</span>
            비지도학습
        </button>
        <button 
            onClick={() => handleAnswer(LearningType.REINFORCEMENT)}
            disabled={!!feedback}
            className="h-24 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-xl text-white font-bold text-lg shadow-lg border-b-4 border-orange-800 transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
        >
            <span className="text-2xl mb-1">🥕</span>
            강화학습
        </button>
        <button 
            onClick={() => handleAnswer(LearningType.TRADITIONAL)}
            disabled={!!feedback}
            className="h-24 bg-slate-600 hover:bg-slate-500 active:bg-slate-700 rounded-xl text-white font-bold text-lg shadow-lg border-b-4 border-slate-800 transition-all active:translate-y-1 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
        >
             <span className="text-2xl mb-1">💻</span>
            전통적 코딩
        </button>
      </div>
    </div>
  );
};

export default GameLoop;