import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Check, X, HelpCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizSectionProps {
  onCorrect: (id: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ onCorrect }) => {
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);

  const openQuestion = (id: number) => {
    setCurrentId(id);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleCheck = () => {
    if (currentId === null) return;
    const q = QUIZ_QUESTIONS.find(q => q.id === currentId);
    if (!q) return;

    const isCorrect = userAnswer.trim().toUpperCase() === String(q.answer).toUpperCase();
    
    setFeedback(isCorrect ? 'CORRECT' : 'WRONG');
    if (isCorrect && !completed.includes(currentId)) {
        setCompleted([...completed, currentId]);
        onCorrect(currentId);
    }
  };

  const currentQ = QUIZ_QUESTIONS.find(q => q.id === currentId);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <HelpCircle className="text-purple-600" /> 개념 확인 퀴즈
        </h2>

        {/* List View */}
        {!currentQ && (
            <div className="grid gap-3">
                {QUIZ_QUESTIONS.map(q => {
                    const isDone = completed.includes(q.id);
                    let diffColor = 'bg-green-100 text-green-700';
                    if (q.difficulty === 'NORMAL') diffColor = 'bg-yellow-100 text-yellow-700';
                    if (q.difficulty === 'HARD') diffColor = 'bg-red-100 text-red-700';

                    return (
                        <button 
                            key={q.id}
                            onClick={() => openQuestion(q.id)}
                            className={`flex items-center justify-between p-4 rounded-lg border text-left hover:bg-slate-50 transition ${isDone ? 'opacity-60 bg-slate-50' : ''}`}
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${diffColor}`}>
                                        {q.difficulty}
                                    </span>
                                    {isDone && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check size={12}/> 완료</span>}
                                </div>
                                <span className="font-medium text-slate-800 line-clamp-1">{q.question}</span>
                            </div>
                            <span className="text-slate-400">➡️</span>
                        </button>
                    )
                })}
            </div>
        )}

        {/* Question View */}
        {currentQ && (
            <div className="space-y-6">
                <button onClick={() => setCurrentId(null)} className="text-sm text-slate-500 hover:text-slate-800">
                    ← 목록으로 돌아가기
                </button>
                
                <div>
                    <span className="text-xs font-bold text-purple-600 mb-2 block">{currentQ.difficulty} QUESTION</span>
                    <h3 className="text-lg font-bold text-slate-900">{currentQ.question}</h3>
                </div>

                <div className="space-y-3">
                    {currentQ.type === 'OX' && ['O', 'X'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setUserAnswer(opt)}
                            disabled={feedback === 'CORRECT'}
                            className={`w-full p-4 rounded-lg border-2 font-bold text-xl transition ${userAnswer === opt ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-300'}`}
                        >
                            {opt}
                        </button>
                    ))}

                    {currentQ.type === 'MULTIPLE' && currentQ.options?.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setUserAnswer(opt)}
                            disabled={feedback === 'CORRECT'}
                            className={`w-full p-3 rounded-lg border-2 text-left transition ${userAnswer === opt ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-purple-300'}`}
                        >
                            {opt}
                        </button>
                    ))}

                    {currentQ.type === 'SHORT' && (
                         <input 
                            type="text" 
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={feedback === 'CORRECT'}
                            placeholder="정답 입력"
                            className="w-full p-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none"
                         />
                    )}
                </div>

                {feedback === null && (
                    <button 
                        onClick={handleCheck}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800"
                    >
                        정답 확인
                    </button>
                )}

                {feedback === 'CORRECT' && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 animate-fade-in">
                        <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                            <Check /> 정답입니다!
                        </div>
                        <p className="text-sm text-green-800">{currentQ.explanation}</p>
                        <button onClick={() => setCurrentId(null)} className="mt-4 w-full bg-green-600 text-white py-2 rounded font-bold">다음 문제</button>
                    </div>
                )}

                {feedback === 'WRONG' && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                            <X /> 틀렸습니다.
                        </div>
                        <p className="text-sm text-red-600 mb-3">다시 생각해보세요.</p>
                        <button onClick={() => setFeedback(null)} className="text-sm underline text-red-700">다시 시도</button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default QuizSection;
