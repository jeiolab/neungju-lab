import React, { useState } from 'react';
import { QUIZ_POOL } from '../constants';
import { UserState } from '../types';
import { HelpCircle, Check, X } from 'lucide-react';

interface TabQuizProps {
  userState: UserState;
  onUpdateState: (newState: UserState) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ userState, onUpdateState }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'hard'>('all');

  const filteredQuiz = QUIZ_POOL.filter(q => difficulty === 'all' || q.difficulty === difficulty);
  const currentQuestion = filteredQuiz[currentQIndex];

  const handleAnswer = (idx: number) => {
    setSelectedOption(idx);
    setShowResult(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    
    // Save to history
    const newHistory = [...userState.quizHistory, {
      questionId: currentQuestion.id,
      isCorrect,
      date: new Date().toISOString()
    }];
    
    onUpdateState({
      ...userState,
      quizHistory: newHistory,
      totalPoints: isCorrect ? userState.totalPoints + 10 : userState.totalPoints
    });
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQIndex((prev) => (prev + 1) % filteredQuiz.length);
  };

  if (!currentQuestion) return <div className="p-8 text-center text-slate-500">해당 난이도의 퀴즈가 없습니다.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex gap-2">
          {['all', 'easy', 'hard'].map(d => (
            <button
              key={d}
              onClick={() => { setDifficulty(d as any); setCurrentQIndex(0); setShowResult(false); setSelectedOption(null); }}
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-colors ${difficulty === d ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {d === 'all' ? '전체' : d}
            </button>
          ))}
        </div>
        <span className="text-sm font-mono text-slate-400">
          Q.{currentQIndex + 1}/{filteredQuiz.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 pb-4">
           <span className={`inline-block mb-3 px-2 py-1 text-xs rounded font-bold ${currentQuestion.category === 'bias' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
             {currentQuestion.category.toUpperCase()}
           </span>
           <h3 className="text-xl font-bold text-slate-800 leading-normal">
             {currentQuestion.question}
           </h3>
        </div>

        <div className="p-6 pt-0 space-y-3">
          {currentQuestion.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all relative ";
            if (showResult) {
              if (idx === currentQuestion.correctIndex) btnClass += "border-green-500 bg-green-50 text-green-900 font-bold";
              else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-900";
              else btnClass += "border-slate-100 text-slate-400 opacity-60";
            } else {
              btnClass += "border-slate-100 hover:border-slate-300 text-slate-700 hover:bg-slate-50";
            }

            return (
              <button
                key={idx}
                disabled={showResult}
                onClick={() => handleAnswer(idx)}
                className={btnClass}
              >
                {opt}
                {showResult && idx === currentQuestion.correctIndex && <Check className="absolute right-4 top-4 text-green-600" size={20} />}
                {showResult && idx === selectedOption && idx !== currentQuestion.correctIndex && <X className="absolute right-4 top-4 text-red-600" size={20} />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="bg-slate-50 p-6 border-t border-slate-200 animate-fade-in">
             <div className="flex gap-2 items-start text-slate-700">
               <HelpCircle className="shrink-0 mt-1 text-indigo-500" size={20} />
               <div>
                 <p className="font-bold text-sm mb-1">해설</p>
                 <p className="text-sm leading-relaxed">{currentQuestion.explanation}</p>
               </div>
             </div>
             <button onClick={nextQuestion} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
               다음 문제
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;