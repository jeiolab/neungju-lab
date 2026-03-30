import React, { useState } from 'react';
import { MessageCircle, Send, User, Bot, AlertOctagon } from 'lucide-react';
import { ChatMessage } from '../../types';
import { askChefAboutEthics } from '../../services/geminiService';

export const EthicsTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "안녕하세요! 저는 데이터 셰프입니다. AI가 실수를 하거나 차별을 하는 문제(윤리)에 대해 궁금한 점이 있나요?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const responseText = await askChefAboutEthics(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-in h-[600px]">
      <div className="space-y-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertOctagon className="text-red-500" /> 생각해볼 문제
            </h2>
            <p className="text-gray-600 mb-4">
              "AI가 인종차별적인 말을 배웠다면, 어느 단계에서 문제가 생긴 걸까요?"
            </p>
            <div className="bg-orange-50 p-4 rounded-xl text-sm text-gray-700 space-y-2">
               <p><strong>1. 데이터 수집:</strong> 인터넷의 나쁜 댓글을 그대로 긁어왔다면?</p>
               <p><strong>2. 전처리:</strong> 나쁜 말을 걸러내지(노이즈 제거) 않았다면?</p>
               <p><strong>3. 모델 학습:</strong> AI가 나쁜 말의 패턴을 그대로 따라했다면?</p>
            </div>
         </div>
         <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
           <h3 className="font-bold text-blue-800 mb-2">셰프의 조언</h3>
           <p className="text-blue-700 text-sm">
             좋은 AI는 기술력뿐만 아니라 윤리적인 데이터와 책임감 있는 학습 과정에서 만들어집니다. 여러분이 미래의 데이터 셰프가 되어 올바른 AI를 만들어주세요!
           </p>
         </div>
      </div>

      <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-orange-500 p-4 text-white font-bold flex items-center gap-2">
          <Bot size={20} /> 셰프에게 물어보기
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                 msg.role === 'user' 
                   ? 'bg-orange-500 text-white rounded-tr-none' 
                   : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
               }`}>
                 {msg.text}
               </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-sm text-gray-400">
                 요리책을 찾아보는 중...
               </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="예: AI가 거짓말을 하면 어떡해?"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 disabled:bg-gray-300"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};