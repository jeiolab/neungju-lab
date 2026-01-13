import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { UserStats, QuizQuestion } from '../types';
import { HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TabQuizProps {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ userStats, updateStats }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [history, setHistory] = useState<number[]>([]); // Array of question IDs answered incorrectly

  const question = QUIZ_DATA[currentQIndex];

  const handleAnswer = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent double click
    setSelectedOption(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === question.correctIndex;
    let newXp = userStats.xp;
    let newStreak = userStats.streak;
    let newMastery = { ...userStats.mastery };
    
    if (isCorrect) {
      newXp += 8;
      newStreak += 1;
      // Simple mastery logic based on tag
      if (question.tag === 'indexing') newMastery.indexing += 10;
      if (question.tag === 'slicing') newMastery.slicing += 10;
      if (question.tag === 'dimension' || question.tag === 'structure') newMastery.dimension += 10;
    } else {
      newXp = Math.max(0, newXp - 2); // Less harsh penalty
      newStreak = 0;
      setHistory([...history, question.id]);
    }

    updateStats({
      xp: newXp,
      streak: newStreak,
      mastery: newMastery
    });
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const isFinished = currentQIndex >= QUIZ_DATA.length - 1 && showExplanation;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
         <span>문제 {currentQIndex + 1} / {QUIZ_DATA.length}</span>
         <span className="font-mono text-indigo-600">Streak: {userStats.streak} 🔥</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300" 
          style={{ width: `${((currentQIndex + (showExplanation ? 1 : 0)) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-3">
            {question.tag}
          </span>
          <h3 className="text-xl font-bold text-slate-800">{question.question}</h3>
        </div>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let btnClass = "w-full p-4 text-left rounded-lg border-2 transition-all font-medium ";
            if (selectedOption === null) {
              btnClass += "border-slate-100 hover:border-indigo-300 hover:bg-slate-50 text-slate-600";
            } else {
              if (idx === question.correctIndex) {
                btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700";
              } else if (idx === selectedOption) {
                btnClass += "bg-rose-50 border-rose-400 text-rose-700";
              } else {
                btnClass += "border-slate-100 text-slate-300";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {selectedOption !== null && idx === question.correctIndex && <CheckCircle2 size={20} />}
                  {selectedOption !== null && idx === selectedOption && idx !== question.correctIndex && <AlertCircle size={20} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fadeIn">
            <div className="flex gap-3 mb-4">
               <HelpCircle className="text-indigo-500 mt-1" size={20} />
               <div>
                 <h4 className="font-bold text-slate-800 text-sm mb-1">해설</h4>
                 <p className="text-slate-600 text-sm leading-relaxed">{question.explanation}</p>
               </div>
            </div>
            
            {!isFinished ? (
              <button 
                onClick={nextQuestion}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
              >
                다음 문제
              </button>
            ) : (
              <div className="text-center p-4 bg-indigo-50 rounded-lg text-indigo-800 font-bold">
                퀴즈 완료! 미해결 개념을 오답노트에서 확인하세요.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Weakness Check */}
      {history.length > 0 && isFinished && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-xl">
           <h4 className="font-bold text-rose-700 mb-2 flex items-center gap-2">
             <AlertCircle size={18} /> 오답 노트 (재도전 추천)
           </h4>
           <ul className="list-disc list-inside text-sm text-rose-600 space-y-1">
             {history.map(id => {
               const q = QUIZ_DATA.find(q => q.id === id);
               return <li key={id}>{q?.tag}: 개념을 다시 복습해보세요.</li>
             })}
           </ul>
        </div>
      )}
    </div>
  );
};

export default TabQuiz;