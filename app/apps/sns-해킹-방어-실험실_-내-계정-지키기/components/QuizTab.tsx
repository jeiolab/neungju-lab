'use client';

import React, { useState } from 'react';
import { QuizQuestion, QuizDifficulty } from '../types';
import { INITIAL_QUIZZES } from '../constants';
import { generateQuizQuestion, evaluateChallengeAnswer } from '../services/gemini';
import { BrainCircuit, CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export const QuizTab: React.FC = () => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('EASY');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{isCorrect: boolean; text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setFeedback(null);
    setUserAnswer('');
    
    // First try to find a local question
    const localQ = INITIAL_QUIZZES.find(q => q.difficulty === difficulty && Math.random() > 0.5); // Randomly pick local or gen
    
    if (localQ && Math.random() > 0.3) {
       setCurrentQuestion(localQ);
       setLoading(false);
    } else {
       // If no local match or random chance, generate via Gemini
       const genQ = await generateQuizQuestion(difficulty, []);
       if (genQ) {
         setCurrentQuestion(genQ);
       } else {
         setCurrentQuestion(INITIAL_QUIZZES[0]); // Fallback
       }
       setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion) return;

    if (currentQuestion.difficulty === 'EASY' && currentQuestion.correctAnswer) {
        // Objective check
        const isCorrect = userAnswer === currentQuestion.correctAnswer;
        setFeedback({
            isCorrect,
            text: isCorrect ? "정답입니다! " + (currentQuestion.explanation || "") : "오답입니다. " + (currentQuestion.explanation || "")
        });
    } else if (currentQuestion.difficulty === 'NORMAL') {
        // Short answer simple check (case insensitive inclusion)
        const isCorrect = currentQuestion.correctAnswer ? userAnswer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase()) : false;
         setFeedback({
            isCorrect,
            text: isCorrect ? "정답입니다! " : `정답은 "${currentQuestion.correctAnswer}" 입니다. ` + (currentQuestion.explanation || "")
        });
    } else {
        // Challenge: Gemini Grading
        setLoading(true);
        const evalResult = await evaluateChallengeAnswer(currentQuestion.question, userAnswer);
        setFeedback({
            isCorrect: evalResult.isCorrect,
            text: `${evalResult.feedback} (점수: ${evalResult.score}점)`
        });
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="text-purple-600" />
            보안 퀴즈 챌린지
        </h2>

        {/* Difficulty Selector */}
        <div className="flex gap-2 mb-6">
            {(['EASY', 'NORMAL', 'CHALLENGE'] as QuizDifficulty[]).map((d) => (
                <button
                    key={d}
                    onClick={() => { setDifficulty(d); setCurrentQuestion(null); setFeedback(null); }}
                    className={clsx(
                        "px-4 py-2 rounded-full text-sm font-bold transition-colors flex-1",
                        difficulty === d ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                >
                    {d === 'EASY' ? '쉬움' : d === 'NORMAL' ? '보통' : '도전'}
                </button>
            ))}
        </div>

        {!currentQuestion ? (
            <div className="text-center py-10">
                <p className="text-slate-500 mb-6">난이도를 선택하고 퀴즈를 시작하세요.</p>
                <button 
                    onClick={startQuiz}
                    disabled={loading}
                    className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "퀴즈 시작"}
                </button>
            </div>
        ) : (
            <div className="animate-fade-in">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6">
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded mb-2 inline-block">Q.</span>
                    <h3 className="text-lg font-bold text-slate-800">{currentQuestion.question}</h3>
                </div>

                <div className="mb-6">
                    {currentQuestion.options ? (
                        <div className="space-y-2">
                            {currentQuestion.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => setUserAnswer(opt)}
                                    disabled={!!feedback}
                                    className={clsx(
                                        "w-full text-left p-4 rounded-xl border-2 transition-all font-medium",
                                        userAnswer === opt 
                                            ? "border-purple-500 bg-purple-50 text-purple-900" 
                                            : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <textarea
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder={difficulty === 'CHALLENGE' ? "2~3문장으로 이유를 서술하세요..." : "정답을 입력하세요..."}
                            disabled={!!feedback}
                            className="w-full p-4 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 min-h-[100px]"
                        />
                    )}
                </div>

                {!feedback ? (
                     <button 
                        onClick={submitAnswer}
                        disabled={loading || !userAnswer}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "정답 제출하기"}
                    </button>
                ) : (
                    <div className={clsx(
                        "p-5 rounded-xl border mb-6",
                        feedback.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}>
                        <div className="flex items-center gap-2 font-bold text-lg mb-2">
                            {feedback.isCorrect ? (
                                <span className="text-green-700 flex items-center gap-2"><CheckCircle2 /> 정답!</span>
                            ) : (
                                <span className="text-red-700 flex items-center gap-2"><XCircle /> 오답</span>
                            )}
                        </div>
                        <p className="text-slate-700">{feedback.text}</p>
                        
                        <button 
                            onClick={startQuiz}
                            className="mt-4 bg-white border border-slate-300 px-4 py-2 rounded-lg font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                            다음 문제 <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};