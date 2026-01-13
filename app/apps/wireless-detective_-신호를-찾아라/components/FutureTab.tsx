import React, { useState } from 'react';
import { askGeminiFuture } from '../services/gemini';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';

export const FutureTab: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const result = await askGeminiFuture(idea);
      setResponse(result);
    } catch (error) {
      setResponse("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-purple-50 rounded-full mb-2 border border-purple-100">
            <Sparkles className="text-purple-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">미래 기술 연구소</h2>
        <p className="text-slate-500">
          "텔레파시 통신? 100km 와이파이?"<br/>
          여러분이 상상하는 미래의 무선 통신 기술을 적어주세요. AI 수석 연구원이 분석해드립니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="예: 배터리 없이 공기 중에서 전기를 모아 무한대로 통신하는 기술"
          className="w-full h-32 bg-white border border-slate-300 rounded-xl p-4 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none placeholder-slate-400 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !idea.trim()}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-100"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> 분석 중...
            </>
          ) : (
            <>
              <Send size={18} /> 본부로 전송 및 분석
            </>
          )}
        </button>
      </form>

      {response && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 animate-slideIn shadow-md">
          <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold border-b border-slate-100 pb-2">
            <Bot size={20} />
            <span>수석 연구원의 분석 결과</span>
          </div>
          <div className="prose prose-sm max-w-none text-slate-700">
            <p className="whitespace-pre-wrap leading-relaxed">
              {response}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};