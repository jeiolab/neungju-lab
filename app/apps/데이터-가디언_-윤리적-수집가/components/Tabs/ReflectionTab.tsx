import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { analyzeReflection } from '../../services/geminiService';
import { Sparkles, MessageSquare } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await analyzeReflection(input);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="flex items-center gap-2 mb-4 text-indigo-600">
           <MessageSquare size={24} />
           <h2 className="text-xl font-bold">깊게 생각하기</h2>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          "편리함을 위해 나의 위치 정보를 앱에 넘겨주는 것은 괜찮을까요?"
        </h3>
        <p className="text-slate-600 mb-6">
          많은 앱들이 맛집 추천, 배달 시간 예측 등 더 나은 서비스를 위해 위치 정보를 요구합니다. 
          이것은 공정한 거래일까요? 여러분은 어디까지 허용할 수 있나요?
        </p>

        <textarea
          className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-[150px] mb-4 text-slate-800"
          placeholder="여기에 생각을 적어보세요... (예: 데이터가 바로 삭제된다면 괜찮다고 생각하지만, 만약 저장된다면...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || !input.trim()} variant="primary">
            {loading ? '분석 중...' : 'AI 윤리 교수님께 제출하기'}
          </Button>
        </div>
      </Card>

      {feedback && (
        <Card className="bg-indigo-50 border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex gap-3">
            <div className="mt-1 text-indigo-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 mb-2">AI 교수님의 피드백</h4>
              <div className="prose prose-sm text-indigo-800 whitespace-pre-wrap">
                {feedback}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};