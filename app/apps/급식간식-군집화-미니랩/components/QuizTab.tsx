import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface QuizTabProps {
  onSolve: (isCorrect: boolean, quizId: string) => void;
  solvedIds: string[];
}

const QuizTab: React.FC<QuizTabProps> = ({ onSolve, solvedIds }) => {
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('easy');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentResult, setCurrentResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Filter questions by difficulty
  const questions = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
  
  // Find first unsolved question or pick random if all solved
  const activeQuestionIndex = questions.findIndex(q => !solvedIds.includes(q.id));
  const activeQuestion = activeQuestionIndex !== -1 ? questions[activeQuestionIndex] : questions[Math.floor(Math.random() * questions.length)];
  const isAllSolved = activeQuestionIndex === -1 && solvedIds.length >= questions.length;

  const handleAnswer = (index: number) => {
    if (currentResult !== null) return; // Prevent multiple clicks

    setSelectedAnswer(index);
    const isCorrect = index === activeQuestion.correctIndex;
    setCurrentResult(isCorrect ? 'correct' : 'incorrect');
    onSolve(isCorrect, activeQuestion.id);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setCurrentResult(null);
  };

  return (
    <div className="pb-20 space-y-6">
      <div className="flex justify-center space-x-2">
        {(['easy', 'normal', 'hard'] as const).map((d) => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); handleNext(); }}
            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
              difficulty === d 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {d === 'easy' ? '쉬움' : d === 'normal' ? '보통' : '도전'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 min-h-[400px]">
        <div className="p-6 bg-indigo-50 border-b border-indigo-100">
          <h2 className="text-xl font-bold text-gray-800">
            Q. {activeQuestion.question}
          </h2>
        </div>
        
        <div className="p-6 space-y-4">
          {activeQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            if (currentResult === null) {
              btnClass += "border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700";
            } else {
               if (idx === activeQuestion.correctIndex) {
                 btnClass += "border-green-500 bg-green-50 text-green-700";
               } else if (idx === selectedAnswer) {
                 btnClass += "border-red-500 bg-red-50 text-red-700";
               } else {
                 btnClass += "border-gray-100 text-gray-400";
               }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={currentResult !== null}
                className={btnClass}
              >
                {idx + 1}. {option}
              </button>
            );
          })}
        </div>

        {currentResult && (
          <div className={`p-6 border-t ${currentResult === 'correct' ? 'bg-green-50' : 'bg-red-50'} animate-fade-in`}>
            <div className="flex items-center mb-2">
              {currentResult === 'correct' ? (
                <CheckCircle className="text-green-600 mr-2" />
              ) : (
                <XCircle className="text-red-600 mr-2" />
              )}
              <h3 className={`font-bold ${currentResult === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {currentResult === 'correct' ? '정답입니다! (+20점)' : '아쉬워요!'}
              </h3>
            </div>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              <strong>해설:</strong> {activeQuestion.explanation}
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center justify-center"
            >
              <RefreshCw size={18} className="mr-2" />
              다음 문제 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;