import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-slate-900">{score}</span>
            <span className="text-slate-500 text-lg">/{QUIZ_QUESTIONS.length}</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">퀴즈 완료!</h2>
        <p className="text-slate-600 max-w-md">
            {score === QUIZ_QUESTIONS.length 
                ? "완벽합니다! 알고리즘 마스터시군요. 🏆" 
                : score >= 3 
                ? "잘하셨어요! 조금만 더 공부하면 완벽해질 거예요." 
                : "힘내세요! 이론 탭에서 복습하고 다시 도전해보세요."}
        </p>
        <button 
            onClick={resetQuiz}
            className="flex items-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
        >
            <RotateCcw className="w-5 h-5 mr-2" />
            다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-600 font-mono text-sm">
            Question {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-indigo-600 font-bold text-sm">Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>

        <h3 className="text-xl font-bold text-slate-900 mb-8 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all text-slate-700";
            
            if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                    btnClass = "w-full text-left p-4 rounded-xl border border-green-500 bg-green-50 text-green-700";
                } else if (idx === selectedOption) {
                    btnClass = "w-full text-left p-4 rounded-xl border border-red-500 bg-red-50 text-red-700";
                } else {
                    btnClass = "w-full text-left p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 opacity-50";
                }
            } else if (selectedOption === idx) {
                btnClass = "w-full text-left p-4 rounded-xl border border-indigo-500 bg-indigo-600 text-white";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in-up">
            <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-200">
                <p className="text-sm text-indigo-700">
                    <span className="font-bold mr-2">해설:</span>
                    {currentQuestion.explanation}
                </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
            >
              {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? '결과 보기' : '다음 문제'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
