import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { Check, X, RotateCw } from 'lucide-react';
import { UserState } from '../types';
import { awardXP } from '../services/storageService';

interface Props {
  userState: UserState;
  onUpdateUser: (newState: UserState) => void;
}

export const QuizSection: React.FC<Props> = ({ userState, onUpdateUser }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuiz = QUIZZES[currentQuizIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuiz.correctAnswer;
    if (isCorrect) {
      const newState = awardXP(15, userState);
      onUpdateUser(newState);
    }
  };

  const nextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentQuizIndex((prev) => (prev + 1) % QUIZZES.length);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">🎯 핵심 개념 퀴즈</h2>
        <span className="text-sm font-medium text-slate-500">
          문제 {currentQuizIndex + 1} / {QUIZZES.length}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">
          Q. {currentQuiz.question}
        </h3>
        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isAnswered
                  ? idx === currentQuiz.correctAnswer
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : idx === selectedOption
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'bg-slate-50 border-slate-200 opacity-50'
                  : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && idx === currentQuiz.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQuiz.correctAnswer && <X className="w-5 h-5 text-red-600" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {isAnswered && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4 animate-fadeIn">
          <p className="font-bold text-slate-700 mb-1">해설:</p>
          <p className="text-sm text-slate-600">{currentQuiz.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button
          onClick={nextQuiz}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          다음 문제 <RotateCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};