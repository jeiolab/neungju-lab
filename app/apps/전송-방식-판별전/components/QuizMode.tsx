import React, { useState } from 'react';
import { INITIAL_QUIZ } from '../constants';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const QuizMode: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = INITIAL_QUIZ[currentIdx];
  const isFinished = currentIdx >= INITIAL_QUIZ.length;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);
    if (idx === question.answer) {
        setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentIdx(prev => prev + 1);
  };

  const resetQuiz = () => {
      setCurrentIdx(0);
      setScore(0);
      setSelectedOption(null);
      setShowResult(false);
  };

  if (isFinished) {
      return (
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 max-w-md mx-auto mt-10">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">퀴즈 완료!</h2>
              <div className="text-6xl font-black text-indigo-600 mb-2">{score * 20}점</div>
              <p className="text-slate-500 mb-8">{INITIAL_QUIZ.length}문제 중 {score}문제를 맞혔습니다.</p>
              <button 
                onClick={resetQuiz}
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
              >
                  <RotateCcw className="w-4 h-4 mr-2" /> 다시 풀기
              </button>
          </div>
      )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-indigo-600">QUIZ {currentIdx + 1}/{INITIAL_QUIZ.length}</span>
        <span className="text-sm text-slate-400">점수: {score}</span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-8 leading-snug">{question.question}</h3>

      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
            let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all ";
            
            if (showResult) {
                if (idx === question.answer) btnClass += "border-green-500 bg-green-50 text-green-800 font-bold";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
                else btnClass += "border-slate-100 text-slate-400 opacity-50";
            } else {
                btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer";
            }

            return (
                <button 
                    key={idx} 
                    onClick={() => handleSelect(idx)}
                    disabled={showResult}
                    className={btnClass}
                >
                    <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {showResult && idx === question.answer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                        {showResult && idx === selectedOption && idx !== question.answer && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                </button>
            )
        })}
      </div>

      {showResult && (
        <div className="animate-fade-in">
            <div className="bg-slate-50 p-4 rounded-lg mb-6 text-sm text-slate-700">
                <span className="font-bold mr-2">해설:</span>
                {question.explanation}
            </div>
            <div className="flex justify-end">
                <button 
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium flex items-center"
                >
                    다음 문제 <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default QuizMode;
