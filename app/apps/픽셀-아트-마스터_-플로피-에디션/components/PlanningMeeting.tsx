import React, { useState } from 'react';
import { evaluateEssay } from '../services/geminiService';
import { PenTool, Send, MessageSquare } from 'lucide-react';

const PlanningMeeting = () => {
  const [essay, setEssay] = useState('');
  const [feedback, setFeedback] = useState<{ feedback: string; stars: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    const result = await evaluateEssay(essay);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-retro text-retro-accent flex items-center gap-2 mb-2">
           <MessageSquare /> 기획 회의
        </h2>
        <div className="bg-retro-panel p-4 rounded border border-gray-600 font-mono text-sm text-gray-300">
            <strong>리드 개발자:</strong> "야! 마케팅 팀에서 왜 자기들 셀카가 우리 앱에서 깨져 보이냐고 자꾸 물어보네. 
            <strong>'인스타그램(그리고 우리)이 왜 사진을 압축해서 저장하는지'</strong> 짧게 설명 좀 써줘. 
            저장 공간, 대역폭(데이터), 사용자 경험 관점에서 말이야."
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea
            className="flex-1 bg-gray-900 border-2 border-gray-700 rounded p-4 font-mono text-gray-200 focus:border-retro-green focus:outline-none resize-none"
            placeholder="여기에 설명을 작성하세요..."
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
        />
        
        <div className="flex justify-end">
            <button 
                onClick={handleSubmit}
                disabled={loading || !essay}
                className={`flex items-center gap-2 bg-retro-green text-black px-6 py-3 rounded font-retro font-bold hover:bg-white transition-colors ${loading ? 'opacity-50' : ''}`}
            >
                {loading ? '제출 중...' : '보고서 제출'} <Send size={16} />
            </button>
        </div>
      </div>

      {feedback && (
        <div className="mt-6 bg-retro-panel border-l-4 border-retro-accent p-6 rounded shadow-lg animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-retro text-lg text-retro-accent mb-2">시니어 개발자 피드백:</h3>
            <div className="flex text-yellow-400 text-xl mb-2">
                {'★'.repeat(feedback.stars)}{'☆'.repeat(5 - feedback.stars)}
            </div>
            <p className="font-mono text-gray-300 italic">"{feedback.feedback}"</p>
        </div>
      )}
    </div>
  );
};

export default PlanningMeeting;