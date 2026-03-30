import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const Quiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentQIndex];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === question.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(p => p + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">
          {score * (100 / QUIZ_QUESTIONS.length)}<span className="text-2xl text-slate-400">점</span>
        </div>
        <p className="text-slate-600 mb-8">
          {score === QUIZ_QUESTIONS.length 
            ? "완벽해요! 마이데이터 전문가가 되셨군요." 
            : "조금 더 공부해보면 완벽해질 거예요!"}
        </p>
        <button 
          onClick={resetQuiz}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="mr-2" size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-4 flex justify-between text-sm text-slate-500 font-medium">
        <span>Question {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        <span>현재 점수: {score}</span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              if (isSubmitted) {
                if (idx === question.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-800";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
                else btnClass += "border-slate-100 text-slate-400";
              } else {
                if (idx === selectedOption) btnClass += "border-indigo-500 bg-indigo-50 text-indigo-800";
                else btnClass += "border-slate-100 hover:border-slate-300 hover:bg-slate-50";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isSubmitted}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isSubmitted && idx === question.correctAnswer && <CheckCircle size={20} className="text-green-600"/>}
                    {isSubmitted && idx === selectedOption && idx !== question.correctAnswer && <XCircle size={20} className="text-red-600"/>}
                  </div>
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
              <div className="font-bold text-slate-700 mb-1 flex items-center">
                <span className="text-indigo-600 mr-2">#</span>해설
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{question.explanation}</p>
              <div className="mt-2 text-xs font-semibold text-slate-400">관련 개념: {question.relatedConcept}</div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-colors ${selectedOption === null ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {currentQIndex < QUIZ_QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;