import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_DATA[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === question.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-yellow-400" />
            문제 해결 퀴즈
          </h3>
          <span className="bg-slate-700 px-3 py-1 rounded-full text-sm font-mono">
            Q {currentQuestionIndex + 1} / {QUIZ_DATA.length}
          </span>
        </div>

        {/* Question Body */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option, idx) => {
              let btnClass = "p-4 rounded-xl border-2 text-left transition-all relative ";
              if (!isAnswered) {
                btnClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
              } else {
                if (idx === question.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-400 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-slate-100 text-slate-400 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="mr-3 inline-block w-6 h-6 rounded-full bg-white border border-current text-center leading-5 text-sm">
                    {idx + 1}
                  </span>
                  {option}
                  {isAnswered && idx === question.correctIndex && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 w-6 h-6" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== question.correctIndex && (
                    <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 w-6 h-6" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Area */}
          {isAnswered && (
            <div className="mt-8 animate-fade-in">
              <div className={`p-4 rounded-lg ${selectedOption === question.correctIndex ? 'bg-green-100 text-green-900' : 'bg-red-50 text-red-900'}`}>
                 <h4 className="font-bold mb-2">
                   {selectedOption === question.correctIndex ? "정답입니다! 🎉" : "아쉽네요. 다시 생각해볼까요?"}
                 </h4>
                 <p>{question.explanation}</p>
              </div>

              <div className="mt-6 text-right">
                 {currentQuestionIndex < QUIZ_DATA.length - 1 ? (
                   <button 
                     onClick={nextQuestion}
                     className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition-colors"
                   >
                     다음 문제 <ArrowRight className="w-5 h-5" />
                   </button>
                 ) : (
                   <div className="text-center p-4 bg-slate-100 rounded-lg">
                     <p className="text-lg font-bold text-slate-700">퀴즈 완료! 점수: {score} / {QUIZ_DATA.length}</p>
                   </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;
