import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { Button } from './Button';
import { MessageSquare, Sparkles, Loader2 } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await getReflectionFeedback(answer);
      setFeedback(response);
    } catch (e) {
      setFeedback("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">생각해볼 문제</h2>
        <div className="bg-indigo-50 p-6 rounded-xl inline-block mb-6">
          <p className="text-indigo-900 text-lg font-medium leading-relaxed">
            "우리 반 30명이 운동장에 모여있습니다.<br/>
            선생님이 <span className="font-bold">'번호 순서대로 한 줄로 서!'</span>라고 하셨을 때,<br/>
            가장 빠르고 혼란 없이 줄을 서는 방법은 무엇일까요?"
          </p>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          여러분의 아이디어를 자유롭게 적어보세요. <br/>
          수석 사서 AI가 여러분의 알고리즘을 분석하고 조언해줍니다.
        </p>
        
        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="예: 반장부터 나와서 기준을 잡고, 자기 번호에 맞는 자리를 찾아 들어간다..."
            className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-shadow"
          />
          <div className="absolute bottom-4 right-4">
            <Button onClick={handleSubmit} disabled={loading || !answer.trim()} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI 피드백 받기
            </Button>
          </div>
        </div>
      </section>

      {feedback && (
        <section className="bg-gradient-to-br from-indigo-600 to-purple-700 p-1 rounded-2xl shadow-lg animate-slide-up">
           <div className="bg-white rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">수석 사서의 피드백</h3>
              </div>
              <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {feedback}
              </div>
           </div>
        </section>
      )}
    </div>
  );
};
