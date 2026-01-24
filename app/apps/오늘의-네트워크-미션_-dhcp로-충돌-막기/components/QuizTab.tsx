import React, { useState, useEffect } from 'react';
import { QUIZ_POOL } from '../constants';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

interface QuizTabProps {
  onComplete: (score: number, wrongIds: number[]) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Shuffle and pick 10 (or 5 for demo brevity, but requirements say 10)
    const shuffled = [...QUIZ_POOL].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  }, []);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongIds((prev) => [...prev, questions[currentIndex].id]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      onComplete(score + (selectedOption === questions[currentIndex].correctIndex ? 0 : 0), wrongIds);
    }
  };

  const handleRetry = () => {
    setFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setWrongIds([]);
    setSelectedOption(null);
    setIsAnswered(false);
    const shuffled = [...QUIZ_POOL].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
  };

  if (questions.length === 0) return <div className="p-20 text-center text-slate-500">퀴즈 로딩 중...</div>;

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 w-full text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-800">퀴즈 완료!</h2>
          <div className="text-8xl font-black text-indigo-600 mb-6 tracking-tighter">{score * 10}<span className="text-4xl text-slate-300 ml-2">점</span></div>
          <p className="text-slate-600 mb-8 text-lg font-medium">
            {score === 10 ? "완벽합니다! 네트워크 마스터가 되셨군요!" : "조금만 더 노력하면 마스터가 될 수 있어요!"}
          </p>
          
          {wrongIds.length > 0 && (
            <div className="text-left bg-red-50 p-6 rounded-2xl mb-8 border border-red-100">
              <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5"/>
                오답 노트 ({wrongIds.length}개)
              </h3>
              <ul className="space-y-3 text-red-600">
                {wrongIds.map(id => {
                    const q = QUIZ_POOL.find(i => i.id === id);
                    return q ? <li key={id} className="flex gap-2"><span>•</span> <span><strong>{q.relatedConcept}</strong> 관련 개념을 다시 확인해보세요.</span></li> : null;
                })}
              </ul>
            </div>
          )}

          <button 
            onClick={handleRetry}
            className="flex items-center justify-center w-full gap-3 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <RefreshCcw className="w-5 h-5" />
            다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pb-20">
      <div className="flex justify-between items-center mb-6 text-sm font-bold text-slate-400 uppercase tracking-wider">
        <span>Question {currentIndex + 1} / {questions.length}</span>
        <span className={`px-3 py-1 rounded-full text-xs border ${currentQ.difficulty === 'hard' ? 'border-red-200 text-red-500 bg-red-50' : 'border-green-200 text-green-500 bg-green-50'}`}>
            {currentQ.difficulty}
        </span>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100 flex-grow relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
            <div 
                className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
            ></div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-snug">
          {currentQ.question}
        </h3>

        <div className="grid gap-4">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all font-medium text-lg relative group ";
            if (!isAnswered) {
              btnClass += "border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 bg-white text-slate-700";
            } else {
              if (idx === currentQ.correctIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-800 shadow-md";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800 shadow-md";
              } else {
                btnClass += "border-slate-100 bg-slate-50 opacity-40 grayscale";
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
                  <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 
                        ${!isAnswered ? 'border-slate-200 text-slate-400 group-hover:border-indigo-500 group-hover:text-indigo-500' : 
                          idx === currentQ.correctIndex ? 'border-green-500 bg-green-500 text-white' : 
                          idx === selectedOption ? 'border-red-500 bg-red-500 text-white' : 'border-slate-200 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                  </div>
                  {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-6 h-6 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 animate-fade-in bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex gap-4 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg h-fit">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <span className="font-bold text-blue-900 block mb-1">정답 및 해설</span>
                    <p className="text-slate-700 leading-relaxed">{currentQ.explanation}</p>
                </div>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] transition-all"
            >
              다음 문제로 넘어가기 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};