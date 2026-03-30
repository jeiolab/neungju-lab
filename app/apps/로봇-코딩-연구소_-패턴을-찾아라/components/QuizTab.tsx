import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { getQuizHint } from '../services/geminiService';
import { HelpCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "다음 수열의 빈칸에 들어갈 숫자는? 2, 4, 8, 16, ( ? )",
        options: ["24", "30", "32", "64"],
        correctAnswer: 2,
        explanation: "이전 숫자에 2를 곱하는 패턴입니다 (등비수열).",
        category: 'sequence'
    },
    {
        id: 2,
        question: "로봇이 '전진-좌회전'을 4번 반복했습니다. 로봇은 처음에 보던 방향과 비교해 어느 쪽을 보고 있을까요?",
        options: ["같은 방향", "뒤쪽", "오른쪽", "왼쪽"],
        correctAnswer: 0,
        explanation: "좌회전(90도)을 4번 하면 360도를 회전하여 제자리(같은 방향)가 됩니다.",
        category: 'logic'
    },
    {
        id: 3,
        question: "하노이의 탑에서 원판이 3개일 때 최소 이동 횟수는?",
        options: ["5회", "7회", "9회", "15회"],
        correctAnswer: 1,
        explanation: "2^n - 1 공식에 따라 2^3 - 1 = 7회입니다.",
        category: 'logic'
    },
    {
        id: 4,
        question: "다음 도형 패턴에서 다음에 올 모양은? ○ △ □ ○ △ ( ? )",
        options: ["○", "△", "□", "☆"],
        correctAnswer: 2,
        explanation: "○, △, □ 세 가지 모양이 반복되는 패턴입니다.",
        category: 'shape'
    },
    {
        id: 5,
        question: "프로그래밍에서 반복되는 코드를 묶어서 사용하는 것을 무엇이라고 하나요?",
        options: ["변수 (Variable)", "함수 (Function)", "조건문 (If)", "주석 (Comment)"],
        correctAnswer: 1,
        explanation: "반복되거나 재사용되는 코드 덩어리를 함수로 정의하여 패턴화합니다.",
        category: 'logic'
    }
];

export const TabQuiz: React.FC = () => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
    const [hint, setHint] = useState("");
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Filter questions if in "Retry Mode" (only wrong answers)
    const [retryMode, setRetryMode] = useState(false);
    
    const activeQuestions = retryMode 
        ? QUESTIONS.filter(q => wrongAnswers.includes(q.id))
        : QUESTIONS;

    const question = activeQuestions[currentIdx];

    const handleAnswer = (optionIdx: number) => {
        if(isAnswered) return;
        setSelectedOption(optionIdx);
        setIsAnswered(true);

        const isCorrect = optionIdx === question.correctAnswer;
        if (isCorrect) {
            if (!retryMode) setScore(score + 1);
            // If in retry mode, remove from wrong answers if correct now
            if (retryMode) {
                setWrongAnswers(prev => prev.filter(id => id !== question.id));
            }
        } else {
            if (!wrongAnswers.includes(question.id)) {
                setWrongAnswers(prev => [...prev, question.id]);
            }
        }
    };

    const nextQuestion = () => {
        if (currentIdx < activeQuestions.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setHint("");
        } else {
            setShowResult(true);
        }
    };

    const getHint = async () => {
        setIsHintLoading(true);
        const h = await getQuizHint(question.question);
        setHint(h);
        setIsHintLoading(false);
    };

    const resetQuiz = () => {
        setCurrentIdx(0);
        setScore(0);
        setShowResult(false);
        setWrongAnswers([]);
        setRetryMode(false);
        setSelectedOption(null);
        setIsAnswered(false);
        setHint("");
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <h2 className="text-3xl font-bold mb-4 text-slate-800">퀴즈 결과</h2>
                    <div className="text-6xl mb-6">
                        {score === QUESTIONS.length ? '🏆' : '📝'}
                    </div>
                    <p className="text-xl mb-2">총 {QUESTIONS.length}문제 중 <span className="text-blue-600 font-bold">{score}</span>점</p>
                    
                    {score === QUESTIONS.length ? (
                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-6">
                            <strong>축하합니다!</strong> '패턴 탐정' 배지를 획득했습니다!
                        </div>
                    ) : (
                        <p className="text-slate-500 mb-6">조금 더 노력해보세요!</p>
                    )}

                    <div className="flex flex-col gap-3">
                        {wrongAnswers.length > 0 && !retryMode && (
                            <button 
                                onClick={() => {
                                    setRetryMode(true);
                                    setShowResult(false);
                                    setCurrentIdx(0);
                                    setSelectedOption(null);
                                    setIsAnswered(false);
                                }}
                                className="w-full py-3 bg-red-100 text-red-600 rounded-lg font-bold hover:bg-red-200"
                            >
                                오답 노트 ({wrongAnswers.length}문제 다시 풀기)
                            </button>
                        )}
                        <button 
                            onClick={resetQuiz}
                            className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700"
                        >
                            처음부터 다시 하기
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!question) return <div>문제 로딩 중...</div>;

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-400">
                    Question {currentIdx + 1} / {activeQuestions.length}
                </span>
                {retryMode && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">오답 복습 중</span>}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                    {question.question}
                </h3>

                <div className="grid gap-4 mb-8">
                    {question.options.map((opt, idx) => {
                        let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                        if (isAnswered) {
                            if (idx === question.correctAnswer) btnClass = "bg-green-100 border-green-400 text-green-800";
                            else if (idx === selectedOption) btnClass = "bg-red-100 border-red-400 text-red-800";
                            else btnClass = "opacity-50";
                        }
                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={isAnswered}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium flex justify-between items-center ${btnClass}`}
                            >
                                {opt}
                                {isAnswered && idx === question.correctAnswer && <CheckCircle size={20} className="text-green-600"/>}
                                {isAnswered && idx === selectedOption && idx !== question.correctAnswer && <XCircle size={20} className="text-red-600"/>}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-4 animate-fade-in">
                        <strong>해설:</strong> {question.explanation}
                    </div>
                )}

                {/* Bottom Actions */}
                <div className="mt-auto flex justify-between items-center">
                     <div className="relative">
                        {!isAnswered && (
                             <button 
                                onClick={getHint} 
                                disabled={isHintLoading || !!hint}
                                className="text-sm text-amber-600 flex items-center gap-1 hover:underline disabled:opacity-50"
                            >
                                <HelpCircle size={16}/> {isHintLoading ? 'AI가 생각중...' : 'AI 힌트 보기'}
                            </button>
                        )}
                        {hint && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-lg text-xs text-amber-800 z-10">
                                {hint}
                            </div>
                        )}
                     </div>

                     {isAnswered && (
                         <button 
                            onClick={nextQuestion}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-transform active:scale-95"
                         >
                            다음 문제
                         </button>
                     )}
                </div>
            </div>
        </div>
    );
};
