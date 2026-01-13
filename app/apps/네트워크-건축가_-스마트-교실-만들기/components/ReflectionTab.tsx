import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');
    
    const result = await evaluateReflection(input);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
                토론 주제
            </h2>
            <p className="text-lg font-medium text-slate-700 bg-indigo-50 p-4 rounded-lg">
                "모든 사물이 인터넷에 연결된 스마트홈의 장점과 단점은 무엇일까요?"
            </p>
        </div>

        <div className="space-y-4">
            <textarea
                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 transition-all min-h-[150px] resize-y text-slate-700"
                placeholder="여기에 생각을 적어보세요... (예: 편리하지만 해킹 위험이 있을 것 같아요)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center transition-all ${
                        loading || !input.trim() 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                    }`}
                >
                    {loading ? (
                        <>
                            <span className="animate-pulse mr-2">생각 중...</span>
                        </>
                    ) : (
                        <>
                            피드백 받기 <Send className="w-4 h-4 ml-2" />
                        </>
                    )}
                </button>
            </div>
        </div>

        {response && (
            <div className="mt-8 pt-8 border-t border-slate-100 animate-fadeIn">
                <div className="flex items-start">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-lg mr-4 text-white shadow-md">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-2">AI 선생님의 피드백</h4>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg rounded-tl-none">
                            {response}
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionTab;