import React, { useState } from 'react';
import { getDiscussionFeedback } from '../services/geminiService';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';

const Think: React.FC = () => {
  const [input, setInput] = useState('');
  const [discussion, setDiscussion] = useState<{user: string, ai: string}[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const handleDiscuss = async () => {
    if (!input.trim()) return;
    
    setIsThinking(true);
    const response = await getDiscussionFeedback("Sorting Strings and Words", input);
    
    setDiscussion([...discussion, { user: input, ai: response }]);
    setInput('');
    setIsThinking(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-yellow-300" size={32} />
                <h2 className="text-2xl font-bold">생각해볼 문제</h2>
            </div>
            <p className="text-lg text-purple-100 font-medium">
                "숫자가 아니라 사전 속 단어로 업다운 게임을 한다면 어떻게 진행될까요?"
            </p>
       </div>

       <div className="space-y-6 mb-8">
            {discussion.map((item, idx) => (
                <div key={idx} className="space-y-4">
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                            {item.user}
                        </div>
                    </div>
                    <div className="flex justify-start">
                         <div className="bg-white border border-slate-200 text-slate-800 px-5 py-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm">
                            <div className="flex items-center gap-2 mb-1 text-purple-600 text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={12} /> AI 통찰
                            </div>
                            {item.ai}
                        </div>
                    </div>
                </div>
            ))}
       </div>

       <div className="relative">
            <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="아이디어를 공유해주세요... (예: 알파벳 순서를 알아야 합니다...)"
                className="w-full p-4 pr-16 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none shadow-sm min-h-[80px]"
            />
            <button 
                onClick={handleDiscuss}
                disabled={isThinking || !input.trim()}
                className="absolute right-2 bottom-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
                {isThinking ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20} />}
            </button>
       </div>
    </div>
  );
};

export default Think;