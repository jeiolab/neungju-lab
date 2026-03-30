import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  onComplete: (xp: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.answer) {
      setScore(s => s + 1);
      onComplete(10); // 10 XP per correct answer
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">퀴즈 결과</h2>
          <div className="text-6xl font-black text-indigo-600 mb-2">{score} / {QUIZ_QUESTIONS.length}</div>
          <p className="text-slate-500 mb-8">
            {score === QUIZ_QUESTIONS.length ? "완벽합니다! LZ 전문가시네요." : "수고하셨습니다! 다시 도전해보세요."}
          </p>
          <button 
            onClick={handleRetry}
            className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>다시 풀기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm font-bold text-slate-400">
        <span>Question {currentIdx + 1}</span>
        <span>{QUIZ_QUESTIONS.length} Total</span>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let itemClass = "border-slate-200 hover:bg-slate-50";
            let icon = null;

            if (isAnswered) {
              if (idx === question.answer) {
                itemClass = "bg-green-100 border-green-500 text-green-800";
                icon = <Check className="w-5 h-5" />;
              } else if (idx === selectedOption) {
                itemClass = "bg-red-100 border-red-500 text-red-800";
                icon = <X className="w-5 h-5" />;
              } else {
                itemClass = "opacity-50 border-slate-200";
              }
            } else if (selectedOption === idx) {
              itemClass = "border-indigo-500 bg-indigo-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${itemClass}`}
              >
                <span>{opt}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl text-slate-700 animate-in fade-in slide-in-from-top-2">
            <p className="font-bold mb-1">💡 해설</p>
            <p className="text-sm leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          {currentIdx === QUIZ_QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
        </button>
      </div>
    </div>
  );
};

export default QuizSection;