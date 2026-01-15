import React, { useState } from 'react';
import { getDiscussionFeedback } from '../../services/gemini';
import { MessageSquare, Bot, Send, Loader2 } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [opinion, setOpinion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    setLoading(true);
    setResponse(null);
    
    try {
      const feedback = await getDiscussionFeedback(opinion);
      setResponse(feedback || null);
    } catch (error) {
      setResponse("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in h-full flex flex-col">
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-3">
          <Bot className="w-6 h-6" /> 생각해보는 시간
        </h2>
        <p className="text-indigo-800 font-medium text-lg leading-relaxed">
          "만약 법을 판결하는 판사를 AI로 대체한다면, <br/>
          <span className="text-blue-600 bg-white px-2 rounded mx-1 shadow-sm">규칙 기반(전통적)</span>과 
          <span className="text-purple-600 bg-white px-2 rounded mx-1 shadow-sm">기계학습(데이터 기반)</span> 중 
          무엇이 더 공정할까요?"
        </p>
        <p className="text-sm text-indigo-600 mt-4">
          여러분의 생각을 적어주시면 AI 멘토가 피드백을 드립니다.
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {response && (
           <div className="bg-white border-l-4 border-purple-500 shadow-md rounded-r-xl p-6 animate-slide-right">
             <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold">
               <Bot className="w-5 h-5" /> AI 멘토의 피드백
             </div>
             <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
               {response}
             </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="저는 ... 방식이 더 공정하다고 생각합니다. 왜냐하면..."
          className="w-full h-32 p-4 pr-14 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 resize-none outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !opinion.trim()}
          className="absolute right-3 bottom-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default DiscussionTab;
