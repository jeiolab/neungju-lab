import React, { useState } from 'react';
import { Check, X, RefreshCw, Award } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === question.correctIndex ? 0 : 0)); // Score is already updated
    }
  };

  const restart = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <Award className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-xl text-gray-600 mb-6">
          총 {QUIZ_QUESTIONS.length}문제 중 <span className="font-bold text-indigo-600">{score}</span>점을 맞췄습니다.
        </p>
        
        {score === QUIZ_QUESTIONS.length ? (
          <p className="text-green-600 font-medium mb-6">완벽해요! 당신은 k-NN 마스터입니다!</p>
        ) : (
          <p className="text-gray-500 mb-6">개념을 다시 복습하고 만점에 도전해보세요.</p>
        )}

        <button 
          onClick={restart}
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <RefreshCw size={20} /> 다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto border border-gray-200">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2">
        <div 
          className="bg-indigo-500 h-2 transition-all duration-300" 
          style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
            문제 {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
          <h3 className="text-xl font-bold text-gray-800 mt-2">{question.question}</h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all relative ";
            
            if (isAnswered) {
              if (idx === question.correctIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-gray-200 text-gray-400 opacity-50";
              }
            } else {
              btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && idx === question.correctIndex && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                )}
                {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                  <X className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600" size={20} />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
            <h4 className="font-bold text-gray-700 mb-1">해설:</h4>
            <p className="text-sm text-gray-600 break-keep">{question.explanation}</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={nextQuestion}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? '종료' : '다음 문제'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;