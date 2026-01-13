import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { QUIZ_QUESTIONS } from '../../constants';
import { CheckCircle, XCircle } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <Card className="text-center py-12 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">퀴즈 종료!</h2>
        <div className="text-5xl font-bold text-slate-800 mb-2">{score} / {QUIZ_QUESTIONS.length}</div>
        <p className="text-slate-500 mb-8">
          {score === 10 ? "만점입니다! 당신은 데이터 윤리 전문가입니다." : 
           score > 7 ? "훌륭합니다! 핵심 개념을 잘 이해하고 계시네요." : 
           "조금 더 공부가 필요해요! 이론 탭을 복습하고 다시 도전해보세요."}
        </p>
        <Button onClick={resetQuiz} className="mx-auto">다시 풀기</Button>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between text-sm text-slate-400 mb-4 uppercase tracking-widest font-semibold">
        <span>윤리적 딜레마 퀴즈</span>
        <span>{currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
      </div>

      <Card>
        <h3 className="text-xl font-bold mb-6">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
            
            if (showExplanation) {
              if (idx === currentQ.correctAnswer) {
                btnClass += "bg-green-50 border-green-500 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-50 border-red-500 text-red-800";
              } else {
                btnClass += "border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              btnClass += "border-slate-200 hover:border-blue-500 hover:bg-slate-50";
            }

            return (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => handleSelect(idx)}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  {opt}
                  {showExplanation && idx === currentQ.correctAnswer && <CheckCircle size={20} className="text-green-600"/>}
                  {showExplanation && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle size={20} className="text-red-600"/>}
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
            <h4 className="font-bold text-slate-700 mb-2">해설:</h4>
            <p className="text-slate-600 mb-4">{currentQ.explanation}</p>
            <div className="flex justify-end">
              <Button onClick={nextQuestion}>
                {currentQIndex === QUIZ_QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};