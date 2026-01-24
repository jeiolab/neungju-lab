import React, { useState } from 'react';
import { generateReflectionContent } from '../services/geminiService';
import { MessageSquare, Brain, Loader2 } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [topic, setTopic] = useState("디지털 피로감");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateReflectionContent(topic);
    setContent(result);
    setLoading(false);
    setHasLoaded(true);
  };

  const predefinedTopics = [
    "디지털 피로감",
    "개인정보 보호",
    "인간 소외 문제",
    "기술 의존도 심화"
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto h-full flex flex-col">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm shrink-0">
        <h2 className="text-2xl font-bold text-pink-600 mb-2 flex items-center">
          <Brain className="mr-2" /> 생각해볼 문제
        </h2>
        <p className="text-slate-600">
          모든 것이 연결된 세상이 과연 좋기만 할까요? AI 선생님에게 물어보고 생각해보세요.
        </p>
      </div>

      {!hasLoaded ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {predefinedTopics.map((t) => (
              <button
                key={t}
                onClick={() => { setTopic(t); handleGenerate(); }}
                disabled={loading}
                className="p-6 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 hover:border-pink-300 shadow-sm transition-all text-left group"
              >
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-pink-600 mb-1 transition-colors">{t}</h3>
                <p className="text-xs text-slate-500">AI와 함께 토론하기</p>
              </button>
            ))}
           </div>
           
           {loading && (
             <div className="flex items-center text-pink-600 animate-pulse mt-4">
               <Loader2 className="animate-spin mr-2" /> AI가 생각을 정리하고 있습니다...
             </div>
           )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex-1 overflow-y-auto mb-4 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              주제: {topic}
            </h3>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-700 text-lg">
                {content}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setHasLoaded(false); setContent(""); }}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold transition-colors"
          >
            다른 주제 선택하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;