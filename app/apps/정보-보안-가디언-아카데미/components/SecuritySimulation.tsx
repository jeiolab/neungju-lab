import React, { useState } from 'react';
import { SIMULATION_QUESTIONS } from '../constants';
import { QuizQuestion, ModuleType } from '../types';
import { ShieldAlert, ShieldCheck, Mail, Camera, FileText, Smartphone } from 'lucide-react';

interface Props {
    onCorrect: (moduleId: ModuleType) => void;
    onWrong: (question: QuizQuestion) => void;
}

const SecuritySimulation: React.FC<Props> = ({ onCorrect, onWrong }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'END'>('START');
    const [lastResult, setLastResult] = useState<'HIT' | 'MISS' | null>(null);

    const question = SIMULATION_QUESTIONS[currentIndex];

    const startGame = () => {
        setScore(0);
        setCurrentIndex(0);
        setGameState('PLAYING');
        setLastResult(null);
    };

    const handleAnswer = (answer: string) => {
        const isCorrect = answer === question.correctAnswer;
        
        if (isCorrect) {
            setScore(s => s + 100);
            setLastResult('HIT');
            onCorrect(question.moduleId);
        } else {
            setLastResult('MISS');
            onWrong(question);
        }

        setTimeout(() => {
            if (currentIndex < SIMULATION_QUESTIONS.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setLastResult(null);
            } else {
                setGameState('END');
            }
        }, 1000);
    };

    const renderIcon = (id: string) => {
        if (id.includes('1')) return <Mail className="w-16 h-16 text-slate-700" />;
        if (id.includes('3')) return <Smartphone className="w-16 h-16 text-slate-700" />;
        return <FileText className="w-16 h-16 text-slate-700" />;
    };

    if (gameState === 'START') {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-900 rounded-xl text-white p-8 text-center space-y-6">
                <ShieldAlert className="w-20 h-20 text-yellow-500 animate-pulse" />
                <div>
                    <h2 className="text-3xl font-black mb-2">보안 위협 시뮬레이션</h2>
                    <p className="text-slate-400">실제 상황처럼 빠르게 판단하라. <br/> 제한된 시간 내에 올바른 선택을 해야 한다.</p>
                </div>
                <button 
                    onClick={startGame}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                >
                    시뮬레이션 시작
                </button>
            </div>
        );
    }

    if (gameState === 'END') {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-xl border-2 border-slate-200 p-8 text-center space-y-6">
                <ShieldCheck className="w-20 h-20 text-green-500" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">훈련 종료</h2>
                    <p className="text-slate-600">획득 점수: <span className="text-blue-600 font-black text-3xl">{score}</span></p>
                </div>
                <button 
                    onClick={startGame}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold"
                >
                    다시 도전하기
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto space-y-6">
            {/* Game Screen */}
            <div className="relative bg-white h-96 rounded-2xl shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                    <span className="font-mono text-yellow-400 font-bold">SCORE: {score}</span>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">STAGE {currentIndex + 1}</span>
                </div>

                {/* Scenario Display */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
                    {lastResult && (
                        <div className={`absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity`}>
                            {lastResult === 'HIT' ? (
                                <div className="text-green-400 font-black text-5xl drop-shadow-lg transform scale-110">NICE!</div>
                            ) : (
                                <div className="text-red-500 font-black text-5xl drop-shadow-lg">WARNING!</div>
                            )}
                        </div>
                    )}
                    
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                        {renderIcon(question.id)}
                    </div>
                    <p className="font-bold text-lg text-slate-800 leading-snug">
                        {question.question}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex h-24">
                    <button 
                        onClick={() => handleAnswer('O')}
                        className="flex-1 bg-green-500 hover:bg-green-400 text-white text-3xl font-black border-t-4 border-green-600 active:border-t-0 active:mt-1 transition-all"
                    >
                        O (안전)
                    </button>
                    <button 
                        onClick={() => handleAnswer('X')}
                        className="flex-1 bg-red-500 hover:bg-red-400 text-white text-3xl font-black border-t-4 border-red-600 active:border-t-0 active:mt-1 transition-all"
                    >
                        X (위험)
                    </button>
                </div>
            </div>
             <p className="text-center text-slate-400 text-sm">
                빠르게 상황을 판단하여 O 또는 X를 선택하십시오.
             </p>
        </div>
    );
};

export default SecuritySimulation;