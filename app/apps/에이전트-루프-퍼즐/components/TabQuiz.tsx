import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Check, X, HelpCircle } from 'lucide-react';

interface Props {
  onCorrect: () => void;
  onWrong: (tag: string) => void;
}

const TabQuiz: React.FC<Props> = ({ onCorrect, onWrong }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = QUIZ_DATA[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
      onCorrect();
    } else {
      question.tags.forEach(tag => onWrong(tag));
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-100 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">퀴즈 완료!</h2>
            <div className="text-6xl font-black text-indigo-600 mb-2">{score * 20}점</div>
            <p className="text-slate-500 mb-8">총 {QUIZ_DATA.length}문제 중 {score}문제를 맞혔습니다.</p>
            <button 
              onClick={() => {
                setCompleted(false);
                setCurrentQIndex(0);
                setSelectedOption(null);
                setIsRevealed(false);
                setScore(0);
              }}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
            >
              다시 도전하기
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 overflow-y-auto">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="text-sm font-bold text-slate-400">QUESTION {currentQIndex + 1}/{QUIZ_DATA.length}</span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
             난이도: 보통
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-100 mb-6 min-h-[200px] flex items-center">
           <h3 className="text-lg sm:text-xl font-bold leading-relaxed text-slate-800">
             {question.question}
           </h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let itemClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ";
            
            if (isRevealed) {
               if (idx === question.correctIndex) {
                 itemClass += "bg-emerald-50 border-emerald-400 text-emerald-800";
               } else if (idx === selectedOption) {
                 itemClass += "bg-red-50 border-red-400 text-red-800";
               } else {
                 itemClass += "bg-white border-slate-100 opacity-50";
               }
            } else {
               itemClass += "bg-white border-slate-100 hover:border-indigo-200 hover:bg-slate-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isRevealed}
                className={itemClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isRevealed && idx === question.correctIndex && <Check className="text-emerald-500" />}
                  {isRevealed && idx === selectedOption && idx !== question.correctIndex && <X className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {isRevealed && (
          <div className="mt-6 animate-fade-in-up">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 mb-4">
               <div className="flex items-center font-bold mb-1">
                 <HelpCircle className="w-4 h-4 mr-1"/> 해설
               </div>
               {question.explanation}
            </div>
            <button
              onClick={nextQuestion}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
            >
              다음 문제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;
