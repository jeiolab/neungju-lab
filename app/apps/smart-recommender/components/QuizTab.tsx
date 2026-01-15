import React, { useState, useEffect } from 'react';
import { generateScenarioQuiz } from '../services/geminiService';
import { QuizQuestion } from '../types';

export const QuizTab: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const loadQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    const data = await generateScenarioQuiz();
    setQuiz({ ...data, id: Date.now() });
    setLoading(false);
  };

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent double click
    setSelectedOption(index);
    if (quiz) {
        setIsCorrect(index === quiz.correctIndex);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">AI가 새로운 문제를 출제 중입니다...</p>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-500 px-2 py-1 rounded text-indigo-100">Daily Quiz</span>
          </div>
          <h3 className="text-xl font-bold leading-snug">
            {quiz.question}
          </h3>
        </div>
        
        <div className="p-6 space-y-3">
          {quiz.options.map((option, index) => {
            let itemClass = "w-full p-4 text-left border rounded-xl transition-all font-medium text-slate-700 ";
            
            if (selectedOption === null) {
                itemClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50";
            } else {
                if (index === quiz.correctIndex) {
                    itemClass += "border-green-500 bg-green-50 text-green-700 font-bold";
                } else if (index === selectedOption) {
                    itemClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                    itemClass += "border-slate-100 text-slate-400 opacity-50";
                }
            }

            return (
                <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                    className={itemClass}
                >
                    <span className="inline-block w-6 h-6 rounded-full bg-white border border-current text-xs leading-6 text-center mr-3">
                        {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                </button>
            );
          })}
        </div>

        {selectedOption !== null && (
            <div className={`p-6 border-t ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '🎉 정답입니다!' : '🤔 다시 생각해볼까요?'}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                    {quiz.explanation}
                </p>
                <div className="mt-4 text-right">
                    <button 
                        onClick={loadQuiz}
                        className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        다음 문제 풀기
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};