import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';
import { Save } from 'lucide-react';

const QUESTIONS = [
  { id: 'q1', text: '만약 5G 데이터 요금이 무료라면, 넷플릭스나 유튜브는 압축 기술을 포기할까요? 그 이유는?' },
  { id: 'q2', text: 'JPEG 파일이 PNG 파일보다 용량이 더 커지는 경우는 언제일까요? (힌트: 색상이 단순할 때)' },
  { id: 'q3', text: '학교 축제 포스터(로고, 사진, 약도 포함)를 인스타그램과 대형 현수막용으로 각각 저장한다면 어떤 포맷을 써야 할까요?' }
];

const Reflection: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.REFLECTION);
    if (stored) setAnswers(JSON.parse(stored));
  }, []);

  const handleChange = (id: string, text: string) => {
    setAnswers(prev => ({ ...prev, [id]: text }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEYS.REFLECTION, JSON.stringify(answers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-indigo-900 mb-2">생각해볼 문제</h2>
        <p className="text-indigo-700">정답은 없습니다. 배운 내용을 바탕으로 나만의 논리를 펼쳐보세요.</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-800">{q.text}</h3>
            <textarea
              className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-slate-700"
              placeholder="여기에 생각을 적어보세요..."
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save className="w-5 h-5" />
          {saved ? '저장 완료!' : '내 답변 저장하기'}
        </button>
      </div>
    </div>
  );
};

export default Reflection;
