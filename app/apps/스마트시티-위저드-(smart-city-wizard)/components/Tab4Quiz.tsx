import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

export const Tab4Quiz: React.FC<Props> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_DATA[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return; // Prevent change after selection
    setSelectedOption(idx);
    const correct = idx === question.answer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
      onComplete(score + (isCorrect ? 1 : 0)); // Add last point if correct
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setFinished(false);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  if (finished) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-lg border border-indigo-100 max-w-lg mx-auto mt-10">
        <h2 className="text-3xl font-bold text-indigo-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score * 10}점</div>
        <p className="text-slate-600 mb-8">총 {QUIZ_DATA.length}문제 중 {score}문제를 맞혔습니다.</p>
        <button 
          onClick={restart}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
        >
          <RotateCcw size={20} /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-400">Question {currentIdx + 1} / {QUIZ_DATA.length}</h2>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">현재 점수: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-indigo-500">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center
                ${selectedOption === null 
                  ? 'border-slate-100 hover:border-indigo-300 hover:bg-indigo-50' 
                  : selectedOption === idx
                    ? (isCorrect ? 'border-green-500 bg-green-50 text-green-800' : 'border-red-500 bg-red-50 text-red-800')
                    : idx === question.answer
                        ? 'border-green-500 bg-green-50 text-green-800' // Show correct answer if wrong
                        : 'border-slate-100 opacity-50'
                }
              `}
            >
              <span className="font-medium">{opt}</span>
              {selectedOption === idx && (
                isCorrect ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-500" />
              )}
            </button>
          ))}
        </div>

        {selectedOption !== null && (
            <div className="mt-6 animate-fade-in">
                <div className={`p-4 rounded-lg text-sm mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-indigo-50 text-indigo-800'}`}>
                    <p className="font-bold mb-1">{isCorrect ? "정답입니다!" : "아쉽네요."}</p>
                    <p>{question.explanation}</p>
                </div>
                <button 
                    onClick={handleNext}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                    다음 문제 <ArrowRight size={20} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};