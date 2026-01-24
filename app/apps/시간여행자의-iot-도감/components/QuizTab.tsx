import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestionIdx((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          <HelpCircle className="mr-2 text-purple-600" /> 심화 퀴즈
        </h2>
        <span className="text-slate-500 text-sm font-medium">
          {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6 flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
          Q. {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let buttonStyle = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700";
            
            if (showExplanation) {
              if (idx === question.correctIndex) {
                buttonStyle = "bg-green-50 border-green-300 text-green-900 ring-2 ring-green-400";
              } else if (idx === selectedOption) {
                buttonStyle = "bg-red-50 border-red-300 text-red-900 opacity-80";
              } else {
                buttonStyle = "bg-white border-slate-100 text-slate-400";
              }
            } else if (selectedOption === idx) {
              buttonStyle = "bg-cyan-50 border-cyan-300 text-cyan-900 ring-1 ring-cyan-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${buttonStyle} font-medium`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && idx === question.correctIndex && <Check size={20} className="text-green-600" />}
                  {showExplanation && idx === selectedOption && idx !== question.correctIndex && <X size={20} className="text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="bg-white/90 p-5 rounded-xl border border-purple-200 shadow-sm animate-slide-up">
          <h4 className="font-bold text-purple-600 mb-2">해설</h4>
          <p className="text-slate-700 text-sm mb-4 leading-relaxed">{question.explanation}</p>
          <button
            onClick={nextQuestion}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-white flex items-center justify-center transition-colors shadow-md"
          >
            다음 문제 <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;