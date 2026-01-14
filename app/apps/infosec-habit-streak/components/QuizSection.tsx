import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_POOL } from '../constants';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface QuizSectionProps {
  onQuizComplete: (score: number, incorrectTags: string[]) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onQuizComplete }) => {
  // Randomly select 5 questions for the session
  const [questions] = useState<QuizQuestion[]>(() => {
    const shuffled = [...QUIZ_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  });
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectTags, setIncorrectTags] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswer) {
      setScore(s => s + 20); // 5 questions * 20 = 100
    } else {
      setIncorrectTags(prev => [...prev, currentQ.conceptTag]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(curr => curr + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      onQuizComplete(
        selectedOption === currentQ.correctAnswer ? score + 20 : score,
        selectedOption === currentQ.correctAnswer ? incorrectTags : [...incorrectTags, currentQ.conceptTag]
      );
    }
  };

  if (quizFinished) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold mb-4">퀴즈 완료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score}점</div>
        <p className="text-gray-600 mb-8">
          {score === 100 ? '완벽해요! 정보보호 전문가시네요.' : '틀린 문제를 복습하면 더 강해질 거예요!'}
        </p>
        <button 
          onClick={() => window.location.reload()} // Simple reload to reset state for demo
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={20} /> 메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-500 font-medium">
        <span>Question {currentIdx + 1} / {questions.length}</span>
        <span className={`px-2 py-1 rounded ${currentQ.difficulty === '초급' ? 'bg-green-100 text-green-700' : currentQ.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          {currentQ.difficulty}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            
            if (isAnswered) {
              if (idx === currentQ.correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-gray-200 opacity-50";
              }
            } else {
              btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fade-in">
            <div className={`p-4 rounded-lg mb-4 flex items-start gap-3 ${selectedOption === currentQ.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {selectedOption === currentQ.correctAnswer 
                ? <CheckCircle className="flex-shrink-0 mt-0.5" size={20}/> 
                : <AlertCircle className="flex-shrink-0 mt-0.5" size={20}/>}
              <div>
                <p className="font-bold mb-1">{selectedOption === currentQ.correctAnswer ? '정답입니다!' : '오답입니다.'}</p>
                <p className="text-sm opacity-90">{currentQ.explanation}</p>
              </div>
            </div>
            <button
              onClick={nextQuestion}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition"
            >
              {currentIdx < questions.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
