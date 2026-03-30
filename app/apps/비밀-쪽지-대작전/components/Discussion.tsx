import React, { useState } from 'react';
import { MessageSquare, Send, User, Bot, Loader2 } from 'lucide-react';
import { getDiscussionFeedback } from '../services/geminiService';

interface DiscussionProps {
  onComplete: () => void;
}

const TOPICS = [
  { id: 'lost_key', text: "만약 내가 만든 암호의 '키'를 잃어버리면 어떻게 될까?" },
  { id: 'teacher_key', text: "선생님이 우리 반의 '키'를 뺏어가면 쪽지를 볼 수 있을까?" },
  { id: 'strong_password', text: "1234 같은 쉬운 키를 쓰면 왜 위험할까?" }
];

const Discussion: React.FC<DiscussionProps> = ({ onComplete }) => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const reply = await getDiscussionFeedback(selectedTopic.text, userMsg);
    
    setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    setLoading(false);
    
    if (!hasParticipated) {
      setHasParticipated(true);
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
       <div className="bg-violet-900 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MessageSquare /> 생각해볼 문제
        </h2>
        <p className="text-violet-200">
          보안 동아리 부장님과 토론해보자. 정답은 없어, 너의 생각이 중요해!
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 flex-1 flex flex-col overflow-hidden min-h-[500px]">
        {/* Topic Selector */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <label className="block text-sm font-bold text-slate-500 mb-2">토론 주제 선택:</label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TOPICS.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${selectedTopic.id === t.id 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'}
                `}
              >
                {t.text}
              </button>
            ))}
          </div>
          <p className="mt-3 text-lg font-bold text-slate-800">Q. {selectedTopic.text}</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.length === 0 && (
             <div className="text-center text-slate-400 mt-10">
               <Bot size={48} className="mx-auto mb-2 opacity-50"/>
               <p>네 생각을 자유롭게 적어봐!</p>
             </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                  ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'}`}>
                  {m.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed
                  ${m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}
                `}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="flex gap-2 items-center bg-white border border-slate-200 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
                 <Loader2 size={16} className="animate-spin text-violet-600"/>
                 <span className="text-xs text-slate-500">부장님이 답변 작성 중...</span>
               </div>
             </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여기에 답변을 입력하세요..."
            className="flex-1 px-4 py-3 bg-slate-100 border-transparent focus:bg-white border focus:border-violet-500 rounded-xl outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Discussion;