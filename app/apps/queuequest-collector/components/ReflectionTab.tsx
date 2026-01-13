import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const PROMPTS = [
  { id: 1, type: '조건 바꾸기', q: '만약 조사 기간을 1일에서 10일로 늘린다면, 결과의 신뢰도는 어떻게 달라질까요?' },
  { id: 2, type: '반례 찾기', q: '설문조사만으로 "매점 혼잡도"를 정확히 알 수 없는 상황은 언제일까요?' },
  { id: 3, type: '적용 설계하기', q: '우리 반의 "가장 조용한 시간"을 찾으려면 어떤 데이터를 모아야 할까요?' }
];

const ReflectionTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('queuequest_reflection');
    if (stored) setAnswers(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem('queuequest_reflection', JSON.stringify(answers));
    alert("생각 노트가 저장되었습니다!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🤔 생각해볼 문제</h2>
        <p className="text-slate-500 mb-6 text-sm">데이터 수집 계획을 더 깊게 고민해보세요. 정답은 없습니다!</p>

        <div className="space-y-8">
            {PROMPTS.map((item) => (
                <div key={item.id} className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">{item.type}</span>
                        <h3 className="font-bold text-slate-800 text-sm md:text-base">{item.q}</h3>
                    </div>
                    <textarea 
                        value={answers[item.id] || ''}
                        onChange={(e) => setAnswers({...answers, [item.id]: e.target.value})}
                        placeholder="나의 생각을 적어보세요..."
                        className="w-full p-3 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                    />
                </div>
            ))}
        </div>

        <div className="mt-6 flex justify-end">
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-900 transition"
            >
                <Save size={18} /> 저장하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionTab;