import React, { useState } from 'react';
import { checkProjectDesign } from '../services/geminiService';
import { Sparkles, Send, FileText, AlertCircle } from 'lucide-react';

const TabDesign: React.FC = () => {
  const [plan, setPlan] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async () => {
    if (!plan.trim()) return;
    setIsLoading(true);
    const result = await checkProjectDesign(plan);
    setFeedback(result || null);
    setIsLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 h-full">
      <div className="flex flex-col h-full space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">우리 조 데이터 공유 계획서</h2>
          <p className="text-sm text-slate-500">
            수행평가나 동아리 활동에서 사용할 데이터를 어떻게 안전하게 수집하고 공유할지 적어보세요.<br/>
            예: "학교 급식 만족도 설문을 구글 폼으로 받아서, 학번은 지우고 엑셀파일을 학급 단톡방에 올릴 거야."
          </p>
        </div>

        <textarea
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          placeholder="계획을 자유롭게 적어주세요..."
          className="flex-1 w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-700 bg-white shadow-sm"
        />

        <button
          onClick={handleAnalysis}
          disabled={isLoading || !plan}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              AI 선생님이 검토 중...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              AI 안전성 검토 받기
            </>
          )}
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <FileText size={120} />
        </div>
        
        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Send className="rotate-45 text-indigo-500" size={20} />
          피드백 리포트
        </h3>

        {feedback ? (
          <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line animate-fade-in bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full overflow-y-auto">
            {feedback}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <AlertCircle size={40} />
            <p className="text-center text-sm">
              왼쪽에 계획을 입력하고 검토 버튼을 누르면<br/>
              구체적인 조언을 받을 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabDesign;