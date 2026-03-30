import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Send, Loader2, Lightbulb } from 'lucide-react';

export const Reflection: React.FC = () => {
  const [scenario, setScenario] = useState('recycling'); // 'recycling' | 'cost'
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const feedbackText = await getReflectionFeedback(
      scenario === 'recycling' ? '분리수거 분류 트리 설계' : '질문 비용과 순서',
      answer
    );
    setFeedback(feedbackText || null);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-indigo-600 text-white">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-300" />
            생각해볼 문제
          </h3>
          <p className="text-indigo-100 mt-2">
            알고리즘을 현실 세계에 적용해봅시다. AI 코치가 피드백을 해줄 거예요!
          </p>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setScenario('recycling'); setFeedback(null); setAnswer(''); }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors border-2 ${
                scenario === 'recycling' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'
              }`}
            >
              🚮 분리수거 로봇
            </button>
            <button
               onClick={() => { setScenario('cost'); setFeedback(null); setAnswer(''); }}
               className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors border-2 ${
                scenario === 'cost' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 hover:border-slate-300 text-slate-600'
              }`}
            >
              ⏱️ 질문의 비용
            </button>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl mb-6">
            {scenario === 'recycling' ? (
              <>
                <h4 className="font-bold text-slate-800 text-lg mb-2">미션: 분리수거 로봇의 뇌 만들기</h4>
                <p className="text-slate-600 mb-2">
                  쓰레기가 컨베이어 벨트 위로 지나갑니다. 로봇팔이 <strong>[캔, 페트병, 종이, 일반쓰레기]</strong>를 분류해야 해요.
                </p>
                <p className="text-slate-600">
                  어떤 질문(센서 확인)을 <strong>가장 먼저</strong> 하는 게 좋을까요? 그리고 그 이유는 무엇인가요?
                  (예: "금속인가?"를 먼저 묻는다. 왜냐하면...)
                </p>
              </>
            ) : (
              <>
                <h4 className="font-bold text-slate-800 text-lg mb-2">미션: 시간이 금이다!</h4>
                <p className="text-slate-600 mb-2">
                   의사가 환자를 진단하려고 합니다.
                   <br/>A검사는 1분 걸리고(비용 저렴), B검사는 1시간 걸립니다(비용 비쌈).
                </p>
                <p className="text-slate-600">
                   B검사가 정확도는 조금 더 높더라도, 의사결정트리에서는 <strong>어떤 순서</strong>로 검사하는 게 효율적일까요? 비용(Cost) 관점에서 설명해보세요.
                </p>
              </>
            )}
          </div>

          <div className="relative">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="여기에 답변을 적어보세요..."
              className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              제출하기
            </button>
          </div>

          {feedback && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl relative">
                <div className="absolute -top-3 -left-3 bg-white p-2 rounded-full shadow-sm border border-green-100">
                  <span className="text-2xl">🤖</span>
                </div>
                <h5 className="font-bold text-green-800 mb-2 ml-4">AI 코치의 피드백</h5>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {feedback}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
