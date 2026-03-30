import React, { useEffect, useState } from 'react';
import { generateExplanation } from '../services/geminiService';
import { MessageCircle, Lightbulb, Loader2 } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoading(true);
      const result = await generateExplanation("Why does the internet get slow? Explain using packets and router congestion.");
      setContent(result);
      setIsLoading(false);
    };

    fetchInsight();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">생각해볼 문제</h2>
        <p className="text-slate-600 text-lg">"인터넷 속도가 느려질 때, 패킷의 관점에서 무슨 일이 일어나는 걸까?"</p>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-2xl shadow-xl border border-indigo-100 min-h-[300px] flex flex-col">
        <div className="flex items-center gap-3 mb-6 border-b border-indigo-100 pb-4">
            <div className="bg-indigo-100 p-2 rounded-full">
                <Lightbulb className="text-indigo-600 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900">데이터 물류 센터장의 답변</h3>
        </div>

        {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p>AI가 답변을 생각하고 있습니다...</p>
            </div>
        ) : (
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 text-lg leading-loose whitespace-pre-line animate-fade-in">
                    {content}
                </p>
            </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
        {/* Static conversation starters */}
        <div className="flex-shrink-0 w-64 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <MessageCircle className="w-5 h-5 text-blue-500 mb-2"/>
            <p className="font-bold text-slate-700 text-sm">패킷 손실(Packet Loss)</p>
            <p className="text-xs text-slate-500 mt-1">라우터가 너무 바빠서 패킷을 처리하지 못하고 버리는 상황입니다. 다시 보내야 해서 느려지죠.</p>
        </div>
        <div className="flex-shrink-0 w-64 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <MessageCircle className="w-5 h-5 text-green-500 mb-2"/>
            <p className="font-bold text-slate-700 text-sm">대역폭(Bandwidth)</p>
            <p className="text-xs text-slate-500 mt-1">도로의 차선 수와 같습니다. 차선이 적은데 차(패킷)가 많으면 막히게 됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;
