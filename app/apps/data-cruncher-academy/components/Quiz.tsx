import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';

interface QuizProps {
  onComplete: (xp: number) => void;
  completedQuizzes: string[];
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, completedQuizzes }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentQuestion = QUIZ_QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    setIsAnswered(true);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect && !completedQuizzes.includes(currentQuestion.id)) {
      onComplete(50); // 50 XP for correct answer
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6" /> 압축 마스터 퀴즈
            </h2>
            <span className="text-blue-200 text-sm font-medium">
              문제 {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-blue-900/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Body */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                  ${selectedOption === idx 
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium' 
                    : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50 text-slate-600'}
                  ${isAnswered && idx === currentQuestion.correctIndex ? '!border-green-500 !bg-green-50 !text-green-800' : ''}
                  ${isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex ? '!border-red-500 !bg-red-50 !text-red-800' : ''}
                `}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQuestion.correctIndex && <Check className="w-5 h-5 text-green-600" />}
                {isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && <X className="w-5 h-5 text-red-600" />}
              </button>
            ))}
          </div>

          {/* Feedback Section */}
          {isAnswered && (
            <div className={`mt-6 p-4 rounded-xl animate-fade-in ${feedback === 'correct' ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-1 p-1 rounded-full ${feedback === 'correct' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                  {feedback === 'correct' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback === 'correct' ? '정답입니다!' : '아쉽네요, 다시 생각해볼까요?'}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-8 flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                정답 확인하기
              </button>
            ) : (
              currentQIndex < QUIZ_QUESTIONS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-2"
                >
                  다음 문제 <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-blue-600 font-bold">모든 문제를 풀었습니다!</div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
