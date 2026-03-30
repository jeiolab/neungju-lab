import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';

export const Quiz: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks
    setSelectedOption(index);
    setIsCorrect(index === QUIZ_DATA[currentQuiz].answer);
  };

  const nextQuiz = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuiz((prev) => (prev + 1) % QUIZ_DATA.length);
  };

  const quiz = QUIZ_DATA[currentQuiz];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">Quiz {currentQuiz + 1} / {QUIZ_DATA.length}</h2>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">객체 속성 추적하기</span>
        </div>
        
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
            Q. {quiz.question}
          </h3>

          <div className="space-y-3">
            {quiz.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-medium ";
                if (selectedOption === null) {
                    btnClass += "border-gray-200 hover:border-blue-600 hover:bg-blue-50 text-gray-600";
                } else if (idx === quiz.answer) {
                    btnClass += "border-green-500 bg-green-50 text-green-700";
                } else if (selectedOption === idx) {
                    btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                    btnClass += "border-gray-100 text-gray-400 opacity-50";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={selectedOption !== null}
                        className={btnClass}
                    >
                        <span className="mr-2 opacity-60">{idx + 1}.</span> {option}
                    </button>
                );
            })}
          </div>

          {selectedOption !== null && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} animate-fade-in-up`}>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{isCorrect ? '🎉' : '🤔'}</span>
                <p className="font-bold">{isCorrect ? '정답입니다!' : '다시 생각해보세요.'}</p>
              </div>
              <p className="text-sm leading-relaxed">{quiz.explanation}</p>
              
              <button 
                onClick={nextQuiz}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                다음 문제 &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};