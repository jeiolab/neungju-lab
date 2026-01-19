import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { Send, MessageSquare, Sparkles } from 'lucide-react';

export const ReflectionBoard: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [plan, setPlan] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!problem.trim() || !plan.trim()) return;
    
    setLoading(true);
    setFeedback(null);
    
    const response = await getReflectionFeedback(problem, plan);
    setFeedback(response || null);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-6 text-indigo-900">
          <MessageSquare className="w-6 h-6" />
          <h2 className="text-xl font-bold">생각해볼 문제: 우리 학교 ML 프로젝트</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            1. 해결하고 싶은 학교/생활 문제는?
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="예: 급식 잔반 줄이기, 도서관 빈 좌석 찾기..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            2. 각 단계별 계획을 간단히 적어보세요
          </label>
          <textarea
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
            placeholder="문제정의: ~, 데이터수집: ~, 모델학습: ~"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !problem || !plan}
          className={`w-full py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all
            ${loading || !problem || !plan ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}
          `}
        >
          {loading ? <span className="animate-spin">⏳</span> : <Sparkles className="w-5 h-5" />}
          AI 코치 피드백 받기
        </button>
      </div>

      {feedback && (
        <div className="mt-6 p-5 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in">
          <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
            <span className="text-xl">👨‍🏫</span> 코치의 피드백
          </h4>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
        </div>
      )}
    </div>
  );
};
