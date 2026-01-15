import React, { useState } from 'react';
import { evaluateThinking } from '../services/geminiService';

const ThinkingSection: React.FC = () => {
  const [prompt] = useState("오늘 학습한 내용 중 가장 혼동되는 개념을 선택하고, 그것이 실제 문제 해결에서 어떻게 잘못 적용될 수 있는지 '반례'를 들어 설명해보세요.");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const result = await evaluateThinking(prompt, answer);
      setFeedback(result);
    } catch (e) {
      setFeedback("피드백 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
        <span className="text-2xl mr-2">🤔</span> 생각해볼 문제
      </h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 mb-4">
        <p className="font-medium text-slate-800">{prompt}</p>
      </div>
      
      {!feedback ? (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="자유롭게 생각을 적어보세요..."
            className="w-full h-32 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !answer}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? "AI 코치가 분석 중..." : "제출하고 피드백 받기"}
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg border border-emerald-200 bg-emerald-50">
          <p className="font-bold text-emerald-800 mb-2">AI 코치의 피드백:</p>
          <p className="text-slate-700 text-sm leading-relaxed">{feedback}</p>
          <button 
            onClick={() => { setFeedback(""); setAnswer(""); }}
            className="mt-3 text-xs text-slate-500 hover:text-indigo-600 underline"
          >
            다른 생각 적어보기
          </button>
        </div>
      )}
    </div>
  );
};

export default ThinkingSection;
