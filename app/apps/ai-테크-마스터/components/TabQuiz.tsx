import React, { useState, useEffect } from 'react';
import { QUIZ_DATA } from '../constants';
import { TechCategory } from '../types';
import { HelpCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface TabQuizProps {
  updateMastery: (category: TechCategory, isCorrect: boolean) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ updateMastery }) => {
  // Simple "Spaced Repetition": Store wrong answers in local state to force retry later
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizQueue, setQuizQueue] = useState(QUIZ_DATA);
  const [retryMode, setRetryMode] = useState(false);

  const currentQuestion = quizQueue[currentQuestionIndex];

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    updateMastery(currentQuestion.category, isCorrect);

    if (!isCorrect) {
        // Simple logic: if wrong, we might want to see it again.
        // For this session, we don't physically duplicate, but we could flag it.
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentQuestionIndex < quizQueue.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of quiz
      alert("모든 문제를 풀었습니다! 마스터리 대시보드에서 성과를 확인하세요.");
      // Optional: reset or shuffle
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500">
        <span>Question {currentQuestionIndex + 1} / {quizQueue.length}</span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
            currentQuestion.difficulty === 'HARD' ? 'bg-red-100 text-red-600' :
            currentQuestion.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-600'
        }`}>
            {currentQuestion.difficulty}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                <span className="mr-2 text-blue-600">Q.</span>
                {currentQuestion.question}
            </h3>

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                    
                    if (isSubmitted) {
                        if (idx === currentQuestion.correctAnswer) {
                            btnClass += "bg-green-50 border-green-500 text-green-800 font-semibold";
                        } else if (idx === selectedOption) {
                            btnClass += "bg-red-50 border-red-500 text-red-800";
                        } else {
                            btnClass += "border-gray-100 text-gray-400 opacity-50";
                        }
                    } else {
                        if (idx === selectedOption) {
                            btnClass += "bg-blue-50 border-blue-500 text-blue-800 shadow-md";
                        } else {
                            btnClass += "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isSubmitted}
                            className={btnClass}
                        >
                            <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 text-xs font-bold
                                    ${isSubmitted && idx === currentQuestion.correctAnswer ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}
                                `}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                {option}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {isSubmitted && (
            <div className="bg-slate-50 p-6 border-t border-slate-100 animate-slide-up">
                <div className="flex items-start mb-4">
                    {selectedOption === currentQuestion.correctAnswer ? (
                        <CheckCircle2 className="text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                        <XCircle className="text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <div>
                        <p className={`font-bold ${selectedOption === currentQuestion.correctAnswer ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedOption === currentQuestion.correctAnswer ? '정답입니다!' : '오답입니다.'}
                        </p>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                            {currentQuestion.explanation}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleNext}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
                >
                    다음 문제
                </button>
            </div>
        )}

        {!isSubmitted && (
             <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    제출하기
                </button>
             </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;