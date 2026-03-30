import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { Check, X, RefreshCw } from 'lucide-react';

interface QuizTabProps {
  onQuizComplete: (quizId: number) => void;
  completedQuizzes: number[];
}

const QuizTab: React.FC<QuizTabProps> = ({ onQuizComplete, completedQuizzes }) => {
  const [activeQuizId, setActiveQuizId] = useState<number>(QUIZZES[0].id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentQuiz = QUIZZES.find(q => q.id === activeQuizId);
  const isCorrect = currentQuiz && selectedOption === currentQuiz.correctAnswer;
  const isCompleted = completedQuizzes.includes(activeQuizId);

  const handleOptionSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    if (currentQuiz && selectedOption === currentQuiz.correctAnswer) {
      onQuizComplete(currentQuiz.id);
    }
  };

  const nextQuiz = () => {
    const currentIndex = QUIZZES.findIndex(q => q.id === activeQuizId);
    if (currentIndex < QUIZZES.length - 1) {
      setActiveQuizId(QUIZZES[currentIndex + 1].id);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  if (!currentQuiz) return <div>모든 퀴즈 완료!</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fadeIn">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">지식 체크 퀴즈</h2>
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          문제 {QUIZZES.findIndex(q => q.id === activeQuizId) + 1} / {QUIZZES.length}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium mb-6 text-gray-900 leading-relaxed">
          {currentQuiz.question}
        </h3>

        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition duration-200 ";
            
            if (showResult) {
              if (idx === currentQuiz.correctAnswer) {
                btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-100 border-red-500 text-red-800";
              } else {
                btnClass += "bg-gray-50 border-gray-200 text-gray-400";
              }
            } else {
              if (idx === selectedOption) {
                btnClass += "bg-indigo-50 border-indigo-500 text-indigo-900";
              } else {
                btnClass += "bg-white border-gray-200 hover:bg-gray-50 text-gray-700";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={btnClass}
                disabled={showResult}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </div>
              </button>
            );
          })}
        </div>

        {!showResult ? (
          <button
            onClick={checkAnswer}
            disabled={selectedOption === null}
            className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition
              ${selectedOption !== null ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}
            `}
          >
            정답 확인
          </button>
        ) : (
          <div className="mt-6 space-y-4 animate-fadeIn">
            <div className={`p-4 rounded-lg flex items-start ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="mr-3 mt-1">
                {isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
              </div>
              <div>
                <p className={`font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? '정답입니다!' : '오답입니다.'}
                </p>
                <p className="text-gray-700 text-sm">{currentQuiz.explanation}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => { setShowResult(false); setSelectedOption(null); }}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> 다시 풀기
              </button>
              {QUIZZES.findIndex(q => q.id === activeQuizId) < QUIZZES.length - 1 && (
                <button
                  onClick={nextQuiz}
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
                >
                  다음 문제 →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
