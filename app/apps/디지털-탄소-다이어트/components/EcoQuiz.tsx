import React, { useState } from 'react';
import { STATIC_QUIZ_QUESTIONS } from '../constants';
import { HelpCircle, Check, X, RefreshCw } from 'lucide-react';

const EcoQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = STATIC_QUIZ_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === STATIC_QUIZ_QUESTIONS.length - 1;

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of quiz logic could go here
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto">
       <header className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <HelpCircle className="text-purple-500" />
          환경 퀴즈
        </h2>
        <p className="text-gray-600">데이터와 환경에 대한 지식을 테스트해보세요.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-purple-500 h-2 transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / STATIC_QUIZ_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <span className="text-xs font-bold tracking-wider text-purple-500 uppercase">문제 {currentQuestionIndex + 1} / {STATIC_QUIZ_QUESTIONS.length}</span>
            <h3 className="text-xl font-bold text-gray-800 mt-2">{question.question}</h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              let btnClass = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium ";
              
              if (showResult) {
                if (index === question.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-700";
                } else if (index === selectedOption) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  btnClass += "border-gray-100 text-gray-400";
                }
              } else {
                btnClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700";
              }

              return (
                <button 
                  key={index} 
                  onClick={() => handleOptionClick(index)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === question.correctIndex && <Check size={20} className="text-green-600" />}
                    {showResult && index === selectedOption && index !== question.correctIndex && <X size={20} className="text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 animate-fadeIn">
              <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                <strong>설명:</strong> {question.explanation}
              </div>
              
              <div className="mt-6 flex justify-end">
                {isLastQuestion ? (
                  <button 
                    onClick={handleRestart}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
                  >
                    <RefreshCw size={18} /> 다시 풀기
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    다음 문제
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {isLastQuestion && showResult && (
           <div className="bg-purple-900 text-white p-4 text-center">
              총 {STATIC_QUIZ_QUESTIONS.length}문제 중 {score + (selectedOption === question.correctIndex ? 1 : 0)}점을 획득했습니다!
           </div>
        )}
      </div>
    </div>
  );
};

export default EcoQuiz;