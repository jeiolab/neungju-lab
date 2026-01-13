import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="p-8 text-center bg-white m-4 rounded-xl shadow-lg">
        <h2 className="text-3xl font-black text-indigo-600 mb-4">퀴즈 종료!</h2>
        <p className="text-xl text-gray-700 mb-6">당신의 점수는?</p>
        <div className="text-6xl font-black text-gray-800 mb-8">
          {score} / {QUIZ_QUESTIONS.length}
        </div>
        <button onClick={restart} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-indigo-700">
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-indigo-500">Q{currentQIndex + 1}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{currentQ.difficulty === 'EASY' ? '쉬움' : '어려움'}</span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-8 leading-snug min-h-[60px]">
        {currentQ.question}
      </h3>

      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => {
          let bgClass = "bg-white border-gray-200 hover:border-indigo-300";
          let icon = null;

          if (showResult) {
            if (idx === currentQ.correctIndex) {
              bgClass = "bg-green-100 border-green-500 text-green-900";
              icon = <CheckCircle size={20} className="text-green-600"/>;
            } else if (idx === selectedOption) {
              bgClass = "bg-red-100 border-red-500 text-red-900";
              icon = <XCircle size={20} className="text-red-600"/>;
            } else {
                bgClass = "bg-gray-50 border-gray-200 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${bgClass}`}
            >
              <span className="font-medium">{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 animate-pop">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 mb-4">
            <span className="font-bold">해설:</span> {currentQ.explanation}
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold"
          >
            {currentQIndex < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
