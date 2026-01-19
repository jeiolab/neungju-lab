import React, { useState } from 'react';
import { QUIZ_DATA } from '../data';
import { updateQuizScore } from '../services/gamification';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const QuizSection: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const question = QUIZ_DATA[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.correctIndex) {
      setScore(s => s + 10);
    } else {
      setWrongAnswers(prev => [...prev, question.id]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setShowResult(true);
    updateQuizScore(score);
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setWrongAnswers([]);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center pt-20">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">퀴즈 완료!</h2>
          <p className="text-slate-500 mb-8">당신의 지능 에이전트 지식 수준은?</p>
          
          <div className="text-5xl font-black text-blue-600 mb-8">
            {score} <span className="text-2xl text-slate-400">/ 100</span>
          </div>

          <div className="space-y-4 text-left bg-slate-50 p-6 rounded-xl mb-8">
            <h3 className="font-bold text-slate-800">틀린 문제 복습하기</h3>
            {wrongAnswers.length === 0 ? (
                <p className="text-green-600">틀린 문제가 없습니다. 완벽합니다!</p>
            ) : (
                <ul className="space-y-2">
                    {wrongAnswers.map(id => {
                        const q = QUIZ_DATA.find(q => q.id === id);
                        return (
                            <li key={id} className="text-sm text-slate-600">
                                <span className="font-bold text-red-500">Q{id}.</span> {q?.question}
                            </li>
                        )
                    })}
                </ul>
            )}
          </div>

          <button
            onClick={restartQuiz}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> 다시 풀기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-4 h-full flex flex-col justify-center">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-400">
        <span>Question {currentQuestionIdx + 1} / {QUIZ_DATA.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-snug">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let itemStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
            
            if (isAnswered) {
                if (idx === question.correctIndex) {
                    itemStyle = "bg-green-50 border-green-500 text-green-700";
                } else if (idx === selectedOption) {
                    itemStyle = "bg-red-50 border-red-500 text-red-700";
                } else {
                    itemStyle = "opacity-50 border-slate-100";
                }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all ${itemStyle}`}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && idx === question.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in-up">
            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 border border-blue-100 leading-relaxed">
                <span className="font-bold block mb-1">💡 해설</span>
                {question.explanation}
            </div>
            <button
                onClick={handleNext}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
                {currentQuestionIdx < QUIZ_DATA.length - 1 ? '다음 문제' : '결과 보기'} <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
