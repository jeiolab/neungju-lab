import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_DATA } from '../constants';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizTabProps {
  onScoreUpdate: (score: number, wrongIds: number[]) => void;
  wrongNoteIds: number[];
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate, wrongNoteIds }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_DATA[currentIdx];

  const handleSelect = (idx: number) => {
    if (isConfirmed) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (selectedOption === question.correctIndex) {
      setScore(s => s + 10);
    } else {
      setWrongIds(prev => [...prev, question.id]);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      setShowResult(true);
      onScoreUpdate(selectedOption === question.correctIndex ? score + 10 : score, [...wrongNoteIds, ...wrongIds]);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsConfirmed(false);
    setScore(0);
    setWrongIds([]);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl text-center space-y-6 animate-fade-in mt-10">
        <h2 className="text-3xl font-bold text-slate-800">퀴즈 완료! 🎉</h2>
        <div className="py-8">
          <span className="text-6xl font-black text-blue-600">{score}</span>
          <span className="text-2xl text-slate-400 font-bold">/100</span>
        </div>
        <p className="text-slate-600">
          {score === 100 ? "완벽합니다! 네트워크 마스터시네요." : "오답노트를 확인하고 다시 도전해보세요!"}
        </p>
        <button 
          onClick={restartQuiz}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 min-h-[400px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {question.difficulty === 'easy' ? '초급' : question.difficulty === 'medium' ? '중급' : '고급'}
            </span>
            <span className="text-slate-400 font-bold text-sm">{currentIdx + 1}/{QUIZ_DATA.length}</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-snug">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-slate-600 ";
              
              if (isConfirmed) {
                if (idx === question.correctIndex) btnClass += "bg-green-50 border-green-500 text-green-700 ";
                else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-700 ";
                else btnClass += "border-slate-100 opacity-50 ";
              } else {
                if (idx === selectedOption) btnClass += "border-blue-500 bg-blue-50 text-blue-700 ";
                else btnClass += "border-slate-100 hover:bg-slate-50 ";
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isConfirmed}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {isConfirmed && idx === question.correctIndex && <CheckCircle2 className="text-green-600 w-5 h-5" />}
                    {isConfirmed && idx === selectedOption && idx !== question.correctIndex && <XCircle className="text-red-500 w-5 h-5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isConfirmed ? (
          <div className="mt-6 animate-slide-up">
            <div className="bg-slate-50 p-4 rounded-xl mb-4 text-sm text-slate-700 border border-slate-200">
              <span className="font-bold">해설:</span> {question.explanation}
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
            >
              다음 문제 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={handleConfirm}
            disabled={selectedOption === null}
            className={`mt-6 w-full py-4 rounded-xl font-bold transition-colors ${
              selectedOption !== null 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            정답 확인
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
