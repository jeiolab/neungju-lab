import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Check, X, HelpCircle } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  const currentQuiz = QUIZ_DATA[currentQuizIndex];

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    if (answer === currentQuiz.answer) {
      setScore(score + 1);
    }
    
    // Auto advance after delay
    setTimeout(() => {
      if (currentQuizIndex < QUIZ_DATA.length - 1) {
        setCurrentQuizIndex(currentQuizIndex + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuizIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fadeIn bg-slate-800/50 rounded-2xl border border-slate-700">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-3xl font-bold text-white mb-2">퀴즈 결과</h2>
        <p className="text-slate-300 mb-6">총 {QUIZ_DATA.length}문제 중 <span className="text-cyan-400 font-bold text-xl">{score}</span>문제를 맞혔습니다!</p>
        <button 
          onClick={restartQuiz}
          className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-bold transition-colors"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fadeIn">
      <div className="flex justify-between items-center mb-6 px-4">
        <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
          <HelpCircle /> 개념 확인 퀴즈
        </h2>
        <span className="text-slate-400">문제 {currentQuizIndex + 1} / {QUIZ_DATA.length}</span>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-12 leading-relaxed">
            {currentQuiz.question}
          </h3>

          {selectedAnswer === null ? (
            <div className="flex justify-center gap-8">
              <button
                onClick={() => handleAnswer(true)}
                className="w-24 h-24 rounded-full border-4 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-110"
              >
                O
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="w-24 h-24 rounded-full border-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-white flex items-center justify-center text-4xl font-bold transition-all transform hover:scale-110"
              >
                X
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className={`text-6xl mb-4 flex justify-center ${selectedAnswer === currentQuiz.answer ? 'text-green-400' : 'text-red-400'}`}>
                {selectedAnswer === currentQuiz.answer ? <Check className="w-20 h-20" /> : <X className="w-20 h-20" />}
              </div>
              <p className={`text-xl font-bold mb-2 ${selectedAnswer === currentQuiz.answer ? 'text-green-300' : 'text-red-300'}`}>
                {selectedAnswer === currentQuiz.answer ? '정답입니다!' : '오답입니다.'}
              </p>
              <p className="text-slate-300 bg-black/30 p-4 rounded-xl inline-block">
                {currentQuiz.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
