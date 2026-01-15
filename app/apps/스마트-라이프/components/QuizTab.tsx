import React, { useState } from 'react';
import { Circle, X, RefreshCw, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../constants';
import Confetti from './Confetti';

const QuizTab: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (userAnswer: boolean) => {
    if (showFeedback) return;

    const correct = userAnswer === currentQuestion.answer;
    if (correct) setScore(score + 1);
    
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowFeedback(false);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in relative">
        {score === QUIZ_QUESTIONS.length && <Confetti />}
        
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 종료!</h2>
          <p className="text-xl text-gray-600 mb-8">
            총 <span className="text-blue-600 font-bold">{QUIZ_QUESTIONS.length}</span>문제 중 
            <span className="text-blue-600 font-bold text-2xl mx-2">{score}</span>문제를 맞혔어요.
          </p>
          
          {score === QUIZ_QUESTIONS.length ? (
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl font-medium">
              🎉 완벽해요! 디지털 기술 전문가시네요!
            </div>
          ) : (
             <div className="mb-8 p-4 bg-gray-50 text-gray-700 rounded-xl font-medium">
              조금만 더 복습해보면 완벽할 거예요!
            </div>
          )}

          <button
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-5 h-5" /> 다시 풀기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Question {currentIdx + 1}</span>
          <span>{QUIZ_QUESTIONS.length} Questions</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
        {/* Question Area */}
        <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mb-4">
            OX 퀴즈
          </span>
          <h3 className="text-2xl font-bold text-gray-800 leading-snug break-keep">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Interaction Area */}
        {!showFeedback ? (
          <div className="grid grid-cols-2 gap-4 p-8 bg-gray-50">
            <button
              onClick={() => handleAnswer(true)}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <Circle className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-gray-700 group-hover:text-blue-600">그렇다 (O)</span>
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all group"
            >
              <X className="w-12 h-12 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-gray-700 group-hover:text-red-600">아니다 (X)</span>
            </button>
          </div>
        ) : (
          <div className={`p-8 ${isCorrect ? 'bg-green-50' : 'bg-red-50'} border-t animate-slide-up`}>
            <div className="flex items-center gap-3 mb-3">
              {isCorrect ? (
                <Circle className="w-8 h-8 text-green-600 fill-green-100" />
              ) : (
                <X className="w-8 h-8 text-red-600 fill-red-100" />
              )}
              <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? "정답입니다!" : "아쉽네요, 오답입니다."}
              </h4>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              다음 문제
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;