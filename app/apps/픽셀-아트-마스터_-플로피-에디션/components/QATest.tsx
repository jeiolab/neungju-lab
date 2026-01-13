import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

const STATIC_QUESTION: Question = {
    question: "3가지 색상만 사용하는 로고에 가장 적합한 포맷은?",
    options: ["JPEG (고화질)", "BMP (Raw)", "PNG/GIF (무손실)", "MP3"],
    correctIndex: 2,
    explanation: "PNG나 GIF 같은 무손실 포맷(RLE/LZW 사용)은 단색 이미지에 완벽합니다. JPEG는 노이즈를 만듭니다."
};

const QATest = () => {
    const [question, setQuestion] = useState<Question | null>(STATIC_QUESTION);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [streak, setStreak] = useState(0);

    const handleNext = async () => {
        setLoading(true);
        setSelected(null);
        setIsCorrect(null);
        
        const newQ = await generateQuizQuestion();
        if (newQ) {
            setQuestion(newQ);
        } else {
            // Fallback if API fails
            setQuestion(STATIC_QUESTION);
        }
        setLoading(false);
    };

    const handleAnswer = (index: number) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === question?.correctIndex;
        setIsCorrect(correct);
        if (correct) setStreak(s => s + 1);
        else setStreak(0);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="bg-retro-panel w-full max-w-2xl p-8 rounded-lg border-2 border-gray-600 shadow-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-2 text-retro-accent font-retro text-xs">
                    <AwardIcon /> 연속 정답: {streak}
                </div>

                <h2 className="font-retro text-xl text-retro-green mb-8 flex items-center gap-3">
                    <BrainCircuit /> QA 테스트 부서
                </h2>

                {loading ? (
                    <div className="h-64 flex items-center justify-center text-green-500 font-mono animate-pulse">
                        테스트 케이스 생성 중...
                    </div>
                ) : question ? (
                    <>
                        <p className="font-mono text-lg mb-8">{question.question}</p>
                        
                        <div className="space-y-3">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={selected !== null}
                                    className={`w-full text-left p-4 rounded font-mono transition-all border
                                        ${selected === null 
                                            ? 'bg-gray-800 border-gray-700 hover:border-retro-green hover:bg-gray-700' 
                                            : idx === question.correctIndex 
                                                ? 'bg-green-900 border-green-500 text-white' 
                                                : idx === selected 
                                                    ? 'bg-red-900 border-red-500 text-white'
                                                    : 'bg-gray-800 border-gray-700 opacity-50'
                                        }
                                    `}
                                >
                                    {String.fromCharCode(65 + idx)}. {opt}
                                </button>
                            ))}
                        </div>

                        {selected !== null && (
                            <div className={`mt-6 p-4 rounded border ${isCorrect ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'}`}>
                                <div className="flex items-center gap-2 font-bold mb-2">
                                    {isCorrect ? <CheckCircle className="text-green-500"/> : <XCircle className="text-red-500"/>}
                                    <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                        {isCorrect ? "정답!" : "버그 발견 (오답)"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 font-mono">{question.explanation}</p>
                                
                                <button 
                                    onClick={handleNext}
                                    className="mt-4 bg-retro-green text-black px-6 py-2 rounded font-retro hover:bg-white transition-colors"
                                >
                                    다음 티켓 &rarr;
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div>질문을 불러오는 중 오류가 발생했습니다.</div>
                )}
            </div>
        </div>
    );
};

const AwardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
)

export default QATest;