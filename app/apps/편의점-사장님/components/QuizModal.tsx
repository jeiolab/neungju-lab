import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../constants';
import { Button } from './Button';
import { CheckCircle2, XCircle, X, Trophy } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleAnswer = (idx: number) => {
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">데이터 퀴즈</h2>
            <p className="text-purple-100 text-sm">정형 데이터 지식 테스트</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isFinished ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>문제 {currentQuestionIdx + 1}/{QUIZ_QUESTIONS.length}</span>
                  <span>점수: {score}</span>
                </div>
                <h3 className="text-lg font-medium text-slate-800">{currentQuestion.question}</h3>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass = "w-full p-4 text-left border rounded-xl transition-all ";
                  
                  if (showExplanation) {
                    if (idx === currentQuestion.correctAnswer) {
                      btnClass += "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500";
                    } else if (idx === selectedAnswer) {
                      btnClass += "bg-red-50 border-red-500 text-red-700";
                    } else {
                      btnClass += "opacity-50 border-slate-200";
                    }
                  } else {
                    btnClass += "hover:bg-slate-50 border-slate-200 hover:border-purple-300";
                  }

                  return (
                    <button 
                      key={idx}
                      onClick={() => !showExplanation && handleAnswer(idx)}
                      disabled={showExplanation}
                      className={btnClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showExplanation && idx === currentQuestion.correctAnswer && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        {showExplanation && idx === selectedAnswer && idx !== currentQuestion.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 animate-in slide-in-from-bottom-2 fade-in">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700">
                    <p className="font-semibold mb-1">해설:</p>
                    {currentQuestion.explanation}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={nextQuestion}>
                      {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
                <Trophy className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h3>
              <p className="text-slate-600 mb-8">
                총 {QUIZ_QUESTIONS.length}문제 중 <span className="font-bold text-purple-600 text-xl">{score}</span>문제를 맞혔습니다.
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={resetQuiz}>다시 하기</Button>
                <Button onClick={onClose}>대시보드로 이동</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};