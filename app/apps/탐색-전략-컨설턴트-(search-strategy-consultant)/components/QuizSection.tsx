import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { INITIAL_QUIZ } from '../constants';
import { getQuizFeedback } from '../services/geminiService';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Props {
  onScoreUpdate: (score: number) => void;
}

const QuizSection: React.FC<Props> = ({ onScoreUpdate }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = INITIAL_QUIZ[currentQIndex];

  const handleAnswer = async (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent double click
    
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 20); // 5 questions * 20 = 100
    }

    // Get AI Feedback (non-blocking for UI, but display when ready)
    const aiFeedback = await getQuizFeedback(currentQuestion.question, currentQuestion.options[optionIndex], isCorrect);
    setFeedback(aiFeedback || currentQuestion.explanation);
  };

  const nextQuestion = () => {
    if (currentQIndex < INITIAL_QUIZ.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      setIsFinished(true);
      onScoreUpdate(score + (selectedOption === currentQuestion.correctAnswer ? 20 : 0));
    }
  };

  if (isFinished) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">최종 점수</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score} <span className="text-2xl text-slate-400">/ 100</span></div>
        <p className="text-slate-600 mb-8">
            {score >= 80 ? "훌륭한 알고리즘 컨설턴트시군요! 🏆" : "조금 더 연습하면 완벽해질 거예요! 💪"}
        </p>
        <button 
            onClick={() => {
                setIsFinished(false);
                setCurrentQIndex(0);
                setScore(0);
                setSelectedOption(null);
                setFeedback(null);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
            다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-700">Quiz {currentQIndex + 1} / {INITIAL_QUIZ.length}</span>
            <span className="text-sm font-medium text-indigo-600">현재 점수: {score}</span>
        </div>
        
        <div className="p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
                {currentQuestion.question}
            </h3>

            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let btnClass = "w-full p-4 rounded-lg border-2 text-left transition-all relative ";
                    if (selectedOption === null) {
                        btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50";
                    } else {
                        if (idx === currentQuestion.correctAnswer) {
                            btnClass += "border-green-500 bg-green-50 text-green-800";
                        } else if (idx === selectedOption) {
                            btnClass += "border-red-500 bg-red-50 text-red-800";
                        } else {
                            btnClass += "border-slate-100 opacity-50";
                        }
                    }

                    return (
                        <button 
                            key={idx}
                            disabled={selectedOption !== null}
                            onClick={() => handleAnswer(idx)}
                            className={btnClass}
                        >
                            <span className="font-medium">{option}</span>
                            {selectedOption !== null && idx === currentQuestion.correctAnswer && (
                                <CheckCircle className="absolute right-4 top-4 text-green-600 w-5 h-5" />
                            )}
                            {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswer && (
                                <XCircle className="absolute right-4 top-4 text-red-600 w-5 h-5" />
                            )}
                        </button>
                    );
                })}
            </div>

            {feedback && (
                <div className="mt-6 p-4 bg-indigo-50 text-indigo-900 rounded-lg animate-fade-in border border-indigo-100">
                    <div className="flex gap-2 items-start">
                        <HelpCircle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-bold text-sm mb-1">피드백</p>
                            <p className="text-sm">{feedback}</p>
                        </div>
                    </div>
                </div>
            )}

            {selectedOption !== null && (
                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={nextQuestion}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
                    >
                        {currentQIndex < INITIAL_QUIZ.length - 1 ? "다음 문제" : "결과 보기"}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
