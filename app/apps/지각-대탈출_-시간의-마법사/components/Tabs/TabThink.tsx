import React, { useState } from 'react';
import { Button } from '../Button';
import { MessageSquare, Send } from 'lucide-react';
import { getThinkFeedback } from '../../services/geminiService';

export const TabThink: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;
    
    setIsLoading(true);
    const feedback = await getThinkFeedback(answer);
    setAiResponse(feedback);
    setIsLoading(false);
  };

  return (
    <div className="p-4 pb-20 space-y-6 animate-fade-in">
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-300">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8 opacity-80" />
          <h2 className="text-xl font-bold">생각해볼 문제</h2>
        </div>
        <p className="font-medium text-lg mb-2">
          "라면을 끓일 때 물 끓이기와 스프 넣기를 동시에 할 수 있을까요?"
        </p>
        <p className="text-indigo-200 text-sm leading-relaxed">
          이 상황을 '병렬 처리' 관점에서 생각해보세요. 
          가능하다면 왜 가능한지, 불가능하다면 어떤 '의존성' 때문인지 자유롭게 적어보세요.
          AI 선생님이 피드백을 해줄 거예요!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 생각을 적어보세요..."
          className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm text-gray-900"
        />
        <Button 
          type="submit" 
          disabled={!answer.trim()} 
          isLoading={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <Send className="w-4 h-4 mr-2" />
          AI 선생님에게 물어보기
        </Button>
      </form>

      {aiResponse && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 animate-fade-in-up">
          <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">AI Feedback</h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
};