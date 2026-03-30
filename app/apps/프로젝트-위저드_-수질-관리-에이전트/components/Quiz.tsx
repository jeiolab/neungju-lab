import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, RotateCcw } from 'lucide-react';

interface QuizProps {
  onScoreUpdate: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onScoreUpdate }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    const correct = idx === question.correctAnswer;
    if (correct) {
      setScore(s => s + 1);
    }
    setHistory(h => [...h, correct]);
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onScoreUpdate(score + (selectedOption === question.correctAnswer ? 0 : 0)); // Final score update
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setHistory([]);
  };

  if (showResults) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fadeIn">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-2xl font-bold mb-4">퀴즈 완료!</h2>
          <div className="text-6xl font-black text-blue-600 mb-2">{score} / {QUIZ_QUESTIONS.length}</div>
          <p className="text-slate-500 mb-6">
            {score >= 8 ? "훌륭합니다! 당신은 전문가입니다." : "수고했습니다! 개념 카드를 복습하고 다시 도전해보세요."}
          </p>
          
          <div className="flex justify-center gap-1 mb-6">
            {history.map((res, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${res ? 'bg-green-500' : 'bg-red-400'}`} />
            ))}
          </div>

          <button 
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            <RotateCcw className="w-4 h-4" /> 다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
       <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
         <span className="font-mono text-sm font-bold text-slate-500">문항 {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}</span>
         <span className="text-sm font-bold text-blue-600">점수: {score}</span>
       </div>

       <div className="p-6">
         <h3 className="text-lg font-bold text-slate-800 mb-6">{question.question}</h3>
         
         <div className="space-y-3">
           {question.options.map((opt, idx) => {
             let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all font-medium ";
             
             if (isAnswered) {
               if (idx === question.correctAnswer) {
                 btnClass += "bg-green-50 border-green-500 text-green-800";
               } else if (idx === selectedOption) {
                 btnClass += "bg-red-50 border-red-500 text-red-800";
               } else {
                 btnClass += "border-slate-100 text-slate-400 opacity-50";
               }
             } else {
               btnClass += "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700";
             }

             return (
               <button 
                 key={idx}
                 onClick={() => handleOptionClick(idx)}
                 disabled={isAnswered}
                 className={btnClass}
               >
                 <div className="flex justify-between items-center">
                   <span>{opt}</span>
                   {isAnswered && idx === question.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                   {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <X className="w-5 h-5 text-red-600" />}
                 </div>
               </button>
             );
           })}
         </div>

         {isAnswered && (
           <div className="mt-6 animate-fadeIn">
             <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
               <strong>해설:</strong> {question.explanation}
             </div>
             <button 
               onClick={handleNext}
               className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
             >
               {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "퀴즈 마치기" : "다음 문제"}
             </button>
           </div>
         )}
       </div>
    </div>
  );
};

export default Quiz;