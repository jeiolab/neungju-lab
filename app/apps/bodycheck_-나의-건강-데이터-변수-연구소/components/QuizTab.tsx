import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw, Trophy, HelpCircle } from 'lucide-react';

interface QuizTabProps {
    onXpGain: (amount: number) => void;
}

const QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        difficulty: '초급',
        question: '다음 중 "문자열(String)" 자료형의 예시는?',
        options: ['175.5', '"홍길동"', 'True', '10'],
        correctIndex: 1,
        explanation: '따옴표(" ")로 감싸진 데이터는 문자열입니다.',
        relatedType: 'str'
    },
    {
        id: 2,
        difficulty: '초급',
        question: '숫자 175.5는 어떤 자료형에 해당할까요?',
        options: ['int (정수)', 'float (실수)', 'str (문자열)', 'bool (불린)'],
        correctIndex: 1,
        explanation: '소수점(.)이 있는 숫자는 실수형(float)입니다.',
        relatedType: 'float'
    },
    {
        id: 3,
        difficulty: '중급',
        question: '다음 코드의 결과로 알맞은 자료형은? type(10 + 2.5)',
        options: ['int', 'float', 'str', 'error'],
        correctIndex: 1,
        explanation: '정수(10)와 실수(2.5)를 더하면 더 넓은 범위인 실수(12.5)가 됩니다.',
        relatedType: 'float'
    },
    {
        id: 4,
        difficulty: '중급',
        question: '변수 is_obese = False 일 때, 이 변수의 자료형은?',
        options: ['문자열', '실수', '불린(Boolean)', '정수'],
        correctIndex: 2,
        explanation: 'True 또는 False 값만 가지는 것은 불린(Boolean) 자료형입니다.',
        relatedType: 'bool'
    },
    {
        id: 5,
        difficulty: '고급',
        question: '다음 중 메모리를 가장 적게 사용할 것으로 예상되는 변수는?',
        options: ['age = 25', 'bio = "저는..." (긴 글)', 'height = 175.51234', 'is_checked = True'],
        correctIndex: 3,
        explanation: '불린형은 참/거짓 1비트 정보만 필요하므로 일반적으로 가장 작습니다.',
        relatedType: 'bool'
    }
];

const QuizTab: React.FC<QuizTabProps> = ({ onXpGain }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

    const currentQ = QUESTIONS[currentQIndex];

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === currentQ.correctIndex) {
            setScore(prev => prev + 1);
            onXpGain(20);
        } else {
            setWrongAnswers(prev => [...prev, currentQ.id]);
        }
    };

    const nextQuestion = () => {
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
        setWrongAnswers([]);
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-2xl shadow-sm p-8 text-center animate-fadeIn">
                <Trophy size={64} className="text-yellow-400 mb-4" />
                <h2 className="text-3xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
                <p className="text-xl text-slate-600 mb-8">
                    총 {QUESTIONS.length}문제 중 <span className="text-emerald-600 font-bold">{score}</span>문제를 맞혔습니다.
                </p>
                
                {wrongAnswers.length > 0 && (
                    <div className="w-full max-w-md bg-red-50 p-4 rounded-xl border border-red-100 mb-8 text-left">
                        <h3 className="font-bold text-red-800 mb-2">오답 노트</h3>
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                           {wrongAnswers.map(id => {
                               const q = QUESTIONS.find(question => question.id === id);
                               return <li key={id}>{q?.question.substring(0, 30)}...</li>;
                           })}
                        </ul>
                    </div>
                )}

                <button 
                    onClick={restartQuiz}
                    className="flex items-center space-x-2 bg-slate-800 text-white px-8 py-3 rounded-full hover:bg-slate-700 transition-colors"
                >
                    <RefreshCw size={20} />
                    <span>다시 도전하기</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-slate-100 h-2 w-full">
                    <div 
                        className="bg-emerald-500 h-full transition-all duration-300" 
                        style={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                    ></div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold 
                            ${currentQ.difficulty === '초급' ? 'bg-green-100 text-green-700' : 
                              currentQ.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {currentQ.difficulty}
                        </span>
                        <span className="text-slate-400 text-sm">Question {currentQIndex + 1} / {QUESTIONS.length}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
                        {currentQ.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQ.options.map((option, idx) => {
                            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                            if (isAnswered) {
                                if (idx === currentQ.correctIndex) {
                                    btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
                                } else if (idx === selectedOption) {
                                    btnClass += "border-red-500 bg-red-50 text-red-800";
                                } else {
                                    btnClass += "border-slate-100 text-slate-400 opacity-50";
                                }
                            } else {
                                btnClass += "border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-700";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={btnClass}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{option}</span>
                                        {isAnswered && idx === currentQ.correctIndex && <CheckCircle size={20} className="text-emerald-500" />}
                                        {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="text-red-500" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-slideUp">
                            <div className="flex items-start space-x-3">
                                <HelpCircle className="text-emerald-500 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-1">해설</h4>
                                    <p className="text-slate-600 text-sm">{currentQ.explanation}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button 
                                    onClick={nextQuestion}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    {currentQIndex < QUESTIONS.length - 1 ? '다음 문제' : '결과 보기'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizTab;
