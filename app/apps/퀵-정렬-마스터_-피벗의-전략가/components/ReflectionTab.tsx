import React, { useState } from 'react';
import { evaluateReflection } from '../services/geminiService';
import { Button } from './Button';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    const result = await evaluateReflection(answer);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in h-full flex flex-col items-center">
      <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            현실 적용 전략
          </h2>
          <p className="text-indigo-100 text-lg">
            "우리 반 아이들 전체를 키 순서대로 퀵 정렬해야 한다고 상상해 보세요."
          </p>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="prose prose-slate">
            <p className="text-xl font-medium text-slate-800">
               가장 빠르게 정렬하기 위해 누구를 <span className="text-indigo-600 font-bold">피벗(Pivot)</span>으로 세우는 것이 좋을까요? 그리고 그 이유는 무엇인가요?
            </p>
            <p className="text-sm text-slate-500">앞서 배운 "최선의 경우"와 "최악의 경우" 시나리오를 떠올려 보세요.</p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="제 생각에는..."
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            disabled={loading || feedback !== null}
          />

          {!feedback && (
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={loading || !answer.trim()} size="lg">
                {loading ? '전략 분석 중...' : (
                    <>답변 제출 <Send className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          )}

          {feedback && (
            <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="bg-white p-2 rounded-full shadow-sm">
                   <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-900 text-lg mb-2">전략가 피드백</h4>
                  <p className="text-indigo-800 leading-relaxed">{feedback}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => { setFeedback(null); setAnswer(''); }}>
                  다른 시나리오 시도하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};