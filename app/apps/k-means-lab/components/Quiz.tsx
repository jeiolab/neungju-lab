import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';

interface QuizProps {
  onCorrectAnswer: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onCorrectAnswer }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === QUIZ_DATA[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      onCorrectAnswer();
    }
    setShowResult(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz Finished state could be handled here
      setCurrentQuestion(0); // Reset for demo purposes
      setScore(0);
    }
  };

  const question = QUIZ_DATA[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-6">
          <div className="flex justify-between items-center text-indigo-100">
            <span className="font-bold tracking-wider text-xs uppercase">Daily Challenge</span>
            <span>{currentQuestion + 1} / {QUIZ_DATA.length}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">
            지식을 테스트해보세요!
          </h2>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            Q. {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              
              if (showResult) {
                if (idx === question.correctAnswer) {
                  btnClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                   btnClass += "border-slate-100 text-slate-400 opacity-50";
                }
              } else {
                if (idx === selectedOption) {
                  btnClass += "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold shadow-md";
                } else {
                  btnClass += "border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                  disabled={showResult}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold
                      ${showResult && idx === question.correctAnswer ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 animate-fade-in">
              <p className={`font-bold mb-1 ${selectedOption === question.correctAnswer ? 'text-green-600' : 'text-red-500'}`}>
                {selectedOption === question.correctAnswer ? '정답입니다! +20 EXP' : '아쉽네요, 다시 생각해보세요.'}
              </p>
              <p className="text-slate-600 text-sm">{question.explanation}</p>
              
              <button 
                onClick={handleNext}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold ml-auto block"
              >
                {currentQuestion < QUIZ_DATA.length - 1 ? '다음 문제' : '퀴즈 종료'}
              </button>
            </div>
          )}
          
          {!showResult && (
            <button 
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`mt-8 w-full py-3 rounded-xl font-bold transition-all
                ${selectedOption === null 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'}`}
            >
              확인하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
