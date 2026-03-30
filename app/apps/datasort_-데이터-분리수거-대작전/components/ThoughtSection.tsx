import React, { useState } from 'react';
import { evaluateThought } from '../services/geminiService';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

const ThoughtSection: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    const response = await evaluateThought(answer);
    setFeedback(response);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-6 rounded-2xl border border-cyan-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-full">
            <MessageSquare className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🤔 생각해볼 문제</h2>
            <p className="text-lg text-cyan-100 mb-4">
              "전화번호(<span className="font-mono text-yellow-300">01012345678</span>)는 숫자로 저장해야 할까요, 문자로 저장해야 할까요? 그리고 그 이유는 무엇인가요?"
            </p>
            <p className="text-sm text-cyan-300/80">
              AI 튜터가 당신의 답변을 분석하고 피드백을 제공합니다.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 생각을 적어보세요... (예: 0으로 시작하는 숫자는...)"
          className="w-full h-32 bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !answer.trim()}
          className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              분석 중...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" /> 제출하기
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-slideIn">
          <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> AI 튜터의 피드백
          </h3>
          <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed whitespace-pre-line">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThoughtSection;
