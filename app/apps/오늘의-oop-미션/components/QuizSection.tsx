import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X } from 'lucide-react';

interface QuizSectionProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
      onComplete(score + (selectedOption === currentQ.correctAnswer ? 0 : 0)); // Score is already updated
    }
  };

  if (isFinished) {
    return (
      <div className="text-center py-10 animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score} / {questions.length}</div>
        <p className="text-gray-600 mb-6">
            {score === questions.length ? "만점입니다! 당신은 OOP 마스터입니다." : "수고하셨습니다! 틀린 부분을 복습하고 내일 다시 도전해보세요."}
        </p>
        <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700"
        >
            홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
        <span>문제 {currentIndex + 1} / {questions.length}</span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
            currentQ.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
            currentQ.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
        }`}>
            {currentQ.difficulty}
        </span>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                if (showFeedback) {
                    if (idx === currentQ.correctAnswer) {
                        btnClass += "border-green-500 bg-green-50 text-green-800";
                    } else if (idx === selectedOption) {
                        btnClass += "border-red-500 bg-red-50 text-red-800";
                    } else {
                        btnClass += "border-gray-100 text-gray-400";
                    }
                } else {
                    btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
                }

                return (
                    <button 
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={showFeedback}
                        className={btnClass}
                    >
                        <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {showFeedback && idx === currentQ.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                            {showFeedback && idx === selectedOption && idx !== currentQ.correctAnswer && <X className="w-5 h-5 text-red-600" />}
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {showFeedback && (
        <div className="animate-slideUp">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-blue-800 text-sm mb-6">
                <span className="font-bold">해설:</span> {currentQ.explanation}
            </div>
            <button 
                onClick={nextQuestion}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
            >
                {currentIndex === questions.length - 1 ? "결과 보기" : "다음 문제"}
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;