import React, { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Button } from './Button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export const QuizTab: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    setLoading(true);
    setScore(0);
    setCurrentQuestionIdx(0);
    setShowResult(false);
    setSelectedAnswer(null);
    try {
      const qs = await generateQuizQuestions();
      setQuestions(qs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === questions[currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // Helper for translating difficulty
  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
        case 'Easy': return '초급';
        case 'Medium': return '중급';
        case 'Hard': return '고급';
        default: return diff;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
        <p>Gemini AI가 맞춤형 퀴즈를 생성하고 있습니다...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="text-center p-12">
            <p className="text-red-500 mb-4">퀴즈를 불러오는데 실패했습니다. API 키 설정을 확인해주세요.</p>
            <Button onClick={loadQuiz}>다시 시도</Button>
        </div>
    )
  }

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-slate-800">지식 점검</h2>
        <span className="text-sm font-medium text-slate-500">문제 {currentQuestionIdx + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-semibold text-slate-900 leading-relaxed">
            {currentQ.question}
            </h3>
            <span className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase
                ${currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                  currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
            `}>
                {getDifficultyLabel(currentQ.difficulty)}
            </span>
        </div>

        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
            
            if (showResult) {
                if (idx === currentQ.correctAnswer) {
                    btnClass += "bg-green-50 border-green-500 text-green-900";
                } else if (idx === selectedAnswer) {
                    btnClass += "bg-red-50 border-red-500 text-red-900";
                } else {
                    btnClass += "border-slate-100 text-slate-400";
                }
            } else {
                btnClass += selectedAnswer === idx 
                    ? "border-indigo-600 bg-indigo-50" 
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={btnClass}
                disabled={showResult}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && idx === currentQ.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {showResult && idx === selectedAnswer && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg animate-fade-in">
                <p className="font-bold text-blue-900 mb-1">해설:</p>
                <p className="text-blue-800">{currentQ.explanation}</p>
                <div className="mt-4 flex justify-end">
                    {currentQuestionIdx < questions.length - 1 ? (
                        <Button onClick={nextQuestion}>다음 문제</Button>
                    ) : (
                        <div className="text-lg font-bold text-indigo-900">
                            퀴즈 완료! 점수: {score}/{questions.length}
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};