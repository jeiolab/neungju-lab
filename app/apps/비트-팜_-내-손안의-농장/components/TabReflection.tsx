import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Lightbulb } from 'lucide-react';

export const TabReflection: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    const feedback = await getReflectionFeedback(idea);
    setResponse(feedback ?? null);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
       <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-green-800 mb-4">🤔 생각해보기</h2>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-stone-200 text-left">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-indigo-700">
                <Lightbulb className="fill-indigo-100" />
                오늘의 질문
            </h3>
            <p className="text-lg text-stone-700 leading-relaxed font-medium">
                "우리가 게임에서 만든 농장은 작은 텃밭 정도였어요.<br/>
                만약 <span className="text-indigo-600 font-bold">서울시만 한 크기의 거대한 농장</span>을 운영해야 한다면, 
                마이크로비트 라디오 통신(짧은 거리 통신)만으로 충분할까요?<br/>
                어떤 통신 방법을 쓰면 좋을지 자유롭게 상상해서 적어보세요."
            </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
            <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="예: 와이파이 공유기를 아주 많이 설치해요, 드론이 날아다니면서 데이터를 수집해요..."
                className="w-full p-5 rounded-xl border-2 border-stone-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all resize-none h-32 text-lg shadow-inner"
            ></textarea>
            <button 
                type="submit" 
                disabled={loading || !idea.trim()}
                className="absolute bottom-4 right-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-stone-300 transition-colors shadow-lg"
            >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
            </button>
        </div>
      </form>

      {response && (
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-slide-up">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <MessageSquare className="text-indigo-600" size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-indigo-900 mb-2">AI 선생님의 피드백</h4>
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                        {response}
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
