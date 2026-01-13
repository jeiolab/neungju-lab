import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZZES[currentIndex];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === question.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < QUIZZES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-slate-200">
        <h2 className="text-2xl font-bold mb-4">🎉 퀴즈 완료!</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-4">{score} / {QUIZZES.length}</p>
        <p className="text-slate-600 mb-6">
          {score >= 8 ? "당신은 암호학 전문가입니다!" : "조금 더 공부해보세요!"}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      <div className="flex justify-between items-center text-sm font-bold text-slate-500">
        <span>Question {currentIndex + 1} / {QUIZZES.length}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let itemClass = "w-full p-4 text-left rounded-lg border border-slate-200 hover:bg-slate-50 transition font-medium flex justify-between items-center";
            
            if (showExplanation) {
               if (idx === question.correctIndex) itemClass = "w-full p-4 text-left rounded-lg border-2 border-emerald-500 bg-emerald-50 font-bold flex justify-between items-center";
               else if (idx === selectedOption) itemClass = "w-full p-4 text-left rounded-lg border-2 border-red-500 bg-red-50 flex justify-between items-center";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                disabled={showExplanation}
                className={itemClass}
              >
                {opt}
                {showExplanation && idx === question.correctIndex && <CheckCircle size={20} className="text-emerald-600" />}
                {showExplanation && idx === selectedOption && idx !== question.correctIndex && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 p-4 bg-slate-100 rounded-lg animate-fade-in">
             <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold">
                <HelpCircle size={18} /> 해설
             </div>
             <p className="text-slate-700 text-sm leading-relaxed">{question.explanation}</p>
             <button 
              onClick={nextQuestion}
              className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
             >
               {currentIndex < QUIZZES.length - 1 ? "다음 문제" : "결과 보기"}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;