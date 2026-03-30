import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TabQuizProps {
    onScoreUpdate: (score: number) => void;
}

export const TabQuiz: React.FC<TabQuizProps> = ({ onScoreUpdate }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelect = (qId: number, optionIdx: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < QUIZ_QUESTIONS.length) {
            alert("모든 문제를 풀어주세요!");
            return;
        }

        let correctCount = 0;
        QUIZ_QUESTIONS.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correctCount++;
        });

        setScore(correctCount);
        setSubmitted(true);
        onScoreUpdate(correctCount);
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-2 text-slate-800">지식 체크 퀴즈</h2>
            <p className="text-slate-500 mb-8">퍼즐에서 배운 내용을 확인해보세요.</p>

            {submitted && (
                <div className="mb-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100 text-center animate-fade-in">
                    <h3 className="text-xl font-bold text-indigo-900 mb-2">
                        점수: {score} / {QUIZ_QUESTIONS.length}
                    </h3>
                    <p className="text-indigo-700">
                        {score === QUIZ_QUESTIONS.length ? "완벽합니다! 개념을 마스터하셨네요. 🎉" : "오답 노트를 확인하고 다시 도전해보세요!"}
                    </p>
                    <button onClick={handleRetry} className="mt-4 flex items-center justify-center gap-2 mx-auto text-sm text-indigo-600 hover:text-indigo-800 font-bold">
                        <RefreshCw className="w-4 h-4" /> 다시 풀기
                    </button>
                </div>
            )}

            <div className="space-y-8">
                {QUIZ_QUESTIONS.map((q, idx) => {
                    const isCorrect = answers[q.id] === q.correctAnswer;
                    const isWrong = submitted && !isCorrect;

                    return (
                        <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg mb-4 flex gap-2">
                                <span className="text-indigo-600">Q{idx + 1}.</span> {q.question}
                            </h3>
                            <div className="space-y-2">
                                {q.options.map((opt, oIdx) => (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleSelect(q.id, oIdx)}
                                        className={`w-full text-left p-3 rounded-lg text-sm transition-all border
                                            ${answers[q.id] === oIdx 
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-1 ring-indigo-500' 
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                            }
                                            ${submitted && oIdx === q.correctAnswer ? '!bg-green-100 !border-green-500 !text-green-800' : ''}
                                            ${submitted && answers[q.id] === oIdx && answers[q.id] !== q.correctAnswer ? '!bg-red-50 !border-red-500 !text-red-800' : ''}
                                        `}
                                        disabled={submitted}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            
                            {submitted && (
                                <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {isCorrect ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                                        {isCorrect ? "정답입니다!" : "오답입니다."}
                                    </div>
                                    <p>{q.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {!submitted && (
                <div className="mt-8 text-center">
                    <button 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                    >
                        제출 및 채점하기
                    </button>
                </div>
            )}
        </div>
    );
};
