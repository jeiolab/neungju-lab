import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === question.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(curr => curr + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm border border-slate-200 animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-blue-600 mb-6">
          {Math.round((score / QUIZ_QUESTIONS.length) * 100)}점
        </div>
        <p className="text-slate-600 mb-8 text-center">
          {score === QUIZ_QUESTIONS.length 
            ? "완벽합니다! 모델링 마스터시군요! 🎉" 
            : "조금 더 복습해보면 완벽해질 거예요! 💪"}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Question {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-bold ${
          question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
          question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            if (isAnswered) {
              if (idx === question.correctAnswer) buttonClass += "border-green-500 bg-green-50 text-green-900";
              else if (idx === selectedOption) buttonClass += "border-red-500 bg-red-50 text-red-900";
              else buttonClass += "border-slate-100 text-slate-400";
            } else {
              buttonClass += "border-slate-100 hover:border-blue-300 hover:bg-blue-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && idx === question.correctAnswer && <Check size={20} className="text-green-600"/>}
                  {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <X size={20} className="text-red-600"/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in-up">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6 flex gap-3">
            <HelpCircle className="text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-blue-800 mb-1">해설</h4>
              <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-900 transition"
            >
              다음 문제 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTab;