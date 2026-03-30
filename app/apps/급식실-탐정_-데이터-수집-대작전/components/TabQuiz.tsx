import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { UserState } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface Props {
  userState: UserState;
  updateUserState: (newState: Partial<UserState>) => void;
}

const TabQuiz: React.FC<Props> = ({ userState, updateUserState }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = QUIZ_QUESTIONS[currentQIndex];

  const handleAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === question.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
        // Add to wrong note
        const wrongNote = {
            id: `quiz-${question.id}-${Date.now()}`,
            question: question.question,
            yourAnswer: question.options[optionIndex],
            correctAnswer: question.options[question.correctIndex],
            explanation: question.explanation,
            timestamp: Date.now()
        };
        updateUserState({
            wrongAnswers: [wrongNote, ...userState.wrongAnswers]
        });
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      // Reward coins for quiz completion
      if (score >= 7) {
        updateUserState({ coins: userState.coins + (score * 2) });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 mb-4">{score * 10}점</div>
        <p className="text-slate-600 mb-8">
          총 {QUIZ_QUESTIONS.length}문제 중 <strong>{score}</strong>문제를 맞혔어요!<br/>
          {score >= 8 ? '대단해요! 데이터 마스터시네요!' : '조금만 더 공부하면 완벽할 거예요!'}
        </p>
        <button
          onClick={restartQuiz}
          className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          <RefreshCw className="w-5 h-5" /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Question {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span className="text-sm text-slate-400">Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
               let btnClass = "w-full text-left p-4 rounded-xl border-2 transition relative ";
               if (isAnswered) {
                 if (idx === question.correctIndex) {
                   btnClass += "border-green-500 bg-green-50 text-green-900";
                 } else if (idx === selectedOption) {
                   btnClass += "border-red-500 bg-red-50 text-red-900";
                 } else {
                   btnClass += "border-slate-100 text-slate-400 opacity-60";
                 }
               } else {
                 btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-700";
               }

               return (
                 <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                 >
                   <span className="font-medium">{idx + 1}. {opt}</span>
                   {isAnswered && idx === question.correctIndex && <Check className="absolute right-4 top-4 text-green-600" />}
                   {isAnswered && idx === selectedOption && idx !== question.correctIndex && <X className="absolute right-4 top-4 text-red-600" />}
                 </button>
               )
            })}
          </div>
        </div>

        {isAnswered && (
          <div className="bg-slate-50 p-6 border-t border-slate-100">
            <div className="mb-4">
               <span className="font-bold text-slate-900">해설:</span>
               <p className="text-slate-600 mt-1 text-sm">{question.explanation}</p>
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
            >
              {currentQIndex < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;
