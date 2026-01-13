import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface TabQuizProps {
  onScore: (points: number) => void;
  onMistake: (questionId: number) => void;
  savedMistakes: number[];
}

const TabQuiz: React.FC<TabQuizProps> = ({ onScore, onMistake, savedMistakes }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Filter questions? Or just show all. Showing all 10 for simplicity.
  const question = QUIZ_DATA[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.correctAnswer) {
      setScore(s => s + 1);
      onScore(20);
    } else {
      onMistake(question.id);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 종료!</h2>
        <div className="text-5xl font-black text-indigo-600 mb-6">
          {score * 20} <span className="text-2xl text-gray-400 font-normal">점</span>
        </div>
        <p className="text-gray-600 mb-8">
          총 {QUIZ_DATA.length}문제 중 {score}문제를 맞혔습니다.
        </p>
        <button
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center mx-auto space-x-2"
        >
          <RefreshCw className="w-5 h-5" />
          <span>다시 도전하기</span>
        </button>
      </div>
    );
  }

  const isPreviousMistake = savedMistakes.includes(question.id);

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-indigo-700">
          <HelpCircle className="w-6 h-6" />
          <h2 className="text-xl font-bold">확인 문제</h2>
        </div>
        <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          {currentIdx + 1} / {QUIZ_DATA.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 relative overflow-hidden">
        {isPreviousMistake && (
            <div className="absolute top-0 right-0 bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
                이전에 틀린 문제
            </div>
        )}
        <div className="mb-6">
            <span className={`text-xs font-bold px-2 py-1 rounded text-white mb-2 inline-block
                ${question.difficulty === '하' ? 'bg-green-400' : question.difficulty === '중' ? 'bg-blue-400' : 'bg-red-400'}`}>
                난이도: {question.difficulty}
            </span>
            <h3 className="text-xl font-bold text-gray-800 leading-snug">{question.question}</h3>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
            if (!isAnswered) {
              btnClass += "border-gray-100 hover:border-indigo-200 hover:bg-indigo-50";
            } else {
              if (idx === question.correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                btnClass += "border-gray-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isAnswered && idx === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600"/>}
                    {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="w-5 h-5 text-red-600"/>}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fade-in-up">
            <div className={`p-4 rounded-xl mb-4 ${selectedOption === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-bold mb-1">{selectedOption === question.correctAnswer ? '정답입니다! 🎉' : '아쉽네요!'}</p>
                <p className="text-sm">{question.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>{currentIdx === QUIZ_DATA.length - 1 ? '결과 보기' : '다음 문제'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;