import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TabQuizProps {
  quizAnswers: Record<number, number>;
  setQuizAnswer: (id: number, answer: number) => void;
  addBadge: (badge: string) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ quizAnswers, setQuizAnswer, addBadge }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];
  const isCorrect = quizAnswers[currentQ.id] === currentQ.correctAnswer;
  const isAnswered = quizAnswers[currentQ.id] !== undefined;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setQuizAnswer(currentQ.id, idx);
    setShowExplanation(true);
    
    // Check for badge on last question
    if (currentQIndex === QUIZ_QUESTIONS.length - 1) {
      const correctCount = Object.keys(quizAnswers).filter(k => quizAnswers[Number(k)] === QUIZ_QUESTIONS.find(q => q.id === Number(k))?.correctAnswer).length + (idx === currentQ.correctAnswer ? 1 : 0);
      if (correctCount >= 8) addBadge('보안 의식 탑재');
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setShowExplanation(false);
    }
  };

  const totalCorrect = Object.keys(quizAnswers).filter(k => quizAnswers[Number(k)] === QUIZ_QUESTIONS.find(q => q.id === Number(k))?.correctAnswer).length;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <span className="font-bold text-slate-700">문제 {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="text-sm font-medium text-slate-500">현재 점수: {totalCorrect}0점</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6 leading-snug">
          {currentQ.question}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800";
              else if (idx === quizAnswers[currentQ.id]) btnClass += "bg-red-100 border-red-500 text-red-800";
              else btnClass += "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
            } else {
              btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                   <span>{opt}</span>
                   {isAnswered && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                   {isAnswered && idx === quizAnswers[currentQ.id] && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 animate-fade-in">
            <div className={`p-5 rounded-xl mb-4 ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-orange-50 text-orange-900'}`}>
              <div className="flex items-center gap-2 font-bold mb-2">
                <AlertCircle className="w-5 h-5" />
                해설
              </div>
              <p>{currentQ.explanation}</p>
              {!isCorrect && (
                <div className="mt-2 text-xs font-bold uppercase tracking-wider opacity-70">
                   편향 분석: {currentQ.biasType === 'risk_underestimation' ? '위험 과소평가' : currentQ.biasType === 'risk_overestimation' ? '위험 과대평가' : '지식 부족'}
                </div>
              )}
            </div>
            
            {currentQIndex < QUIZ_QUESTIONS.length - 1 ? (
               <button onClick={nextQuestion} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-700">다음 문제</button>
            ) : (
               <div className="text-center p-4 bg-indigo-50 rounded-xl font-bold text-indigo-700">퀴즈 완료! 다음 탭에서 심화 학습을 해보세요.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;