import React, { useState } from 'react';
import { INITIAL_QUIZZES } from '../constants';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const quiz = INITIAL_QUIZZES[currentQuiz];

  const handleSelect = (idx: number) => {
    if (isChecked) return;
    setSelectedAnswer(idx);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setIsChecked(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsChecked(false);
    if (currentQuiz < INITIAL_QUIZZES.length - 1) {
      setCurrentQuiz(prev => prev + 1);
    } else {
        // Reset or Finish (simple reset for now)
        setCurrentQuiz(0);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col h-full justify-center">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">확인 문제</h2>
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-mono">
            {currentQuiz + 1} / {INITIAL_QUIZZES.length}
          </span>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {quiz.question}
          </h3>

          <div className="space-y-3">
            {quiz.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ";
              
              if (isChecked) {
                if (idx === quiz.correctAnswer) {
                    btnClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                } else if (idx === selectedAnswer) {
                    btnClass += "border-red-400 bg-red-50 text-red-700";
                } else {
                    btnClass += "border-slate-100 text-slate-400 opacity-50";
                }
              } else {
                if (idx === selectedAnswer) {
                    btnClass += "border-blue-500 bg-blue-50 text-blue-700 shadow-md";
                } else {
                    btnClass += "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                  disabled={isChecked}
                >
                  <span>{option}</span>
                  {isChecked && idx === quiz.correctAnswer && <CheckCircle className="text-green-500" />}
                  {isChecked && idx === selectedAnswer && idx !== quiz.correctAnswer && <XCircle className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isChecked && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-blue-800 mb-1">해설</p>
                <p className="text-blue-700 text-sm">{quiz.explanation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          {!isChecked ? (
            <button
              onClick={handleCheck}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-lg font-bold shadow-md transition-all ${
                selectedAnswer !== null 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 shadow-md transition-all"
            >
              {currentQuiz < INITIAL_QUIZZES.length - 1 ? "다음 문제" : "처음으로"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};