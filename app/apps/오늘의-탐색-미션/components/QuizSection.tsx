import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateDailyQuiz } from '../services/geminiService';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface QuizSectionProps {
  onComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      const qs = await generateDailyQuiz("DFS vs BFS");
      setQuestions(qs);
      setLoading(false);
    };
    loadQuiz();
  }, []);

  const handleOptionClick = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowResult(true);
    
    if (idx === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      onComplete(score + (selectedOption === questions[currentIdx].correctIndex ? 0 : 0)); // Score already updated
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400">AI 퀴즈 생성 중...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="text-center py-8 bg-slate-800/50 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">퀴즈 완료!</h3>
        <p className="text-4xl font-bold text-blue-400 mb-2">{score} / {questions.length}</p>
        <p className="text-slate-400">오늘의 지식 획득 완료.</p>
      </div>
    );
  }

  const question = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
         <span className="text-sm font-mono text-slate-500">문제 {currentIdx + 1}/{questions.length}</span>
         <span className="text-sm font-bold text-slate-300">점수: {score}</span>
      </div>

      <h3 className="text-xl font-semibold mb-6 text-white min-h-[60px]">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => {
          let stateStyles = "bg-slate-800 hover:bg-slate-700 border-slate-700";
          if (selectedOption !== null) {
            if (idx === question.correctIndex) stateStyles = "bg-green-900/40 border-green-500 text-green-200";
            else if (idx === selectedOption) stateStyles = "bg-red-900/40 border-red-500 text-red-200";
            else stateStyles = "bg-slate-800 opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={selectedOption !== null}
              className={`w-full p-4 rounded-lg border text-left transition-all ${stateStyles}`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selectedOption !== null && idx === question.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-500"/>}
                {selectedOption !== null && idx === selectedOption && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-500"/>}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="bg-slate-900/50 p-4 rounded-lg mb-6 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <p className="text-slate-300 text-sm"><span className="font-bold text-blue-400">해설:</span> {question.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={handleNext}
          disabled={selectedOption === null}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {currentIdx === questions.length - 1 ? "완료" : "다음 문제"}
        </button>
      </div>
    </div>
  );
};

export default QuizSection;