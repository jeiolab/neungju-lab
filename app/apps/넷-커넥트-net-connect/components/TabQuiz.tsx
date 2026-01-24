import React, { useState, useEffect } from 'react';
import { QUIZ_DATA, TECH_DATA } from '../constants';
import { TechType } from '../types';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Trophy } from 'lucide-react';

interface Props {
  onAnswer: (correct: boolean, techId: TechType) => void;
  mastery: Record<string, number>;
}

export const TabQuiz: React.FC<Props> = ({ onAnswer, mastery }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<TechType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_DATA[currentIndex];

  const handleOptionClick = (tech: TechType) => {
    if (showResult) return;
    setSelectedOption(tech);
    const correct = tech === question.correctTech;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore(s => s + 20); // 5 questions * 20 = 100
    onAnswer(correct, question.correctTech);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setShowResult(false);
    setSelectedOption(null);
    setQuizFinished(false);
    setScore(0);
  };

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full min-h-[400px]">
        <Trophy className="w-24 h-24 text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">퀴즈 완료!</h2>
        <p className="text-xl mb-8">당신의 점수는 <span className="font-bold text-indigo-600">{score}점</span>입니다.</p>
        <button 
          onClick={resetQuiz}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition font-bold"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-500 font-medium">문제 {currentIndex + 1} / {QUIZ_DATA.length}</span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
          현재 점수: {score}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8 border border-slate-100">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.scenario}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => {
            const techInfo = TECH_DATA.find(t => t.id === option);
            let btnClass = "p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ";
            
            if (showResult) {
              if (option === question.correctTech) {
                btnClass += "bg-green-50 border-green-500 text-green-700";
              } else if (option === selectedOption && option !== question.correctTech) {
                btnClass += "bg-red-50 border-red-500 text-red-700 opacity-60";
              } else {
                btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
              }
            } else {
              btnClass += "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 shadow-sm hover:shadow-md";
            }

            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold">{techInfo?.name}</span>
                  {showResult && option === question.correctTech && <CheckCircle className="ml-auto w-5 h-5" />}
                  {showResult && option === selectedOption && option !== question.correctTech && <XCircle className="ml-auto w-5 h-5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className={`rounded-xl p-6 mb-8 animate-fade-in ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-900'}`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-lg mb-2">{isCorrect ? "정답입니다!" : "아쉽네요."}</p>
              <p>{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <div className="flex justify-end">
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition font-bold"
          >
            {currentIndex === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
