import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score);
    }
  };

  const resetQuiz = () => {
      setCurrentIdx(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setScore(0);
      setShowResult(false);
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-2">{score * 10}점</div>
        <p className="text-slate-500 mb-8">총 {QUIZ_QUESTIONS.length}문제 중 {score}문제를 맞췄습니다!</p>
        <button 
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition"
        >
            <RotateCcw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-indigo-600">QUESTION {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="text-sm text-slate-400">현재 점수: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
             let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
             if (isAnswered) {
                if (idx === currentQ.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-800";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
                else btnClass += "border-slate-100 text-slate-400";
             } else {
                btnClass += "border-slate-100 hover:border-indigo-300 hover:bg-slate-50";
             }

             return (
               <button 
                key={idx} 
                onClick={() => handleAnswer(idx)}
                className={btnClass}
                disabled={isAnswered}
               >
                 <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctAnswer && <CheckCircle size={20} className="text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={20} className="text-red-600" />}
                 </div>
               </button>
             );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-slate-100 p-4 rounded-xl text-sm text-slate-700">
            <strong>해설:</strong> {currentQ.explanation}
          </div>
          <div className="flex justify-end">
            <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800"
            >
                다음 문제 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;