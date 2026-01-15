import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { HelpCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  onCorrect: (concept: string) => void;
  onWrong: (note: any) => void;
}

export const QuizTab: React.FC<Props> = ({ onCorrect, onWrong }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  const question = QUIZ_DATA[currentIndex];
  const isLast = currentIndex === QUIZ_DATA.length - 1;

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowResult(true);
    
    const isCorrect = selectedOption === question.answer;
    if (isCorrect) {
      onCorrect(question.concept);
    } else {
      onWrong({
        id: Date.now().toString(),
        question: question.question,
        userAnswer: selectedOption,
        correctAnswer: question.answer,
        explanation: question.explanation,
        timestamp: Date.now()
      });
    }
    setHistory([...history, currentIndex]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (!isLast) setCurrentIndex(prev => prev + 1);
  };

  if (history.length === QUIZ_DATA.length && showResult) {
     return (
        <div className="max-w-lg mx-auto text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold mb-4">🎉 퀴즈 완료!</h2>
             <p className="text-gray-600 mb-6">모든 문제를 풀었습니다. 오답노트에서 틀린 문제를 복습해보세요.</p>
             <button 
               onClick={() => { setHistory([]); setCurrentIndex(0); setShowResult(false); setSelectedOption(null); }}
               className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold"
             >
                다시 풀기
             </button>
        </div>
     )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
       <div className="mb-6 flex items-center justify-between">
         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : question.difficulty === 'normal' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {question.difficulty.toUpperCase()}
         </span>
         <span className="text-sm font-medium text-gray-500">{currentIndex + 1} / {QUIZ_DATA.length}</span>
       </div>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">{question.question}</h2>
          
          <div className="space-y-3">
             {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedOption(opt)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
                    ${showResult && opt === question.answer ? 'border-green-500 bg-green-50 text-green-700' : ''}
                    ${showResult && opt === selectedOption && opt !== question.answer ? 'border-red-500 bg-red-50 text-red-700' : ''}
                    ${!showResult && selectedOption === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:bg-gray-50'}
                  `}
                >
                   <span className="font-medium">{opt}</span>
                   {showResult && opt === question.answer && <CheckCircle2 size={20} />}
                   {showResult && opt === selectedOption && opt !== question.answer && <AlertTriangle size={20} />}
                </button>
             ))}
          </div>
       </div>

       {showResult && (
         <div className="bg-gray-900 text-white p-6 rounded-xl mb-6 animate-in slide-in-from-bottom-2">
            <h3 className="font-bold flex items-center gap-2 mb-2">
               <HelpCircle size={18} /> 해설
            </h3>
            <p className="text-gray-300 leading-relaxed">{question.explanation}</p>
         </div>
       )}

       <div className="flex justify-end">
          {!showResult ? (
             <button 
                onClick={handleSubmit} 
                disabled={!selectedOption}
                className="bg-indigo-600 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all"
            >
                채점하기
             </button>
          ) : (
             <button 
                onClick={handleNext}
                className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all"
             >
                {isLast ? "결과 보기" : "다음 문제"}
             </button>
          )}
       </div>
    </div>
  );
};