import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Check, X, HelpCircle, Trophy } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = QUIZ_DATA[currentQuestionIdx];

  const handleAnswer = (choice: boolean) => {
    if (isAnswered) return;
    
    setSelectedAnswer(choice);
    setIsAnswered(true);

    if (choice === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto p-8 text-center bg-white rounded-3xl shadow-lg border border-slate-100 animate-fade-in-up mt-10">
        <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
        <p className="text-slate-600 mb-8">
          당신의 점수는 <span className="font-bold text-indigo-600 text-xl">{score} / {QUIZ_DATA.length}</span> 입니다.
        </p>
        <button
          onClick={restartQuiz}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 min-h-[500px] flex flex-col justify-center animate-fade-in">
      <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-400">
        <span>Question {currentQuestionIdx + 1} / {QUIZ_DATA.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / QUIZ_DATA.length) * 100}%` }}
          />
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 mt-4 leading-snug">
          Q. {currentQuestion.question}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer(true)}
            disabled={isAnswered}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
              ${!isAnswered ? 'hover:bg-slate-50 border-slate-200' : ''}
              ${isAnswered && currentQuestion.answer === true ? 'bg-green-100 border-green-500 text-green-700' : ''}
              ${isAnswered && selectedAnswer === true && currentQuestion.answer === false ? 'bg-red-100 border-red-500 text-red-700' : ''}
              ${isAnswered && selectedAnswer !== true && currentQuestion.answer !== true ? 'opacity-50' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center text-2xl font-bold">O</div>
            <span className="font-medium">그렇다</span>
          </button>

          <button
            onClick={() => handleAnswer(false)}
            disabled={isAnswered}
            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
              ${!isAnswered ? 'hover:bg-slate-50 border-slate-200' : ''}
              ${isAnswered && currentQuestion.answer === false ? 'bg-green-100 border-green-500 text-green-700' : ''}
              ${isAnswered && selectedAnswer === false && currentQuestion.answer === true ? 'bg-red-100 border-red-500 text-red-700' : ''}
              ${isAnswered && selectedAnswer !== false && currentQuestion.answer !== false ? 'opacity-50' : ''}
            `}
          >
            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center text-2xl font-bold">X</div>
            <span className="font-medium">아니다</span>
          </button>
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-700 block mb-1">
                  정답: {currentQuestion.answer ? 'O' : 'X'}
                </span>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full mt-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              {currentQuestionIdx < QUIZ_DATA.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;