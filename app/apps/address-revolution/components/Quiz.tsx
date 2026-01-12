import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, Award, RefreshCcw } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = QUIZ_DATA[currentQuestionIdx];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);

    if (index === currentQuestion.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <section id="quiz" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionTitle 
          title="지식 점검 퀴즈" 
          subtitle="IPv4와 IPv6에 대해 배운 내용을 퀴즈를 통해 확인해보세요."
        />

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[400px] flex flex-col relative">
          {!isFinished ? (
            <div className="p-8 sm:p-12 flex-1 flex flex-col">
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIdx + 1) / QUIZ_DATA.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex-1">
                <span className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-2 block">
                  Question {currentQuestionIdx + 1} / {QUIZ_DATA.length}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-4">
                  {currentQuestion.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
                    
                    if (showResult) {
                      if (idx === currentQuestion.correctAnswer) {
                        btnClass += "border-green-500 bg-green-50 text-green-800";
                      } else if (idx === selectedOption) {
                        btnClass += "border-red-500 bg-red-50 text-red-800";
                      } else {
                        btnClass += "border-slate-100 opacity-50";
                      }
                    } else {
                      btnClass += "border-slate-200 hover:border-blue-500 hover:bg-blue-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={showResult}
                        className={btnClass}
                      >
                        <span className="font-medium text-lg">{option}</span>
                        {showResult && idx === currentQuestion.correctAnswer && <CheckCircle className="text-green-600" />}
                        {showResult && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle className="text-red-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Area */}
              {showResult && (
                <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-in-up">
                  <div className={`p-4 rounded-xl mb-6 ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="font-bold mb-1">
                      {selectedOption === currentQuestion.correctAnswer ? "정답입니다! 🎉" : "아쉽네요! 다시 생각해볼까요?"}
                    </p>
                    <p className="text-sm opacity-90">{currentQuestion.explanation}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={nextQuestion}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                      {currentQuestionIdx === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-12 h-12 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-2">퀴즈 완료!</h3>
              <p className="text-lg text-slate-600 mb-8">
                총 {QUIZ_DATA.length}문제 중 <span className="text-blue-600 font-bold text-2xl">{score}</span>문제를 맞히셨습니다.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={resetQuiz}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <RefreshCcw size={18} />
                  다시 도전하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
import { ArrowRight } from 'lucide-react';