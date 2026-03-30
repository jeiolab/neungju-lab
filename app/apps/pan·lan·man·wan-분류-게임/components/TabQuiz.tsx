import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, RefreshCw } from 'lucide-react';

interface TabQuizProps {
  onQuizComplete: (score: number) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ onQuizComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQIndex];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      onQuizComplete(Math.round(((score + (selectedOption === currentQuestion.correctAnswer ? 0 : 0)) / QUIZ_QUESTIONS.length) * 100));
    }
  };
  
  React.useEffect(() => {
    if (quizFinished) {
      onQuizComplete(Math.round((score / QUIZ_QUESTIONS.length) * 100));
    }
  }, [quizFinished, score, onQuizComplete]);

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8 bg-white p-10 rounded-3xl border border-slate-100 max-w-2xl mx-auto shadow-sm mt-10">
        <h2 className="text-3xl font-bold text-slate-800">퀴즈 완료!</h2>
        <div className="bg-indigo-50 p-10 rounded-full shadow-inner">
          <span className="text-6xl font-black text-indigo-600">{score}</span>
          <span className="text-2xl text-slate-400 font-medium"> / {QUIZ_QUESTIONS.length}</span>
        </div>
        <p className="text-slate-600 text-lg">
          네트워크 개념을 얼마나 이해했는지 확인해보세요.
        </p>
        <button 
          onClick={restartQuiz}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <RefreshCw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            확인 문제
        </h2>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
          {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed border-b border-slate-50 pb-6">
            Q. {currentQuestion.question}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all font-medium text-lg relative ";
            
            if (isSubmitted) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
              }
            } else {
              if (idx === selectedOption) {
                btnClass += "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-md";
              } else {
                btnClass += "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && setSelectedOption(idx)}
                disabled={isSubmitted}
                className={btnClass}
              >
                <div className="flex justify-between items-center pr-2">
                  <span>{option}</span>
                  {isSubmitted && idx === currentQuestion.correctAnswer && <Check size={24} className="text-green-600" />}
                  {isSubmitted && idx === selectedOption && idx !== currentQuestion.correctAnswer && <X size={24} className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isSubmitted && (
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 animate-fade-in flex gap-4 items-start">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
            <Check size={20} />
          </div>
          <div>
            <p className="text-sm text-blue-800 font-bold mb-1 uppercase tracking-wider">해설</p>
            <p className="text-base text-blue-900 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
            onClick={isSubmitted ? handleNext : handleSubmit}
            disabled={selectedOption === null}
            className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
            selectedOption === null 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
            }`}
        >
            {isSubmitted ? (currentQIndex === QUIZ_QUESTIONS.length - 1 ? '결과 보기' : '다음 문제') : '정답 확인'}
        </button>
      </div>
    </div>
  );
};

export default TabQuiz;