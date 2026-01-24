import React, { useState } from 'react';
import { analyzeReflection } from '../services/geminiService';
import { checkForPII } from '../utils/piiGuard';
import { BrainCircuit, Send, Sparkles, AlertCircle } from 'lucide-react';

export const Reflection: React.FC = () => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [piiWarning, setPiiWarning] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    // PII Check
    const check = checkForPII(input);
    if (!check.safe) {
      setPiiWarning(`개인정보(${check.detected.join(', ')})는 입력할 수 없습니다. 내용을 수정해주세요.`);
      return;
    }
    setPiiWarning(null);

    setLoading(true);
    const result = await analyzeReflection(input);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">생각해볼 문제: 반례 찾기</h2>
            <p className="text-sm text-slate-500">완벽해 보이는 규칙도 뚫릴 수 있습니다.</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-700 font-medium mb-3">
            Q. 우리가 만든 규칙이 있어도, 어떤 상황에서는 보안 사고나 갈등이 생길 수 있을까요? 
            구체적인 상황을 상상해서 적어보세요.
          </p>
          <p className="text-xs text-slate-400 mb-2">예: 비밀번호를 걸었지만, 포스트잇에 적어서 모니터에 붙여두었다면?</p>
          
          <textarea
            className="w-full h-32 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none mb-2"
            placeholder="상황을 적어주세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          {piiWarning && (
            <p className="text-red-500 text-sm mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {piiWarning}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                AI가 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> AI 피드백 받기
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-6 animate-fade-in-up">
            <h3 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> AI 선생님의 피드백
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};