import React, { useState } from 'react';
import { QUIZZES } from '../data';
import { UserStats } from '../types';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface Props {
  userStats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
}

const QuizTab: React.FC<Props> = ({ userStats, onUpdateStats }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZZES[currentQIndex];

  const handleAnswer = () => {
    if (selectedOption === null) return;
    setShowResult(true);

    const isCorrect = selectedOption === question.answer;
    
    // Update mastery if correct
    if (isCorrect) {
      const newMastery = { ...userStats.mastery };
      const current = newMastery[question.relatedConceptId] || 0;
      newMastery[question.relatedConceptId] = Math.min(100, current + 10);
      
      onUpdateStats({
        ...userStats,
        mastery: newMastery
      });
    } else {
        // Add to review queue if wrong
        if (!userStats.reviewQueue.includes(question.relatedConceptId)) {
            onUpdateStats({
                ...userStats,
                reviewQueue: [...userStats.reviewQueue, question.relatedConceptId]
            });
        }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQIndex((prev) => (prev + 1) % QUIZZES.length);
  };

  return (
    <div className="max-w-xl mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentQIndex + 1) / QUIZZES.length) * 100}%` }}
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
            <span className="text-slate-400 text-sm">문제 {currentQIndex + 1} / {QUIZZES.length}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-snug">{question.question}</h3>

          <div className="space-y-3">
            {question.options?.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              
              if (showResult) {
                if (idx === question.answer) btnClass += "bg-green-50 border-green-500 text-green-900";
                else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-900";
                else btnClass += "bg-slate-50 border-slate-100 opacity-50";
              } else {
                btnClass += selectedOption === idx 
                  ? "border-indigo-500 bg-indigo-50 text-indigo-900" 
                  : "border-slate-200 hover:border-indigo-300 bg-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedOption(idx)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                         showResult && idx === question.answer ? 'bg-green-500 text-white border-green-500' : 'border-slate-300'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 animate-fadeIn">
              <div className={`p-4 rounded-lg mb-4 ${selectedOption === question.answer ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {selectedOption === question.answer ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                  <div>
                    <h4 className={`font-bold text-sm ${selectedOption === question.answer ? 'text-green-800' : 'text-red-800'}`}>
                      {selectedOption === question.answer ? '정답입니다!' : '오답입니다.'}
                    </h4>
                    <p className="text-sm text-slate-700 mt-1">{question.explanation}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleNext}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 flex items-center justify-center gap-2"
              >
                다음 문제 <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleAnswer}
              disabled={selectedOption === null}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              정답 확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;