import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface Props {
    onComplete: (score: number) => void;
}

const TabQuiz: React.FC<Props> = ({ onComplete }) => {
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleInput = (id: number, value: string) => {
        setUserAnswers(prev => ({ ...prev, [id]: value }));
    };

    const checkAnswer = (q: QuizQuestion, input: string): boolean => {
        if (!input) return false;
        
        if (q.type === '객관식' || q.type === '단답형') {
            return input.trim().toLowerCase() === (q.answer as string).toLowerCase();
        } else {
            // Essay type: Check if key keywords exist
            const keywords = q.answer as string[];
            return keywords.every(k => input.includes(k));
        }
    };

    const handleSubmit = () => {
        let correctCount = 0;
        QUIZZES.forEach(q => {
            if (checkAnswer(q, userAnswers[q.id] || '')) {
                correctCount++;
            }
        });
        setScore(correctCount * 10);
        setSubmitted(true);
        onComplete(correctCount * 10);
    };

    const resetQuiz = () => {
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
        window.scrollTo(0,0);
    };

    if (submitted) {
        return (
            <div className="pb-10 max-w-3xl mx-auto">
                <div className="bg-indigo-600 text-white p-10 rounded-3xl text-center mb-8 shadow-xl">
                    <p className="text-indigo-200 font-bold mb-2 uppercase tracking-wide">최종 점수</p>
                    <h2 className="text-6xl font-black mb-6">{score}점</h2>
                    <p className="text-lg opacity-90 mb-8">{score >= 80 ? '훌륭합니다! 보안 전문가시군요.' : '오답노트를 확인하고 다시 도전해보세요.'}</p>
                    <button 
                        onClick={resetQuiz} 
                        className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-base hover:bg-indigo-50 transition-colors flex items-center mx-auto shadow-md"
                    >
                        <RefreshCw size={20} className="mr-2"/> 재시험 치기
                    </button>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 mb-6 px-2">📝 오답 노트</h3>
                <div className="space-y-6">
                    {QUIZZES.map(q => {
                        const isCorrect = checkAnswer(q, userAnswers[q.id] || '');
                        if (isCorrect) return null; // Only show wrong answers

                        return (
                            <div key={q.id} className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 p-2 rounded-full shrink-0">
                                        <XCircle className="text-red-500" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 text-xl mb-3">Q. {q.question}</p>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-100">
                                                <span className="font-bold block mb-1">내 답안</span>
                                                {userAnswers[q.id] || '(작성 안 함)'}
                                            </div>
                                            <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                                                <span className="font-bold block mb-1">정답</span>
                                                {Array.isArray(q.answer) ? q.answer.join(', ') + ' 포함' : q.answer}
                                            </div>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {score === 100 && <div className="text-center text-slate-500 py-10 bg-white rounded-2xl border border-slate-100">틀린 문제가 없습니다. 완벽해요! 🎉</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10 max-w-3xl mx-auto">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">최종 보안 능력 평가</h2>
                <p className="text-slate-500 text-lg">총 10문제. 서술형은 핵심 키워드가 포함되어야 정답 처리됩니다.</p>
             </div>

            {QUIZZES.map((q, idx) => (
                <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex justify-between mb-4">
                        <span className="font-bold text-slate-400 text-lg">Q{idx + 1}</span>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">{q.type}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-800 mb-6">{q.question}</p>
                    
                    {q.type === '객관식' && q.options && (
                        <div className="space-y-3">
                            {q.options.map((opt) => (
                                <label key={opt} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    userAnswers[q.id] === opt 
                                        ? 'bg-indigo-50 border-indigo-500 shadow-sm' 
                                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-300'
                                }`}>
                                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                                         userAnswers[q.id] === opt ? 'border-indigo-600' : 'border-slate-300'
                                    }`}>
                                        {userAnswers[q.id] === opt && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                    </div>
                                    <input 
                                        type="radio" 
                                        name={`q-${q.id}`} 
                                        value={opt} 
                                        onChange={(e) => handleInput(q.id, e.target.value)}
                                        checked={userAnswers[q.id] === opt}
                                        className="hidden"
                                    />
                                    <span className={`text-base ${userAnswers[q.id] === opt ? 'text-indigo-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {(q.type === '단답형' || q.type === '서술형') && (
                        <input
                            type="text"
                            placeholder="답안을 입력하세요"
                            value={userAnswers[q.id] || ''}
                            onChange={(e) => handleInput(q.id, e.target.value)}
                            className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg"
                        />
                    )}
                </div>
            ))}

            <div className="sticky bottom-4">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl shadow-2xl hover:bg-slate-800 transform hover:-translate-y-1 transition-all"
                >
                    제출하고 채점하기
                </button>
            </div>
        </div>
    );
};

export default TabQuiz;