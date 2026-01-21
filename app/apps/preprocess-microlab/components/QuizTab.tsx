import React, { useState } from 'react';
import { QUIZ_QUESTIONS, BADGES } from '../constants';
import { UserState } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface Props {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const QuizTab: React.FC<Props> = ({ userState, setUserState }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (showExplanation) return; // Prevent changing after selection
    setSelectedOption(index);
    setShowExplanation(true);
    
    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 10);
      setUserState(prev => ({
          ...prev, 
          xp: prev.xp + 5,
          quizHistory: { ...prev.quizHistory, [question.id]: true }
      }));
    } else {
      setUserState(prev => ({
          ...prev, 
          quizHistory: { ...prev.quizHistory, [question.id]: false }
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      if (score >= 80) {
        setUserState(prev => ({
             ...prev, 
             xp: prev.xp + 50,
             badges: prev.badges.includes(BADGES.QUIZ_MASTER.id) ? prev.badges : [...prev.badges, BADGES.QUIZ_MASTER.id]
        }));
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-10 animate-in zoom-in duration-300">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score}점</div>
        <p className="text-slate-500 mb-8">
          {score >= 80 ? "대단해요! 전처리 전문가가 다 되었네요!" : "조금 더 공부해보면 완벽할 거예요!"}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> 다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-400">Question {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="text-sm font-bold text-indigo-600">Score: {score}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-6 min-h-[200px]">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all font-medium ";
            
            if (showExplanation) {
              if (idx === question.correctIndex) btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
              else if (idx === selectedOption) btnClass += "border-rose-500 bg-rose-50 text-rose-800";
              else btnClass += "border-slate-100 text-slate-400 opacity-50";
            } else {
              btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showExplanation}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                   <span>{option}</span>
                   {showExplanation && idx === question.correctIndex && <Check className="w-5 h-5 text-emerald-600" />}
                   {showExplanation && idx === selectedOption && idx !== question.correctIndex && <X className="w-5 h-5 text-rose-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
           <div className="bg-slate-100 p-5 rounded-xl mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase">해설</span>
              <p className="text-slate-800 mt-1">{question.explanation}</p>
           </div>
           <button 
             onClick={handleNext}
             className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md"
           >
             {currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? "결과 보기" : "다음 문제"}
           </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;
