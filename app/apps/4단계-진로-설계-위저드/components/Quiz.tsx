import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';

interface QuizProps {
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      onComplete(score + (selectedOption === currentQ.correctAnswer ? 0 : 0)); // Score already updated
    }
  };

  if (finished) {
    return (
      <div className="max-w-xl mx-auto text-center py-10 bg-white rounded-2xl shadow-xl border border-slate-100 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
        <p className="text-lg text-slate-600 mb-6">
          총 {QUIZ_QUESTIONS.length}문제 중 <span className="text-blue-600 font-bold">{score}</span>문제를 맞혔습니다.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex justify-between items-center text-sm text-slate-500 font-medium">
         <span>Question {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
         <span className={`px-2 py-0.5 rounded text-xs border ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700 border-green-200' : currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
           {currentQ.difficulty.toUpperCase()}
         </span>
       </div>

       <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100">
         <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQ.question}</h3>
         
         <div className="space-y-3">
           {currentQ.options.map((option, idx) => (
             <button
               key={idx}
               disabled={isAnswered}
               onClick={() => setSelectedOption(idx)}
               className={`w-full text-left p-4 rounded-xl border transition-all ${
                 isAnswered 
                   ? idx === currentQ.correctAnswer 
                     ? 'bg-green-100 border-green-500 text-green-900' 
                     : idx === selectedOption 
                       ? 'bg-red-100 border-red-500 text-red-900' 
                       : 'bg-slate-50 border-slate-200 text-slate-400'
                   : selectedOption === idx
                     ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-900'
                     : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
               }`}
             >
               <span className="inline-block w-6 font-bold">{String.fromCharCode(65 + idx)}.</span>
               {option}
             </button>
           ))}
         </div>

         {isAnswered && (
           <div className={`mt-6 p-4 rounded-lg ${selectedOption === currentQ.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
             <p className="font-bold mb-1">{selectedOption === currentQ.correctAnswer ? '정답입니다! 👏' : '아쉽네요. 😅'}</p>
             <p className="text-sm">{currentQ.explanation}</p>
           </div>
         )}

         <div className="mt-8 flex justify-end">
           {!isAnswered ? (
             <button 
               onClick={handleCheck}
               disabled={selectedOption === null}
               className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               정답 확인
             </button>
           ) : (
             <button 
               onClick={handleNext}
               className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
             >
               {currentQIndex < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
             </button>
           )}
         </div>
       </div>
    </div>
  );
};
