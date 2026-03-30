import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onComplete, onExit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIdx];

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    if (optionIdx === question.correctIndex) {
      setScore(s => s + 10);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === question.correctIndex ? 10 : 0)); // Add last point if correct
    }
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-blue-600 mb-2">{score}점</div>
        <p className="text-gray-500 mb-8">총 {questions.length}문제 중 {score / 10}문제를 맞혔습니다.</p>
        <button 
          onClick={onExit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
       <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">네트워크 공유 퀴즈</h2>
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          문제 {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2">
          <div 
            className="bg-blue-500 h-2 transition-all duration-300" 
            style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
            Q. {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ";
              
              if (isAnswered) {
                if (idx === question.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800 font-bold";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-300 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-100 text-gray-400";
                }
              } else {
                btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span>{option}</span>
                  {isAnswered && idx === question.correctIndex && <Check className="text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== question.correctIndex && <X className="text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in">
              <p className="text-sm font-bold text-gray-700 mb-1">해설</p>
              <p className="text-sm text-gray-600">{question.explanation}</p>
              <div className="mt-4 text-right">
                <button 
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  {currentIdx < questions.length - 1 ? '다음 문제' : '결과 보기'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;