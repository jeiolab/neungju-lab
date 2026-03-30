import React, { useState } from 'react';
import { QUIZ_DATA } from '../../constants';
import { Button } from '../Button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export const TabQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === QUIZ_DATA[currentIdx].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="p-8 pb-20 text-center animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">
        <div className="mb-6 inline-block p-6 rounded-full bg-blue-50">
          <CheckCircle className="w-16 h-16 text-blue-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">퀴즈 종료!</h2>
        <p className="text-xl text-gray-600 mb-8">
          당신의 점수는 <span className="font-bold text-blue-600">{score}</span> / {QUIZ_DATA.length} 점입니다.
        </p>
        <Button onClick={() => {
          setFinished(false);
          setCurrentIdx(0);
          setScore(0);
          setSelectedAnswer(null);
          setShowExplanation(false);
        }}>
          다시 도전하기
        </Button>
      </div>
    );
  }

  const question = QUIZ_DATA[currentIdx];

  return (
    <div className="p-4 pb-20 max-w-lg mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
        <span>Question {currentIdx + 1} / {QUIZ_DATA.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 min-h-[300px] flex flex-col justify-between mb-6 border border-gray-100">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-snug break-keep">
            {question.question}
          </h3>
        </div>

        {showExplanation && (
          <div className={`mt-6 p-4 rounded-xl text-sm animate-fade-in ${selectedAnswer === question.answer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-bold mb-1">
              {selectedAnswer === question.answer ? '정답입니다! 🎉' : '아쉽네요. 😅'}
            </p>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      {!showExplanation ? (
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAnswer(true)}
            className="h-16 rounded-2xl bg-white border-2 border-gray-200 text-blue-500 text-2xl font-black hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm"
          >
            O
          </button>
          <button 
             onClick={() => handleAnswer(false)}
             className="h-16 rounded-2xl bg-white border-2 border-gray-200 text-red-500 text-2xl font-black hover:border-red-500 hover:bg-red-50 transition-all shadow-sm"
          >
            X
          </button>
        </div>
      ) : (
        <Button onClick={nextQuestion} className="w-full h-14 text-lg">
          {currentIdx === QUIZ_DATA.length - 1 ? '결과 보기' : '다음 문제'}
        </Button>
      )}
    </div>
  );
};