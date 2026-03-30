import React, { useState } from 'react';
import { analyzeReflection, ReflectionData } from '../services/gemini';
import { Send, Loader2, Sparkles, AlertTriangle } from 'lucide-react';

const ReflectionSection: React.FC = () => {
  const [data, setData] = useState<ReflectionData>({
    perception: '',
    learning: '',
    reasoning: '',
    action: ''
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (field: keyof ReflectionData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Object.values(data).every((val) => (val as string).trim().length > 0);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setLoading(true);
    setFeedback(null);
    const result = await analyzeReflection(data);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-4">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 mb-2">나만의 에이전트 설계</h1>
        <p className="text-slate-500">내 생활 속 문제를 4단계 파이프라인으로 해결하는 방법을 적어보세요. AI가 피드백을 드립니다.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <label className="block text-sm font-bold text-slate-700 mb-2">1. 인식 (Perception)</label>
          <textarea
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="예: 아침에 알람 소리를 듣고, 현재 시간을 확인한다."
            rows={2}
            value={data.perception}
            onChange={(e) => handleChange('perception', e.target.value)}
          />
        </div>

        <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <label className="block text-sm font-bold text-slate-700 mb-2">2. 학습 (Learning)</label>
          <textarea
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            placeholder="예: 지난번에 5분만 더 자려다가 지각했던 기억을 떠올린다."
            rows={2}
            value={data.learning}
            onChange={(e) => handleChange('learning', e.target.value)}
          />
        </div>

        <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
          <label className="block text-sm font-bold text-slate-700 mb-2">3. 추론 (Reasoning)</label>
          <textarea
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="예: 지금 일어나지 않으면 100% 지각이므로 즉시 기상해야 한다고 판단한다."
            rows={2}
            value={data.reasoning}
            onChange={(e) => handleChange('reasoning', e.target.value)}
          />
        </div>

        <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <label className="block text-sm font-bold text-slate-700 mb-2">4. 행동 (Action)</label>
          <textarea
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            placeholder="예: 이불을 박차고 일어나 화장실로 이동한다."
            rows={2}
            value={data.action}
            onChange={(e) => handleChange('action', e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${!isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}
          `}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> AI 분석 중...</>
          ) : (
            <><Sparkles className="w-5 h-5" /> AI 피드백 받기</>
          )}
        </button>

        {feedback && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-2xl animate-fade-in shadow-inner">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" /> AI 튜터의 피드백
            </h3>
            <p className="text-indigo-800 leading-relaxed text-sm whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionSection;