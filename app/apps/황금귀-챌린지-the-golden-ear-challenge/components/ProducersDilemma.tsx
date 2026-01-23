import React, { useState } from 'react';
import { MessageSquare, Send, User, Bot } from 'lucide-react';
import { getExpertExplanation } from '../services/geminiService';

const ProducersDilemma: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "환영합니다, 연습생. 스트리밍 음질에 대해 궁금한 점이 있군요. 스포티파이 등 스트리밍 사이트들은 왜 오랫동안 FLAC 대신 160kbps나 192kbps Ogg/AAC를 표준으로 사용했을까요?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await getExpertExplanation(
      "스트리밍 비트레이트 (192kbps vs 무손실)",
      `사용자 질문/의견: ${userMsg}. 서버 비용, 모바일 데이터 사용량, 그리고 인간이 인지할 수 있는 음질의 차이점(가성비) 사이의 균형에 대해 설명해주세요.`
    );

    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-studio-800 rounded-lg shadow-2xl border border-studio-700">
      <div className="p-4 border-b border-studio-600 flex items-center gap-2">
         <MessageSquare className="text-studio-accent" />
         <h2 className="font-bold text-white">프로듀서의 고민 상담소</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-studio-accent text-black' : 'bg-studio-600 text-white'}`}>
                {msg.role === 'ai' ? <Bot size={18} /> : <User size={18} />}
             </div>
             <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-studio-700 text-gray-200' : 'bg-studio-accent/20 text-studio-accent border border-studio-accent/30'}`}>
                {msg.text}
             </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-studio-accent text-black flex items-center justify-center">
                    <Bot size={18} />
                </div>
                <div className="bg-studio-700 p-3 rounded-lg text-sm text-gray-400 animate-pulse">
                    대역폭 비용 분석 중...
                </div>
            </div>
        )}
      </div>

      <div className="p-4 bg-studio-900 border-t border-studio-600">
        <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="비트레이트와 음질에 대해 물어보세요..."
                className="flex-1 bg-studio-800 border border-studio-600 rounded px-4 py-2 text-white focus:outline-none focus:border-studio-accent"
            />
            <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-studio-accent text-black p-2 rounded hover:bg-cyan-400 disabled:opacity-50"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProducersDilemma;