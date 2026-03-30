import React, { useState } from 'react';
import { askGemini } from '../services/geminiService';
import { Bot, Send, BrainCircuit, Loader2 } from 'lucide-react';

const ThinkTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState<string>('net-neutrality');

  const handleAsk = async (customPrompt?: string) => {
    setIsLoading(true);
    setResponse(null);
    
    let promptToSend = customPrompt || input;
    
    // Topic context wrappers
    if (topic === 'net-neutrality' && !customPrompt) {
      promptToSend = `망 중립성(Net Neutrality)에 대해 설명해줘. "${input}"라는 질문에 초점을 맞춰서 쉽고 재미있게 설명해줘.`;
    } else if (topic === 'future' && !customPrompt) {
        promptToSend = `미래의 인터넷 기술에 대해 설명해줘. "${input}"에 대해 알려줘.`;
    }

    const result = await askGemini(promptToSend);
    setResponse(result);
    setIsLoading(false);
  };

  const presetQuestions = [
    "망 중립성이 사라지면 어떤 일이 생기나요?",
    "넷플릭스법이 무엇인가요?",
    "ISP(통신사)와 CP(콘텐츠 제공자)의 갈등은 왜 생기나요?",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Left: Topic Selection & Presets */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-blue-600 font-bold flex items-center gap-2 mb-4">
             <BrainCircuit size={20} />
             생각해보기 주제
           </h3>
           <div className="space-y-2">
             <button 
                onClick={() => { setTopic('net-neutrality'); setResponse(null); setInput(''); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all shadow-sm ${topic === 'net-neutrality' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
             >
               망 중립성과 공정성
             </button>
             <button 
                 onClick={() => { setTopic('future'); setResponse(null); setInput(''); }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all shadow-sm ${topic === 'future' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
             >
               미래의 인터넷 기술
             </button>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-slate-500 text-sm font-semibold mb-3">추천 질문</h4>
          <div className="space-y-2">
            {presetQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => { setInput(q); handleAsk(q); }}
                className="w-full text-left p-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Chat Interface */}
      <div className="md:col-span-2 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden h-[600px] shadow-sm">
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
               <Bot size={24} className="text-white" />
             </div>
             <div className="bg-white rounded-lg rounded-tl-none p-4 text-slate-700 text-sm leading-relaxed shadow-sm border border-slate-100 max-w-[90%]">
               안녕하세요! 저는 네트워크 AI 튜터입니다. 
               {topic === 'net-neutrality' ? " '망 중립성'에 대해 궁금한 점을 물어보세요. 왜 데이터 고속도로에 톨게이트가 생기면 안 되는지 이야기해볼까요?" : " 미래 인터넷 기술에 대해 물어보세요."}
             </div>
          </div>

          {response && (
             <div className="flex gap-4 animate-fadeIn">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                 <Bot size={24} className="text-white" />
               </div>
               <div className="bg-white rounded-lg rounded-tl-none p-4 text-slate-700 text-sm leading-relaxed shadow-sm border border-slate-100 max-w-[90%] whitespace-pre-wrap">
                 {response}
               </div>
             </div>
          )}

          {isLoading && (
             <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                 <Loader2 size={24} className="text-white animate-spin" />
               </div>
               <div className="text-slate-500 text-sm flex items-center">
                 답변을 생성하고 있습니다...
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
           <div className="flex gap-2">
             <input 
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAsk()}
               placeholder="질문을 입력하세요..."
               className="flex-1 bg-slate-50 text-slate-900 border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
             />
             <button 
               onClick={() => handleAsk()}
               disabled={isLoading || !input.trim()}
               className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg px-6 flex items-center justify-center transition-colors shadow-sm"
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkTab;