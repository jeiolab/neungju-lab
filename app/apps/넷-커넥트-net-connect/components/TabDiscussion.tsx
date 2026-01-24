import React, { useState } from 'react';
import { askNetworkExpert } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, Loader2 } from 'lucide-react';

export const TabDiscussion: React.FC = () => {
  const [prompt, setPrompt] = useState("모든 사물이 인터넷에 연결되면 IP 주소는 부족하지 않을까요? IPv6가 무엇인지 알려주세요.");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setResponse("");
    
    const result = await askNetworkExpert(prompt);
    
    setResponse(result);
    setIsLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Sparkles className="text-purple-500" />
        AI 네트워크 컨설턴트에게 물어보세요
      </h2>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto min-h-[300px] bg-slate-50">
          {!response && !isLoading && (
             <div className="flex flex-col items-center justify-center h-full text-slate-400">
               <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
               <p>궁금한 내용을 질문하면 AI 선생님이 답변해줍니다.</p>
             </div>
          )}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-indigo-600">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="animate-pulse">답변을 생성하고 있습니다...</p>
            </div>
          )}

          {response && (
            <div className="prose prose-slate max-w-none">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
                <h3 className="text-indigo-600 font-bold mb-4 text-lg">AI 선생님의 답변:</h3>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {response}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="네트워크에 대해 궁금한 점을 입력하세요..."
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 rounded-xl font-bold transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">질문하기</span>
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800">
        <p className="font-bold mb-1">💡 생각해보기 주제:</p>
        <p>"IPv4는 약 43억 개의 주소를 만들 수 있지만, 사물인터넷 시대에는 턱없이 부족합니다. 이를 해결하기 위해 등장한 무한대에 가까운 주소 체계는 무엇일까요?"</p>
      </div>
    </div>
  );
};
