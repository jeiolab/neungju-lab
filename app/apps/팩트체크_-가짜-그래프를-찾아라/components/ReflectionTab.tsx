import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';

interface ReflectionTabProps {
  onScoreUpdate: (points: number) => void;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({ onScoreUpdate }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    const evaluation = await evaluateReflection(input);
    setResult(evaluation);
    onScoreUpdate(Math.ceil(evaluation.score / 5)); // Add simplified score
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center">
        <MessageSquare size={48} className="mx-auto text-purple-400 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">최종 탐정 보고서</h2>
        <p className="text-slate-400 mb-6">
          비판적 사고가 최고의 도구입니다. 다음 질문에 자신의 말로 답해보세요:
        </p>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-600 mb-8 inline-block">
          <p className="text-lg text-white font-serif italic">
            "통계 그래프로 사람들을 속이는 것이 왜 사회에 위험할까요?"
          </p>
        </div>

        {!result ? (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none placeholder-slate-500"
              placeholder="여기에 분석 내용을 입력하세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 text-white font-bold rounded-lg transition-all flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> 증거 분석 중...
                </>
              ) : (
                <>
                  <Send size={18} /> 보고서 제출
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/50 p-6 rounded-xl animate-fadeIn text-left">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-yellow-400" /> 평가 결과
              </h3>
              <div className="text-right">
                <span className="block text-xs text-slate-400 uppercase">사고력 점수</span>
                <span className="text-2xl font-bold text-purple-400">{result.score}/100</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed mb-4">
              "{result.feedback}"
            </p>
            <button 
              onClick={() => setResult(null)}
              className="text-sm text-slate-400 hover:text-white underline"
            >
              답변 수정하기
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h4 className="text-slate-300 font-bold mb-2">이것이 중요한 이유:</h4>
        <ul className="list-disc list-inside text-slate-400 space-y-2 text-sm">
          <li>오해의 소지가 있는 그래프는 선거와 공공 정책에 영향을 미칠 수 있습니다.</li>
          <li>소비자가 질 낮은 제품을 구매하도록 속일 수 있습니다.</li>
          <li>기후 변화나 경제와 같은 중요한 문제에 대한 이해를 왜곡합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReflectionTab;