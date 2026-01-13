import React, { useState } from 'react';
import { getGeminiFeedback } from '../services/geminiService';
import { MessageSquare, Sparkles, Send } from 'lucide-react';

export const AppliedDesignTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setFeedback('');
    
    // Check if API Key is available
    if (!process.env.API_KEY) {
        setFeedback("시뮬레이션 피드백 (AI 키 없음): 훌륭한 설계입니다! 정전 시를 대비한 보조 전원과 어두운 곳에서도 식별 가능한 버튼 디자인을 고려해보세요.");
        setLoading(false);
        return;
    }

    const response = await getGeminiFeedback(input, "응용 설계: 학교 종/방송 시스템 연동");
    setFeedback(response);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            도전 과제: 학교 시스템 연동
          </h2>
          <p className="text-indigo-100">
            확장 설계: 이 무음 신고 시스템을 기존 학교의 수업 종(Bell) 또는 방송 시스템(PA)과 어떻게 연동하시겠습니까?
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-200">
             <strong>질문:</strong> 만약 선생님이 "무음 침입자 경보" 버튼(A+B)을 누른다면, 학교 방송 시스템은 어떻게 반응해야 할까요? 벨이 울려야 할까요? 녹음된 메시지가 나와야 할까요? 아니면 조용히 있어야 할까요? 여러분의 알고리즘을 설명해주세요.
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="여기에 설계 제안을 적어주세요 (예: 'A+B가 눌리면, 방송 시스템은...')"
            className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-md"
            >
              {loading ? (
                <>분석 중...</>
              ) : (
                <>
                  <Send className="w-4 h-4" /> AI 코치 피드백 받기
                </>
              )}
            </button>
          </div>

          {feedback && (
            <div className="mt-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold">
                <MessageSquare className="w-5 h-5" />
                AI 코치 피드백
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-gray-800 leading-relaxed whitespace-pre-line">
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
