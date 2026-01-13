import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { analyzeUserOpinion } from '../services/geminiService';

const TabDiscussion: React.FC = () => {
  const [opinion, setOpinion] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!opinion.trim()) return;
    setLoading(true);
    setAnalysis(null);
    
    const result = await analyzeUserOpinion(opinion);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <MessageSquare className="text-purple-400" />
          생각해볼 문제
        </h2>
        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6">
          <p className="text-lg font-medium text-purple-200">
            "AI가 감정을 흉내내는 것(Simulation)과 실제로 느끼는 것(Experience)의 차이는 무엇이라고 생각하나요?"
          </p>
        </div>

        <div className="space-y-4">
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="자신의 생각을 자유롭게 적어보세요. (예: AI는 고통을 느낄 신체가 없으므로 진정한 감정이 아니다...)"
            className="w-full h-32 bg-slate-900 text-white p-4 rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || opinion.length < 5}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                loading || opinion.length < 5 
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {loading ? '분석 중...' : '분석가에게 제출'} <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500/30 shadow-lg animate-slide-up">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-3">
            <div className="p-2 bg-cyan-900 rounded-lg">
              <Bot className="text-cyan-400 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">분석가의 피드백</h3>
              <p className="text-xs text-slate-400">Powered by Gemini Analyst</p>
            </div>
          </div>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-line">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabDiscussion;