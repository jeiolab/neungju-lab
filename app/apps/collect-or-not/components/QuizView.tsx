import React, { useState } from 'react';
import { QUIZ_POOL } from '../data';
import { UserStats } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

export const QuizView: React.FC<{ stats: UserStats }> = ({ stats }) => {
  // Randomly select 3 questions or prioritize misconceptions
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // In a real app, this would be memoized or state-managed to persist session
  const [questions] = useState(() => {
     return [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === questions[currentQuestionIdx].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
      // Simple reload for now, ideally reshuffle state
      window.location.reload(); 
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">퀴즈 결과</h2>
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
           <div className="text-6xl font-black text-indigo-600 mb-2">{score * 20}점</div>
           <p className="text-gray-500">5문제 중 {score}문제 정답</p>
        </div>
        <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-indigo-600 font-bold p-4 bg-indigo-50 rounded-full">
            <RefreshCw size={20}/> 다시 풀기
        </button>
      </div>
    );
  }

  const question = questions[currentQuestionIdx];

  return (
    <div className="p-4 h-full overflow-y-auto pb-24 flex flex-col max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">맞춤 퀴즈</h2>
        <span className="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
            {currentQuestionIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <span className="text-xs font-bold text-gray-400 block mb-2">{question.relatedConcept}</span>
        <h3 className="text-lg font-bold text-gray-800 leading-snug">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let btnClass = "w-full p-4 rounded-xl text-left border-2 transition-all ";
          if (isAnswered) {
             if (idx === question.correctIndex) btnClass += "border-green-500 bg-green-50 text-green-800";
             else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
             else btnClass += "border-gray-200 text-gray-400";
          } else {
             btnClass += "border-gray-200 hover:border-indigo-300 active:bg-gray-50";
          }

          return (
            <button key={idx} onClick={() => handleOptionClick(idx)} className={btnClass} disabled={isAnswered}>
              <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {isAnswered && idx === question.correctIndex && <Check size={18} className="text-green-600"/>}
                  {isAnswered && idx === selectedOption && idx !== question.correctIndex && <X size={18} className="text-red-600"/>}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-6 animate-fade-in">
          <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 mb-4">
            <span className="font-bold block mb-1">해설:</span>
            {question.explanation}
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700"
          >
            다음 문제
          </button>
        </div>
      )}
    </div>
  );
};