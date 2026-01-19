import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { QuizQuestion } from '../types';

interface QuizTabProps {
  onComplete: (correctCount: number, wrongIds: number[]) => void;
  previousWrongIds: number[];
}

const QuizTab: React.FC<QuizTabProps> = ({ onComplete, previousWrongIds }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [localWrongIds, setLocalWrongIds] = useState<number[]>([]);

  const question = QUIZ_DATA[currentIdx];
  const isLastQuestion = currentIdx === QUIZ_DATA.length - 1;

  const handleConfirm = () => {
    setIsConfirmed(true);
    if (selectedOption === question.correctIndex) {
      setScore(s => s + 1);
    } else {
      setLocalWrongIds(prev => [...prev, question.id]);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score + (selectedOption === question.correctIndex ? 1 : 0), localWrongIds);
    } else {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    }
  };

  // Render Result Screen if complete (handled by parent usually, but good to show state)
  if (currentIdx >= QUIZ_DATA.length) {
    return <div>Quiz Completed</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIdx) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="flex justify-between items-center mb-6">
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>
                {question.difficulty}
            </span>
            <span className="text-slate-400 font-mono text-sm">Q.{currentIdx + 1} / {QUIZ_DATA.length}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-6">{question.question}</h3>

        <div className="space-y-3">
            {question.options.map((option, idx) => (
                <button
                    key={idx}
                    disabled={isConfirmed}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isConfirmed 
                            ? idx === question.correctIndex 
                                ? 'border-green-500 bg-green-50' 
                                : idx === selectedOption 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                            : idx === selectedOption 
                                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                : 'border-slate-200 hover:border-indigo-300'
                    }`}
                >
                    <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                             isConfirmed 
                             ? idx === question.correctIndex 
                                 ? 'border-green-500 text-green-600 bg-white' 
                                 : idx === selectedOption 
                                     ? 'border-red-500 text-red-600 bg-white'
                                     : 'border-slate-300'
                             : idx === selectedOption
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300'
                        }`}>
                            {idx === question.correctIndex && isConfirmed ? '✓' : idx === selectedOption && isConfirmed ? '✕' : String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-slate-800">{option}</span>
                    </div>
                </button>
            ))}
        </div>

        {isConfirmed && (
            <div className={`mt-6 p-4 rounded-lg ${selectedOption === question.correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-bold mb-1">{selectedOption === question.correctIndex ? '정답입니다!' : '아쉽네요.'}</p>
                <p className="text-sm opacity-90">{question.explanation}</p>
            </div>
        )}

        <div className="mt-8 flex justify-end">
            {!isConfirmed ? (
                <button 
                    onClick={handleConfirm}
                    disabled={selectedOption === null}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 transition-colors shadow-sm"
                >
                    확인하기
                </button>
            ) : (
                <button 
                    onClick={handleNext}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm"
                >
                    {isLastQuestion ? '결과 보기' : '다음 문제'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
