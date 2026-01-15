import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === question.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === question.correctIndex ? 0 : 0)); // Ensure final score is accurate
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">퀴즈 결과</h2>
        <div className="text-6xl mb-6">{score >= 8 ? '🎉' : score >= 5 ? '🙂' : '📚'}</div>
        <p className="text-2xl font-bold text-blue-600 mb-2">{score} / {QUIZ_QUESTIONS.length} 점</p>
        <p className="text-gray-500 mb-8">
          {score >= 8 ? "AI 마스터시군요! 훌륭합니다." : "조금 더 공부하면 완벽해질 거예요!"}
        </p>
        <button onClick={resetQuiz} className="flex items-center gap-2 mx-auto px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          <RefreshCw size={18} /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
        <span>Question {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="font-bold text-blue-600">현재 점수: {score}</span>
      </div>

      <h3 className="text-xl font-bold mb-6 leading-relaxed">{question.question}</h3>

      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
          let style = "border-gray-200 hover:bg-gray-50";
          if (isAnswered) {
             if (idx === question.correctIndex) style = "bg-green-100 border-green-500 text-green-800 font-bold";
             else if (idx === selectedOption) style = "bg-red-100 border-red-500 text-red-800";
             else style = "opacity-50 border-gray-100";
          }
          
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${style}`}
            >
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {isAnswered && idx === question.correctIndex && <CheckCircle className="text-green-600" size={20}/>}
                {isAnswered && idx === selectedOption && idx !== question.correctIndex && <XCircle className="text-red-600" size={20}/>}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 animate-fade-in">
          <strong>💡 해설:</strong> {question.explanation}
        </div>
      )}

      <div className="text-right">
        <button 
          onClick={handleNext} 
          disabled={!isAnswered}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {currentIdx === QUIZ_QUESTIONS.length - 1 ? '결과 보기' : '다음 문제'}
        </button>
      </div>
    </div>
  );
};