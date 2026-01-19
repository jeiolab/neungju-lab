import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { QuizQuestion } from '../types';
import { HelpCircle, AlertCircle, Check, X } from 'lucide-react';

interface QuizTabProps {
  onComplete: (correct: boolean, questionId: number) => void;
  quizHistory: { questionId: number; isCorrect: boolean }[];
}

const QuizTab: React.FC<QuizTabProps> = ({ onComplete, quizHistory }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter questions
  const filteredQuestions = selectedDifficulty === 'ALL' 
    ? QUIZ_QUESTIONS 
    : QUIZ_QUESTIONS.filter(q => q.difficulty === selectedDifficulty);

  const currentQuestion = filteredQuestions[currentQIndex];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    const correct = selectedOption === currentQuestion.correctIndex;
    onComplete(correct, currentQuestion.id);
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setCurrentQIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  // Helper to check history
  const history = quizHistory.find(h => h.questionId === currentQuestion?.id);

  if (!currentQuestion) {
    return (
      <div className="text-center p-10 text-gray-500">
        선택한 난이도의 문제가 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-lg font-bold text-green-900 mb-1">📝 개념 확인 퀴즈</h2>
           <p className="text-sm text-green-700">난이도를 선택하고 문제를 풀어보세요.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-green-200">
           {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((level) => (
             <button
               key={level}
               onClick={() => {
                 setSelectedDifficulty(level as any);
                 setCurrentQIndex(0);
                 setIsSubmitted(false);
                 setSelectedOption(null);
               }}
               className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${selectedDifficulty === level ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
             >
               {level === 'ALL' ? '전체' : level}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${
              currentQuestion.difficulty === 'EASY' ? 'bg-blue-400' : 
              currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-400' : 'bg-red-400'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs text-gray-400">
              문제 {currentQIndex + 1} / {filteredQuestions.length}
            </span>
         </div>

         <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 leading-snug">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ";
                
                if (isSubmitted) {
                   if (idx === currentQuestion.correctIndex) {
                     btnClass += "border-green-500 bg-green-50 text-green-900";
                   } else if (idx === selectedOption) {
                     btnClass += "border-red-500 bg-red-50 text-red-900";
                   } else {
                     btnClass += "border-gray-100 text-gray-400 opacity-50";
                   }
                } else {
                   if (selectedOption === idx) {
                     btnClass += "border-blue-500 bg-blue-50 text-blue-900";
                   } else {
                     btnClass += "border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700";
                   }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isSubmitted}
                    className={btnClass}
                  >
                    <span>{option}</span>
                    {isSubmitted && idx === currentQuestion.correctIndex && <Check size={18} className="text-green-600" />}
                    {isSubmitted && idx === selectedOption && idx !== currentQuestion.correctIndex && <X size={18} className="text-red-600" />}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 animate-fade-in">
                <div className="flex items-center space-x-2 text-gray-800 font-bold mb-2">
                   <HelpCircle size={18} className="text-blue-500" />
                   <span>해설</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                
                <button 
                  onClick={handleNext}
                  className="mt-4 w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800"
                >
                  다음 문제
                </button>
              </div>
            )}

            {!isSubmitted && (
              <button 
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`mt-6 w-full py-3 rounded-xl font-bold transition-colors ${selectedOption === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'}`}
              >
                정답 확인하기
              </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default QuizTab;