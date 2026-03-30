import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    if (idx === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="text-center py-10 animate-fade-in bg-white rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-black text-blue-600 mb-4">{score * 10}점</div>
        <p className="text-slate-600 mb-8">
          {score >= 8 ? "당신은 전설의 해커 방어자입니다!" : score >= 5 ? "훌륭한 보안 꿈나무입니다!" : "조금 더 공부가 필요합니다."}
        </p>
        <button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 shadow-sm">
          <RefreshCw className="w-5 h-5" /> 다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <span className="text-blue-600 font-bold">문제 {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
          <span className="text-slate-500 text-sm">점수: {score * 10}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-6 min-h-[60px]">{question.question}</h3>

        <div className="space-y-3 mb-6">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isAnswered
                  ? idx === question.correctAnswer
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : idx === selectedAnswer
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {isAnswered && idx === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isAnswered && idx === selectedAnswer && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500 animate-fade-in border border-blue-100">
            <p className="text-blue-700 font-bold text-sm mb-1">해설</p>
            <p className="text-slate-600 text-sm">{question.explanation}</p>
          </div>
        )}

        {isAnswered && (
          <button 
            onClick={nextQuestion}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
          >
            {currentIdx + 1 < QUIZ_QUESTIONS.length ? '다음 문제' : '결과 보기'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;