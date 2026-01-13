import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizTabProps {
  updateQuizScore: (score: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ updateQuizScore }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === QUIZ_QUESTIONS[currentQuestionIdx].correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
      updateQuizScore(score + (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctAnswerIndex ? 1 : 0));
    }
  };

  if (showSummary) {
    return (
      <div className="flex flex-col items-center justify-center p-8 pb-24 h-full">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6">퀴즈 완료!</h2>
          <div className="text-7xl font-black text-indigo-600 mb-4">
            {Math.round((score / QUIZ_QUESTIONS.length) * 100)}점
          </div>
          <p className="text-gray-500 mb-8 text-lg">총 {QUIZ_QUESTIONS.length}문제 중 {score}문제를 맞췄습니다.</p>
          <button 
            onClick={() => {
                setScore(0);
                setCurrentQuestionIdx(0);
                setSelectedOption(null);
                setIsAnswered(false);
                setShowSummary(false);
            }}
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 text-lg transition-colors"
          >
            퀴즈 다시 풀기
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-10 pb-24">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-gray-800">핵심 퀴즈</h2>
        <span className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-full text-sm font-bold">
            문제 {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-normal">{question.question}</h3>

        <div className="space-y-4">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === question.correctAnswerIndex;
            
            let btnClass = "w-full p-5 rounded-2xl border-2 text-left transition-all relative text-lg ";
            if (isAnswered) {
                if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-800";
                else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-800";
                else btnClass += "border-gray-100 text-gray-400";
            } else {
                btnClass += "border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 text-gray-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                    <span className="font-medium">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle size={24} className="text-green-600 shrink-0" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-red-600 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900">
                <p className="font-bold mb-2 flex items-center gap-2">
                    <Info size={20} />
                    해설
                </p>
                <p className="leading-relaxed">{question.explanation}</p>
            </div>
            <button
                onClick={nextQuestion}
                className="w-full bg-gray-900 text-white p-5 rounded-xl font-bold hover:bg-black transition-colors text-lg shadow-lg"
            >
                {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizTab;