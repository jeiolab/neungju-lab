import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_DATA[currentQIndex];

  const handleSelect = (option: string) => {
    if (selectedOption) return; // Prevent multiple clicks
    setSelectedOption(option);
    const correct = option === question.missingElement;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setShowResult(true);
    }
  };

  const restart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto text-center py-12 bg-white rounded-3xl shadow-xl border border-slate-100 mt-8">
         <h2 className="text-3xl font-bold text-slate-800 mb-6">퀴즈 종료!</h2>
         <div className="text-7xl font-black text-indigo-600 mb-6">{score} / {QUIZ_DATA.length}</div>
         <p className="text-slate-600 mb-10 text-lg">
           {score === QUIZ_DATA.length ? "완벽합니다! 당신은 최고의 에이전트 설계자입니다." : "수고하셨습니다! 이론 탭을 복습하면 더 잘할 수 있어요."}
         </p>
         <button onClick={restart} className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-colors text-lg shadow-lg">
            <RefreshCw size={22} /> 다시 풀기
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
       <div className="flex justify-between items-end mb-6 border-b border-slate-200 pb-4">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">문제 {currentQIndex + 1} / {QUIZ_DATA.length}</span>
          <span className="text-lg font-bold text-indigo-600">현재 점수: {score}</span>
       </div>

       <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
         <div className="p-8 md:p-10">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 leading-snug">{question.scenario}</h3>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-8">
                <p className="text-slate-700 font-medium font-mono">{question.agentDescription}</p>
            </div>
            
            <p className="text-indigo-600 font-bold mb-4 text-lg">위 설계에서 <strong>빠졌거나 잘못된 요소</strong>는 무엇인가요?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((opt) => {
                let btnClass = "bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-700";
                if (selectedOption === opt) {
                   if (opt === question.missingElement) btnClass = "bg-green-50 border-green-500 text-green-700";
                   else btnClass = "bg-red-50 border-red-500 text-red-700";
                } else if (selectedOption && opt === question.missingElement) {
                   btnClass = "bg-green-50 border-green-500 text-green-700";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={!!selectedOption}
                    className={`p-5 rounded-xl font-bold text-left transition-all text-lg ${btnClass}`}
                  >
                    <div className="flex justify-between items-center">
                        {opt}
                        {selectedOption === opt && (
                            opt === question.missingElement ? <CheckCircle size={24} /> : <XCircle size={24} />
                        )}
                    </div>
                  </button>
                )
              })}
            </div>
         </div>
         
         {selectedOption && (
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button onClick={handleNext} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors text-lg shadow-md">
                  {currentQIndex < QUIZ_DATA.length - 1 ? "다음 문제" : "결과 보기"} <ArrowRight size={20} />
               </button>
            </div>
         )}
       </div>
    </div>
  );
};

export default TabQuiz;