import React, { useState } from 'react';
import { getGeminiExplanation } from '../services/geminiService';
import { Lightbulb, MessageCircle, Cpu } from 'lucide-react';

const TOPICS = [
  "왜 비대칭키가 대칭키보다 느릴까요?",
  "양자 컴퓨터가 나오면 현재 암호화는 뚫리나요?",
  "블록체인에서는 어떤 키를 사용하나요?",
  "내 비밀번호는 서버에 어떻게 저장되나요?"
];

const ThinkAboutIt: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTopicClick = async (topic: string) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setExplanation(null);
    
    const result = await getGeminiExplanation(topic, "초등학생도 이해할 수 있는 쉬운 비유(자물쇠, 수학문제 등)를 들어 설명");
    setExplanation(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 flex justify-center items-center">
          <Lightbulb className="text-yellow-500 mr-2" fill="currentColor" />
          생각해볼 문제
        </h2>
        <p className="text-slate-600 mt-2">보안 전문가가 되기 위한 심화 질문들입니다. AI 튜터에게 물어보세요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleTopicClick(topic)}
              className={`w-full text-left p-4 rounded-xl border transition-all hover:shadow-md flex items-center
                ${selectedTopic === topic ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'border-slate-200 bg-white hover:border-purple-300'}
              `}
            >
              <span className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold flex-shrink-0">
                {idx + 1}
              </span>
              <span className="font-medium text-slate-800">{topic}</span>
            </button>
          ))}
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-white min-h-[300px] flex flex-col relative shadow-2xl">
           <div className="border-b border-slate-700 pb-4 mb-4 flex items-center">
             <Cpu className="mr-2 text-cyan-400" />
             <span className="font-mono text-cyan-400">AI Security Tutor</span>
           </div>

           <div className="flex-1 overflow-y-auto">
             {!selectedTopic ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                 <MessageCircle size={48} />
                 <p>궁금한 주제를 왼쪽에서 선택해주세요.</p>
               </div>
             ) : (
               <div className="space-y-4">
                 <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none inline-block max-w-[90%]">
                   <p className="text-sm text-slate-300 mb-1">질문:</p>
                   <p className="font-bold">{selectedTopic}</p>
                 </div>
                 
                 {isLoading ? (
                   <div className="flex items-center space-x-2 text-slate-400 mt-4">
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                     <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                     <span>답변 생성 중...</span>
                   </div>
                 ) : (
                   <div className="flex justify-end">
                      <div className="bg-cyan-900/50 border border-cyan-800 p-4 rounded-lg rounded-tr-none text-cyan-100 leading-relaxed animate-fade-in">
                        {explanation}
                      </div>
                   </div>
                 )}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThinkAboutIt;
