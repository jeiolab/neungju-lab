import React, { useState } from 'react';
import { QUIZ_DATA } from '../../constants';
import { CheckCircle, XCircle } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    setShowResult(true);
    if (selectedOption === QUIZ_DATA[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(p => p + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // End of quiz
      alert(`퀴즈 종료! 점수: ${score + (selectedOption === QUIZ_DATA[currentQuestion].correctAnswer ? 0 : 0)} / ${QUIZ_DATA.length}`);
      // Simple reset for demo
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowResult(false);
      setScore(0);
    }
  };

  const question = QUIZ_DATA[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-orange-600">퀴즈 {currentQuestion + 1} / {QUIZ_DATA.length}</h2>
        <span className="text-gray-400 text-sm">기계학습 마스터하기</span>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-8">{question.question}</h3>

      <div className="space-y-4 mb-8">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`w-full p-4 rounded-xl text-left border-2 transition-all flex justify-between items-center ${
              selectedOption === idx 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            } ${showResult && idx === question.correctAnswer ? 'bg-green-100 border-green-500' : ''}
              ${showResult && selectedOption === idx && idx !== question.correctAnswer ? 'bg-red-100 border-red-500' : ''}
            `}
          >
            <span className={`font-medium ${showResult && idx === question.correctAnswer ? 'text-green-800' : 'text-gray-700'}`}>
              {option}
            </span>
            {showResult && idx === question.correctAnswer && <CheckCircle className="text-green-600" />}
            {showResult && selectedOption === idx && idx !== question.correctAnswer && <XCircle className="text-red-600" />}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
          <strong>해설:</strong> {question.explanation}
        </div>
      )}

      <div className="flex justify-end">
        {!showResult ? (
          <button 
            onClick={checkAnswer}
            disabled={selectedOption === null}
            className="bg-orange-500 disabled:bg-gray-300 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            정답 확인
          </button>
        ) : (
          <button 
            onClick={nextQuestion}
            className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors"
          >
            {currentQuestion < QUIZ_DATA.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  );
};