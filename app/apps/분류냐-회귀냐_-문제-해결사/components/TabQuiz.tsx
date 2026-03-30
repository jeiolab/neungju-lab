import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { AlgorithmType } from '../types';
import { Check, X } from 'lucide-react';

interface TabQuizProps {
  updateMastery: (type: AlgorithmType, isCorrect: boolean) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ updateMastery }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<AlgorithmType | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleAnswer = (answer: AlgorithmType) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQ.answer;
    setHistory([...history, isCorrect]);
    updateMastery(currentQ.answer, isCorrect);
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
        // Quiz Finished state could be handled here
        alert("모든 문제를 풀었습니다!");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
            <span className="font-bold text-gray-500">문제 {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
            <div className="flex gap-1">
                {QUIZ_QUESTIONS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${i < history.length ? (history[i] ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-200'}`}
                    />
                ))}
            </div>
        </div>

        <div className="flex-1">
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs md:text-sm text-gray-700 mb-6 border border-gray-200">
                {currentQ.dataPreview}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-8 leading-snug">
                {currentQ.question}
            </h3>

            {!showResult ? (
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleAnswer(AlgorithmType.CLASSIFICATION)}
                        className="py-4 rounded-xl border-2 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-700 font-bold transition"
                    >
                        분류 (Classification)
                    </button>
                    <button 
                        onClick={() => handleAnswer(AlgorithmType.REGRESSION)}
                        className="py-4 rounded-xl border-2 border-pink-100 hover:bg-pink-50 hover:border-pink-300 text-pink-700 font-bold transition"
                    >
                        회귀 (Regression)
                    </button>
                </div>
            ) : (
                <div className={`p-4 rounded-xl ${selectedAnswer === currentQ.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center mb-2">
                        {selectedAnswer === currentQ.answer ? (
                            <Check className="w-6 h-6 text-green-600 mr-2" />
                        ) : (
                            <X className="w-6 h-6 text-red-600 mr-2" />
                        )}
                        <span className={`font-bold ${selectedAnswer === currentQ.answer ? 'text-green-700' : 'text-red-700'}`}>
                            {selectedAnswer === currentQ.answer ? '정답입니다!' : '틀렸습니다.'}
                        </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                        {currentQ.explanation}
                    </p>
                    <button 
                        onClick={nextQuestion}
                        className="w-full py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition"
                    >
                        {currentIdx < QUIZ_QUESTIONS.length - 1 ? '다음 문제' : '완료'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;
