import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { UserState, QuizQuestion } from '../types';
import { Check, X, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  userState: UserState;
  onUpdateQuizHistory: (questionId: number, isCorrect: boolean) => void;
}

export const TabQuiz: React.FC<Props> = ({ userState, onUpdateQuizHistory }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const currentQ = QUIZ_DATA[currentIdx];
  const isCorrect = selectedOption === currentQ.correctIndex;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    onUpdateQuizHistory(currentQ.id, selectedOption === currentQ.correctIndex);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Loop or finish logic could be added here
      alert('모든 퀴즈를 완료했습니다! 실험실로 돌아가 더 탐구해보세요.');
      setCurrentIdx(0);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-slate-500">
        문제 {currentIdx + 1} / {QUIZ_DATA.length}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getDifficultyColor(currentQ.difficulty)}`}>
            {currentQ.difficulty === 'easy' ? '쉬움' : currentQ.difficulty === 'medium' ? '보통' : '도전'}
          </span>
          {userState.quizHistory[currentQ.id] !== undefined && (
            <span className="text-xs text-slate-400">
              이전 기록: {userState.quizHistory[currentQ.id] ? '정답 ✅' : '오답 ❌'}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let itemClass = "w-full p-4 rounded-xl text-left border-2 transition-all flex justify-between items-center ";
            
            if (showResult) {
              if (idx === currentQ.correctIndex) itemClass += "border-green-500 bg-green-50 text-green-900 font-bold ";
              else if (idx === selectedOption) itemClass += "border-red-500 bg-red-50 text-red-900 ";
              else itemClass += "border-slate-100 text-slate-400 ";
            } else {
              if (selectedOption === idx) itemClass += "border-indigo-500 bg-indigo-50 text-indigo-900 font-bold ";
              else itemClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 ";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleSelect(idx)}
                className={itemClass}
                disabled={showResult}
              >
                <span>{opt}</span>
                {showResult && idx === currentQ.correctIndex && <Check className="text-green-600 w-5 h-5"/>}
                {showResult && idx === selectedOption && idx !== currentQ.correctIndex && <X className="text-red-500 w-5 h-5"/>}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800 mb-1">
                  {isCorrect ? '정답입니다! 👏' : '아쉽네요, 다시 생각해볼까요?'}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {!showResult ? (
            <button 
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all ${
                selectedOption === null ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              }`}
            >
              정답 확인
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
            >
              다음 문제 <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};