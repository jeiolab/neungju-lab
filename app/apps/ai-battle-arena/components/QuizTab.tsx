import React, { useState } from 'react';
import { INITIAL_QUIZZES } from '../constants';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizTabProps {
  onScoreUpdate: (xp: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuiz = INITIAL_QUIZZES[currentIndex];
  const isLast = currentIndex === INITIAL_QUIZZES.length - 1;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setShowExplanation(true);

    if (index === currentQuiz.correctIndex) {
      onScoreUpdate(50); // XP for correct quiz
    }
  };

  const nextQuestion = () => {
    if (isLast) return; // In a real app, maybe show a summary screen
    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 w-full pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">최종 보스 퀴즈</h2>
        <span className="text-slate-400 text-sm">문제 {currentIndex + 1} / {INITIAL_QUIZZES.length}</span>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 mb-6">
        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
          Q. {currentQuiz.question}
        </h3>

        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => {
            let itemClass = "w-full p-4 rounded-xl text-left transition-all border-2 ";
            
            if (isAnswered) {
              if (idx === currentQuiz.correctIndex) {
                itemClass += "bg-green-900/30 border-green-500 text-green-300";
              } else if (idx === selectedOption) {
                itemClass += "bg-red-900/30 border-red-500 text-red-300";
              } else {
                itemClass += "bg-slate-700/50 border-transparent text-slate-500";
              }
            } else {
              itemClass += "bg-slate-700 hover:bg-slate-600 border-transparent text-slate-200 hover:border-blue-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={itemClass}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {isAnswered && idx === currentQuiz.correctIndex && <Check className="w-5 h-5 text-green-500" />}
                  {isAnswered && idx === selectedOption && idx !== currentQuiz.correctIndex && <X className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold">
              <HelpCircle className="w-5 h-5" />
              해설
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentQuiz.explanation}
            </p>
          </div>

          <div className="flex justify-end">
             <button 
                onClick={nextQuestion}
                disabled={isLast}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${isLast ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
             >
               {isLast ? "퀴즈 완료" : "다음 문제"} <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTab;