import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { getEthicsChairmanFeedback } from '../services/geminiService';

export const TabThink: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const topic = "생성형 AI가 학습한 데이터를 바탕으로 그린 그림이나 작곡한 음악의 저작권은 누구에게 있다고 생각합니까? (1) AI 개발자 (2) 프롬프트를 입력한 사용자 (3) 학습 데이터 원작자 (4) 저작권 없음";

  const handleSubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setFeedback(null);
    
    const response = await getEthicsChairmanFeedback(userInput, topic);
    
    setFeedback(response);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">생각해볼 문제</h2>
        <p className="text-gray-600">정답이 없는 문제에 대해 당신의 판결을 내리고, 위원장의 피드백을 받아보세요.</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-law-blue/5 p-6 border-b border-gray-200">
          <h3 className="font-bold text-lg text-law-blue flex items-center gap-2 mb-3">
            <MessageSquare size={20} />
            오늘의 주제: AI 창작물의 저작권
          </h3>
          <p className="text-gray-800 font-medium leading-relaxed">
            {topic}
          </p>
        </div>

        <div className="p-6">
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-law-gold focus:border-transparent resize-none mb-4"
            placeholder="당신의 의견을 자유롭게 적어주세요. 예: 저는 2번이라고 생각합니다. 왜냐하면 AI는 도구일 뿐이고..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isLoading}
          />
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
                isLoading || !userInput.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-law-blue hover:bg-slate-800 shadow-md'
              }`}
            >
              {isLoading ? (
                <>
                  <Sparkles className="animate-spin" size={18} />
                  위원장 검토 중...
                </>
              ) : (
                <>
                  <Send size={18} />
                  의견 제출하기
                </>
              )}
            </button>
          </div>
        </div>

        {feedback && (
          <div className="bg-law-gold/10 p-8 border-t border-law-gold/30 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-law-blue rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚖️</span>
              </div>
              <div>
                <h4 className="font-bold text-law-blue mb-2">AI 윤리 위원장의 피드백</h4>
                <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {feedback}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
