import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion, Difficulty } from '../types';
import { Check, X, BrainCircuit, Loader2 } from 'lucide-react';

interface QuizSectionProps {
  difficulty: Difficulty;
  onComplete: (score: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ difficulty, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [difficulty]);

  const loadQuestions = async () => {
    setLoading(true);
    setCurrentQIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedOption(null);
    
    const data = await generateQuizQuestions(difficulty);
    setQuestions(data);
    setLoading(false);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === questions[currentQIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      onComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-64">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500">AI가 퀴즈를 생성하고 있습니다...</p>
      </div>
    );
  }

  if (questions.length === 0) {
     return <div className="p-8 text-center text-slate-500">퀴즈 로드에 실패했습니다. 다시 시도해주세요.</div>
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" /> 
            개념 퀴즈 ({currentQIndex + 1}/{questions.length})
        </h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-mono">
            Score: {score}
        </span>
      </div>

      <div className="p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-6 min-h-[3.5rem]">{currentQ.question}</h4>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let itemClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                itemClass += "border-green-500 bg-green-50 text-green-900 font-bold";
              } else if (idx === selectedOption) {
                itemClass += "border-red-400 bg-red-50 text-red-900";
              } else {
                itemClass += "border-slate-100 opacity-50";
              }
            } else {
              itemClass += "border-slate-100 hover:border-indigo-400 hover:bg-slate-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={itemClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && <Check className="w-5 h-5 text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <X className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fade-in">
            <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-700 mb-4">
              <span className="font-bold text-indigo-600">해설:</span> {currentQ.explanation}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {currentQIndex < questions.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
