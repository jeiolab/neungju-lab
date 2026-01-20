import React, { useState, useEffect } from 'react';
import { generateQuizQuestion } from '../../services/geminiService';
import { QuizQuestion } from '../../types';
import { BrainCircuit, Check, X, ArrowRight } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');

  const fetchQuestion = async () => {
    setLoading(true);
    setQuestion(null);
    setSelectedOption(null);
    setIsAnswered(false);
    
    const q = await generateQuizQuestion(difficulty);
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-lg font-bold flex items-center gap-2 text-white">
          <BrainCircuit className="text-purple-400" />
          알고리즘 적성 검사
        </h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setDifficulty('easy')}
                className={`px-3 py-1 rounded text-sm ${difficulty === 'easy' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
                쉬움
            </button>
            <button 
                onClick={() => setDifficulty('hard')}
                className={`px-3 py-1 rounded text-sm ${difficulty === 'hard' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'}`}
            >
                어려움
            </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 min-h-[400px] relative">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10 rounded-xl">
                <div className="animate-pulse text-blue-400 font-mono">Gemini가 문제를 생성 중입니다...</div>
            </div>
        )}

        {question ? (
            <div className="space-y-8">
                <h3 className="text-xl md:text-2xl font-semibold text-slate-100 leading-relaxed">
                    {question.question}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                    {question.options.map((opt, idx) => {
                        let btnClass = "bg-slate-700 border-slate-600 hover:bg-slate-600";
                        
                        if (isAnswered) {
                            if (idx === question.answer) btnClass = "bg-emerald-600 border-emerald-500 text-white";
                            else if (idx === selectedOption) btnClass = "bg-red-600 border-red-500 text-white";
                            else btnClass = "opacity-50 bg-slate-700 border-slate-600";
                        } else if (selectedOption === idx) {
                            btnClass = "bg-blue-600 border-blue-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${btnClass}`}
                            >
                                <span>{opt}</span>
                                {isAnswered && idx === question.answer && <Check size={20} />}
                                {isAnswered && idx === selectedOption && idx !== question.answer && <X size={20} />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-300 text-sm">
                            <span className="font-bold text-blue-400 block mb-1">해설:</span>
                            {question.explanation}
                        </p>
                        <button 
                            onClick={fetchQuestion}
                            className="mt-4 flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors ml-auto text-sm font-semibold"
                        >
                            다음 문제 <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        ) : (
            !loading && <div className="text-center text-red-400">문제를 불러오지 못했습니다. 다시 시도해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;