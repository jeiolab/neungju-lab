import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, RefreshCw, Trophy } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswers(prev => [...prev, isCorrect]);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      onComplete(score + (selectedOption === QUIZ_QUESTIONS[currentQuestionIdx].correctIndex ? 1 : 0));
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
    setAnswers([]);
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg text-center max-w-lg mx-auto mt-10">
        <Trophy size={64} className="text-yellow-500 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h2>
        <p className="text-xl text-gray-600 mb-6">총 {QUIZ_QUESTIONS.length}문제 중 <span className="font-bold text-indigo-600">{score}</span>점을 획득했습니다.</p>
        
        <div className="grid grid-cols-5 gap-2 mb-8">
            {answers.map((isCorrect, idx) => (
                <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {idx + 1}
                </div>
            ))}
        </div>

        <button 
          onClick={handleRetry}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <RefreshCw size={20} />
          다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">문제 {currentQuestionIdx + 1}/{QUIZ_QUESTIONS.length}</span>
          <span className="text-sm font-bold text-indigo-600">현재 점수: {score}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedOption === idx
                  ? showExplanation
                    ? idx === question.correctIndex
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-rose-500 bg-rose-50'
                    : 'border-indigo-600 bg-indigo-50'
                  : showExplanation && idx === question.correctIndex
                    ? 'border-emerald-500 bg-emerald-50' // Highlight correct answer if wrong one picked
                    : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${selectedOption === idx ? 'text-indigo-900' : 'text-gray-700'}`}>
                  {option}
                </span>
                {showExplanation && idx === question.correctIndex && (
                  <Check size={20} className="text-emerald-600" />
                )}
                {showExplanation && selectedOption === idx && idx !== question.correctIndex && (
                  <X size={20} className="text-rose-600" />
                )}
              </div>
            </button>
          ))}
        </div>

        {showExplanation ? (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-lg mb-6 ${selectedOption === question.correctIndex ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
              <p className="font-bold mb-1 text-sm uppercase text-gray-500">해설 (Explanation)</p>
              <p className="text-gray-800">{question.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-colors"
            >
              {currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "퀴즈 종료" : "다음 문제"}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-xl font-bold transition-colors ${
              selectedOption === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            정답 확인
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;