import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

interface QuizTabProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (score >= Math.ceil(questions.length * 0.6)) {
        onComplete();
      }
    }
  };

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-blue-600 mb-6">
          {score} / {questions.length}
        </div>
        <p className="text-gray-600 mb-8">
          {score === questions.length ? "완벽합니다! IoT 마스터시군요!" : 
           score >= questions.length / 2 ? "잘하셨습니다! 조금만 더 노력해보세요." : "아쉽네요. 개념 카드를 다시 읽어보세요."}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
        >
          <RefreshCcw className="w-4 h-4" />
          다른 미션 보기 (내일)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            점수: {score}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => {
            let itemClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            
            if (isAnswered) {
              if (idx === question.correctAnswer) {
                itemClass += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                itemClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                itemClass += "border-gray-100 text-gray-400";
              }
            } else {
              itemClass += "border-gray-100 hover:border-blue-300 hover:bg-blue-50 text-gray-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={itemClass}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {isAnswered && idx === question.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 animate-fade-in">
            <p className="font-bold text-slate-700 mb-1">해설</p>
            <p className="text-sm text-slate-600">{question.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-md transition-all"
          >
            {currentIdx < questions.length - 1 ? "다음 문제" : "결과 보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
