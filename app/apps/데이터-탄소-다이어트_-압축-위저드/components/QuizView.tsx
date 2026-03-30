import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { UserState } from '../types';

interface QuizViewProps {
  userState: UserState;
  onQuizAnswer: (qId: number, isCorrect: boolean) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ userState, onQuizAnswer }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const question = QUIZ_DATA[currentQIndex];
  const isMastered = userState.quizMastery[question.id];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">퀴즈 챌린지</h2>
        <span className="text-sm font-mono text-gray-500">{currentQIndex + 1} / {QUIZ_DATA.length}</span>
      </div>

      <div className="mb-8">
         <div className="flex gap-2 mb-3">
           <span className={`text-xs px-2 py-1 rounded font-bold ${question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' : question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
             {question.difficulty}
           </span>
           {isMastered && <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-bold">마스터함</span>}
         </div>
         <p className="text-lg font-medium text-gray-800">{question.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => {
              const correct = idx === question.correctIndex;
              onQuizAnswer(question.id, correct);
              if (correct) {
                 alert("정답입니다! 🎉");
                 if(currentQIndex < QUIZ_DATA.length - 1) {
                     setCurrentQIndex(prev => prev + 1);
                     setShowExplanation(false);
                 }
              } else {
                 alert("틀렸습니다. 다시 생각해보세요! 🤔");
                 setShowExplanation(true);
              }
            }}
            className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition"
          >
            {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6 animate-fadeIn">
          <p className="text-sm text-blue-800 font-bold mb-1">💡 해설</p>
          <p className="text-sm text-blue-700">{question.explanation}</p>
        </div>
      )}

      <div className="flex justify-between mt-8 border-t pt-6">
         <button onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))} className="text-gray-500 hover:text-gray-800">이전 문제</button>
         <button onClick={() => setCurrentQIndex(Math.min(QUIZ_DATA.length - 1, currentQIndex + 1))} className="text-gray-500 hover:text-gray-800">다음 문제</button>
      </div>
    </div>
  );
};

export default QuizView;
