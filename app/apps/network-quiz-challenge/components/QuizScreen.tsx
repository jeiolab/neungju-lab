'use client'

import React, { useState, useEffect } from 'react';
import { Question, QuestionType, UserAnswer, QuizSettings } from '../types';
import { Button } from './Button';

interface QuizScreenProps {
  question: Question;
  currentIndex: number;
  totalCount: number;
  onAnswer: (answer: string, isCorrect: boolean) => void;
  onNext: () => void;
  currentScore: number;
  settings?: QuizSettings | null;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ 
  question, 
  currentIndex, 
  totalCount, 
  onAnswer, 
  onNext,
  currentScore,
  settings
}) => {
  const [userInput, setUserInput] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setUserInput('');
    setShowFeedback(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput) return;

    // Evaluate answer
    let correct = false;
    const normalizedUser = userInput.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedCorrect = question.correctAnswer.trim().toLowerCase().replace(/\s+/g, '');

    if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.OX) {
      correct = normalizedUser === normalizedCorrect;
    } else {
      // Short answer: 정확한 매칭만 허용 (부분 매칭 제거)
      correct = normalizedUser === normalizedCorrect;
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    onAnswer(userInput, correct);
  };

  const renderInput = () => {
    if (showFeedback) return null;

    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setUserInput(option)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  userInput === option 
                    ? 'border-primary bg-primary/5 text-primary font-semibold' 
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-center text-sm leading-6 mr-3">
                  {idx + 1}
                </span>
                {option}
              </button>
            ))}
            <Button onClick={() => handleSubmit()} disabled={!userInput} className="mt-4">
              정답 확인
            </Button>
          </div>
        );

      case QuestionType.OX:
        return (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex gap-4">
              {['O', 'X'].map((choice) => (
                <button
                  key={choice}
                  onClick={() => setUserInput(choice)}
                  className={`w-32 h-32 rounded-xl border-2 text-6xl font-black transition-all ${
                    userInput === choice
                     ? 'border-primary bg-primary/5 text-primary'
                     : 'border-gray-200 hover:border-primary/50 text-gray-400'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
            <Button onClick={() => handleSubmit()} disabled={!userInput} fullWidth className="max-w-xs">
              선택 완료
            </Button>
          </div>
        );

      case QuestionType.SHORT_ANSWER:
        return (
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="정답을 입력하세요 (예: IP 주소, 라우터)"
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-4"
              autoFocus
            />
            <Button type="submit" disabled={!userInput.trim()} fullWidth>
              제출하기
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-6 text-sm text-gray-600 font-medium">
        <span>문제 {currentIndex + 1} / {totalCount}</span>
        <div className="flex items-center gap-3">
          {settings && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
              {settings.topic} · {settings.difficulty}
            </span>
          )}
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            현재 점수: {currentScore}점
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex) / totalCount) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm mb-6">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold mb-4">
          {question.type}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed whitespace-pre-line mb-8">
          {question.questionText}
        </h2>
        
        {renderInput()}

        {/* Feedback Section */}
        {showFeedback && (
          <div className={`mt-6 p-6 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? 'O' : 'X'}
              </div>
              <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '정답입니다!' : '오답입니다.'}
              </h3>
            </div>
            
            {!isCorrect && (
               <p className="text-red-700 font-medium mb-2">
                 정답: {question.correctAnswer}
               </p>
            )}

            <div className="bg-white/50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-gray-900 mb-1">💡 해설</p>
              <p className="text-gray-700">{question.explanation}</p>
            </div>

            <div className="text-sm text-gray-600 border-t border-gray-200 pt-3">
              <span className="font-bold text-primary mr-2">핵심 개념:</span>
              {question.relatedConcept}
            </div>

            <Button 
              onClick={onNext} 
              className="mt-6 w-full md:w-auto"
              variant={isCorrect ? 'secondary' : 'primary'}
            >
              {currentIndex + 1 === totalCount ? '결과 보기' : '다음 문제'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

