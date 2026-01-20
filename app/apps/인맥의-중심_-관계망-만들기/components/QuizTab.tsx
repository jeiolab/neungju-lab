import React, { useState } from 'react';
import { QuizData, UserLevel, GraphData } from '../types';
import NetworkGraph from './NetworkGraph';
import { CheckCircle, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { INITIAL_GRAPH } from '../constants';

interface QuizTabProps {
  quizzes: QuizData[];
  userXP: number;
  onXPChange: (newXP: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ quizzes, userXP, onXPChange }) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentQuiz = quizzes[currentQuizIndex];
  const isCorrect = selectedOption === currentQuiz.correctAnswer;

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === currentQuiz.correctAnswer) {
      setFeedback("정답입니다! 훌륭한 분석이에요.");
      onXPChange(userXP + 50);
    } else {
      setFeedback("아쉽네요. 다시 그래프를 살펴보세요.");
    }
  };

  const handleNext = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              QUIZ {currentQuiz.id}
            </span>
            <span className="text-slate-400 text-sm">{currentQuizIndex + 1} / {quizzes.length}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQuiz.question}
          </h2>
          
          <div className="space-y-3">
            {currentQuiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                  isAnswered 
                    ? idx === currentQuiz.correctAnswer 
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : idx === selectedOption 
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-slate-100 text-slate-400'
                    : 'border-slate-200 hover:border-indigo-400 hover:bg-white bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isAnswered && idx === currentQuiz.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500"/>}
                    {isAnswered && idx === selectedOption && idx !== currentQuiz.correctAnswer && <XCircle className="w-5 h-5 text-red-500"/>}
                </div>
              </button>
            ))}
          </div>

          {isAnswered && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                <p className="font-bold mb-1">{isCorrect ? '해설:' : '오답 노트:'}</p>
                <p className="text-sm opacity-90">{currentQuiz.explanation}</p>
            </div>
          )}

          {isAnswered && currentQuizIndex < quizzes.length - 1 && (
             <button 
                onClick={handleNext}
                className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
             >
                다음 문제 <ArrowRight className="w-4 h-4" />
             </button>
          )}
          
          {isAnswered && currentQuizIndex === quizzes.length - 1 && (
             <div className="mt-6 text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-bold text-yellow-700">모든 퀴즈를 완료했습니다!</p>
             </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-fit sticky top-4">
        <h3 className="font-bold text-slate-500 mb-2 uppercase text-xs tracking-wider">Reference Graph</h3>
        <NetworkGraph data={INITIAL_GRAPH} height={400} />
      </div>
    </div>
  );
};

export default QuizTab;
