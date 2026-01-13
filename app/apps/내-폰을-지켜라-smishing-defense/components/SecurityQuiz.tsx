import React, { useState, useEffect } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const SecurityQuiz: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    const q = await generateQuizQuestion();
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  if (loading || !question) {
    return (
        <div className="flex flex-col items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">보안 퀴즈 생성 중...</p>
        </div>
    );
  }

  const isCorrect = selectedOption === question.correctIndex;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-emerald-400">보안 퀴즈 (Security Quiz)</h2>
        <button onClick={loadQuiz} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="mb-6">
            <span className="text-emerald-500 font-bold text-sm tracking-wider">QUESTION</span>
            <h3 className="text-xl font-medium text-white mt-2">{question.question}</h3>
        </div>

        <div className="space-y-3">
            {question.options.map((option, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        if (selectedOption === null) setSelectedOption(idx);
                    }}
                    disabled={selectedOption !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 border-2
                    ${selectedOption === null 
                        ? 'bg-slate-700 border-transparent hover:bg-slate-600 text-slate-200' 
                        : idx === question.correctIndex
                            ? 'bg-green-900/50 border-green-500 text-green-100'
                            : idx === selectedOption
                                ? 'bg-red-900/50 border-red-500 text-red-100'
                                : 'bg-slate-700 border-transparent opacity-50'
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {selectedOption !== null && idx === question.correctIndex && <CheckCircle size={20} className="text-green-500" />}
                        {selectedOption !== null && idx === selectedOption && idx !== question.correctIndex && <XCircle size={20} className="text-red-500" />}
                    </div>
                </button>
            ))}
        </div>

        {selectedOption !== null && (
            <div className={`mt-6 p-4 rounded-lg border ${isCorrect ? 'bg-green-900/20 border-green-900' : 'bg-red-900/20 border-red-900'}`}>
                <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? '정답입니다! +10 Point' : '오답입니다.'}
                </h4>
                <p className="text-slate-300 text-sm">{question.explanation}</p>
                <button 
                    onClick={loadQuiz}
                    className="mt-4 w-full py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-bold transition">
                    다음 문제
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SecurityQuiz;