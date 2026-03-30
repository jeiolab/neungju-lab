import React, { useState } from 'react';
import { generateDiscussionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!thought.trim()) return;
    
    setIsLoading(true);
    setAiResponse('');
    
    const response = await generateDiscussionFeedback(thought);
    
    setAiResponse(response);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">🤔 생각해볼 문제</h2>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <h3 className="font-bold text-yellow-800 text-lg">"인터넷이 끊기면 우리 집은 마비될까?"</h3>
        <p className="text-yellow-700 mt-1">
          만약 모든 데이터가 멀리 있는 클라우드 서버로만 간다면, 인터넷이 끊겼을 때 현관문도 안 열릴 수 있습니다.<br/>
          집 안에서 데이터를 바로 처리하는 <strong>'엣지 컴퓨팅(Edge Computing)'</strong>에 대해 어떻게 생각하나요?
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          나의 생각 적기
        </label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="예: 중요한 정보는 집 안에서 처리해야 안전할 것 같아요..."
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
        />
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !thought.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI 선생님 생각하는 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> 제출하기
              </>
            )}
          </button>
        </div>
      </div>

      {aiResponse && (
        <div className="mt-6 bg-indigo-50 rounded-xl p-6 border border-indigo-100 fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-indigo-800">AI 선생님의 피드백</h3>
          </div>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
};

export default TabDiscussion;