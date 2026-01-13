import React, { useState, useEffect } from 'react';
import { generateThinkProblem } from '../../services/geminiService';
import { ThinkProblem } from '../../types';
import { Lightbulb, Eye, EyeOff, RotateCcw } from 'lucide-react';

const ThinkTab: React.FC = () => {
  const [problem, setProblem] = useState<ThinkProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchProblem = async () => {
    setLoading(true);
    setShowHint(false);
    setShowAnswer(false);
    const p = await generateThinkProblem();
    setProblem(p);
    setLoading(false);
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="text-yellow-400" />
                비판적 사고
            </h2>
            <button 
                onClick={fetchProblem} 
                disabled={loading}
                className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors border border-slate-600 text-slate-300"
            >
                <RotateCcw size={14} /> 새 퍼즐
            </button>
        </div>

        <div className="p-8 min-h-[300px] flex flex-col">
            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-mono text-sm">자료실 검색 중...</p>
                </div>
            )}

            {!loading && problem && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-300 mb-2">{problem.title}</h3>
                        <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-indigo-500">
                            <p className="text-slate-300 italic">{problem.scenario}</p>
                        </div>
                    </div>

                    <div className="py-4">
                        <p className="text-lg text-white font-medium leading-relaxed">{problem.question}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-700/50">
                        {/* Hint Section */}
                        <div>
                             <button 
                                onClick={() => setShowHint(!showHint)}
                                className="text-sm text-slate-400 hover:text-slate-200 flex items-center gap-2 mb-2 transition-colors"
                            >
                                <Lightbulb size={14} /> {showHint ? "힌트 숨기기" : "힌트가 필요한가요?"}
                            </button>
                            {showHint && (
                                <p className="text-sm text-yellow-100/80 bg-yellow-900/20 p-3 rounded border border-yellow-900/50">
                                    {problem.hint}
                                </p>
                            )}
                        </div>

                        {/* Answer Section */}
                        <div>
                            <button 
                                onClick={() => setShowAnswer(!showAnswer)}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all"
                            >
                                {showAnswer ? <EyeOff size={18} /> : <Eye size={18} />}
                                {showAnswer ? "분석 숨기기" : "정답 확인"}
                            </button>
                            
                            {showAnswer && (
                                <div className="mt-4 bg-emerald-900/20 border border-emerald-900/50 p-5 rounded-lg text-emerald-100 leading-relaxed animate-in slide-in-from-top-2">
                                    {problem.answerKey}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ThinkTab;