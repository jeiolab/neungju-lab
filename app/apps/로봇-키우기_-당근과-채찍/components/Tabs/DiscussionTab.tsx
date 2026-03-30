import React, { useState } from 'react';
import { generateDiscussionInsight } from '../../services/geminiService';
import { MessageSquare, ThumbsUp, AlertTriangle } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const topic = "자율주행차가 사고를 피하는 법을 배울 때, 실제 도로에서 사고를 내면서 배울 수는 없습니다. 이를 어떻게 해결해야 할까요?";

  const handleGetInsight = async () => {
    setLoading(true);
    const text = await generateDiscussionInsight(topic);
    setInsight(text || "");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 animate-fadeIn">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-600 mt-1 flex-shrink-0" size={24} />
            <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">생각해볼 문제</h3>
                <p className="text-amber-800 font-medium text-lg leading-relaxed">
                    "{topic}"
                </p>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3">학생 A의 의견</h4>
            <div className="bg-slate-100 p-4 rounded-lg rounded-tl-none mb-2 text-slate-700">
                "컴퓨터 게임 같은 <strong>가상 시뮬레이터</strong>를 만들어서 거기서 수억 번 연습시키면 되지 않을까요? GTA 게임처럼요!"
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3">학생 B의 의견</h4>
            <div className="bg-blue-50 p-4 rounded-lg rounded-tr-none mb-2 text-blue-900">
                "하지만 가상은 실제랑 다르잖아요. 비가 오거나 눈이 올 때, 혹은 돌발 상황을 시뮬레이터가 완벽하게 따라할 수 있을까요?"
            </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
            onClick={handleGetInsight}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
        >
            {loading ? 'AI 전문가 의견 요청 중...' : '🤖 AI 전문가의 해결책 듣기'}
        </button>
      </div>

      {insight && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-slideUp">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                    <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">전문가 의견</h3>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
               {insight}
            </div>
            <div className="mt-6 flex justify-end">
                <button className="text-sm text-slate-500 flex items-center gap-1 hover:text-brand-600">
                    <ThumbsUp size={14} /> 도움이 되었어요
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionTab;
