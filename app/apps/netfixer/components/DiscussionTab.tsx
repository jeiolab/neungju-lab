import React, { useState } from 'react';
import { evaluateDiscussionAnswer } from '../services/geminiService';
import { MessageCircle, Send, Cpu } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const QUESTION = "커피숍에서 공공 와이파이를 안전하게 사용하는 방법은 무엇인가요?";

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback('');
    
    const result = await evaluateDiscussionAnswer(QUESTION, answer);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-start gap-4">
             <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <MessageCircle size={24} />
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-800">생각해볼 문제</h3>
                <p className="text-slate-600 mt-1">{QUESTION}</p>
             </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 mb-4"
            placeholder="답변을 입력하세요... (예: VPN 사용, HTTPS 확인 등)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-colors
                ${loading || !answer.trim() ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {loading ? 'AI가 평가 중...' : '제출하기'} 
              {!loading && <Send size={16} />}
            </button>
          </div>
        </div>

        {feedback && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 animate-fade-in">
             <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                <Cpu size={18} /> AI 멘토의 피드백
             </div>
             <div className="p-4 bg-white rounded-lg border border-indigo-100 text-slate-700 leading-relaxed shadow-sm break-keep">
                {feedback}
             </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>팁: 자세하게 적을수록 AI 멘토가 더 정확한 피드백을 줄 수 있습니다.</p>
      </div>
    </div>
  );
};

export default DiscussionTab;