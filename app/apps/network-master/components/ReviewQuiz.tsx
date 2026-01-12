import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { ArrowRight, Trophy } from 'lucide-react';

interface ReviewQuizProps {
  onComplete: (score: number) => void;
}

export const ReviewQuiz: React.FC<ReviewQuizProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZZES[currentQIndex];
  const isLast = currentQIndex === QUIZZES.length - 1;

  const handleSelect = (idx: number) => {
    if (isConfirmed) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (selectedOption === question.answerIndex) {
      setScore(prev => prev + 25);
    }
  };

  const handleNext = () => {
    if (isLast) {
      // Add the final question score if correct
      onComplete(score);
    } else {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-xl font-bold text-slate-900">최종 확인 퀴즈</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="mb-4">
          <span className="text-blue-600 font-bold text-sm tracking-wider">Q{currentQIndex + 1}.</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{question.question}</h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let baseStyle = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium text-sm ";
            
            if (isConfirmed) {
              if (idx === question.answerIndex) {
                baseStyle += "bg-green-50 border-green-500 text-green-800";
              } else if (idx === selectedOption && idx !== question.answerIndex) {
                baseStyle += "bg-red-50 border-red-500 text-red-800 opacity-75";
              } else {
                baseStyle += "border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              if (selectedOption === idx) {
                baseStyle += "border-blue-500 bg-blue-50 text-blue-900";
              } else {
                baseStyle += "border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isConfirmed}
                className={baseStyle}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Action Area */}
      <div className="h-24">
        {!isConfirmed && (
          <button
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${
              selectedOption === null 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            정답 확인하기
          </button>
        )}

        {isConfirmed && (
          <div className="animate-fade-in">
             <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs text-slate-600">
               <span className="font-bold">해설:</span> {question.explanation}
             </div>
             <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2"
            >
              {isLast ? "결과 보기" : "다음 문제"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};