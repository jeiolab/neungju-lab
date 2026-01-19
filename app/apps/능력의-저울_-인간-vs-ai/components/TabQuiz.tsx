import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface TabQuizProps {
  onQuizComplete: (score: number, weakConcepts: string[]) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongConcepts, setWrongConcepts] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 10);
    } else {
      setWrongConcepts(prev => [...prev, currentQuestion.relatedConcept]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onQuizComplete(score + (selectedOption === currentQuestion.correctAnswer ? 10 : 0), wrongConcepts);
    }
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800 rounded-xl shadow-xl max-w-2xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-white mb-6">퀴즈 결과</h2>
        <div className="text-5xl font-bold text-blue-400 mb-4">{score} / 100</div>
        
        {wrongConcepts.length > 0 && (
          <div className="w-full bg-slate-900 p-6 rounded-lg mb-6 border border-red-900/50">
            <h3 className="text-lg font-bold text-red-400 mb-3">⚠️ 보완이 필요한 개념</h3>
            <ul className="list-disc list-inside text-slate-300">
              {Array.from(new Set(wrongConcepts)).map((concept, idx) => (
                <li key={idx}>{concept}</li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-slate-400 mb-8 text-center">
          수고하셨습니다! 결과를 '나의 통찰력 점수'에 반영했습니다.
        </p>

        <button 
          onClick={() => {
             setCurrentQuestionIndex(0);
             setSelectedOption(null);
             setIsAnswered(false);
             setScore(0);
             setWrongConcepts([]);
             setShowResult(false);
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-400 font-mono">Question {currentQuestion.id} / {QUIZ_QUESTIONS.length}</span>
        <span className="text-blue-400 font-bold">{score} Points</span>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full p-4 text-left rounded-xl transition-all border-2 ";
            
            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) {
                btnClass += "bg-green-900/30 border-green-500 text-green-100";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-900/30 border-red-500 text-red-100";
              } else {
                btnClass += "bg-slate-700/50 border-transparent text-slate-500";
              }
            } else {
              btnClass += "bg-slate-700 hover:bg-slate-600 border-transparent text-slate-200 hover:border-blue-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle size={20} className="text-green-400" />}
                  {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle size={20} className="text-red-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg animate-fade-in">
            <h4 className="font-bold text-blue-300 mb-1">해설</h4>
            <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;