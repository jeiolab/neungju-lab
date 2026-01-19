import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';

const QuizSection: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === QUIZ_QUESTIONS.length - 1;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    setShowResult(true);
    if (selectedOption === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (!isLastQuestion) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (currentQuestionIdx >= QUIZ_QUESTIONS.length) {
    return <div>완료</div>; 
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">감별사 자격 시험</h2>
        <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
          {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="mb-6">
        <p className="text-lg font-medium text-slate-800 mb-4">{question.question}</p>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all
                ${selectedOption === idx 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-slate-200 hover:bg-slate-50'
                }
                ${showResult && idx === question.correctIndex ? 'border-green-500 bg-green-50' : ''}
                ${showResult && selectedOption === idx && idx !== question.correctIndex ? 'border-red-500 bg-red-50' : ''}
              `}
              disabled={showResult}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="bg-slate-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
          <p className="text-sm text-slate-700 font-medium">해설: {question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={selectedOption === null}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
          >
            정답 확인
          </button>
        ) : (
          isLastQuestion ? (
             <div className="text-center w-full">
               <p className="mb-2 font-bold text-lg">퀴즈 완료! 점수: {score + (selectedOption === question.correctIndex ? 0 : 0)}/{QUIZ_QUESTIONS.length}</p>
               <button onClick={resetQuiz} className="text-blue-600 hover:underline">다시 풀기</button>
             </div>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold"
            >
              다음 문제
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default QuizSection;