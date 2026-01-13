import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { loadStorage, saveStorage } from '../utils';

export const ReflectionSection: React.FC = () => {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loaded = loadStorage('app2_reflection', { q1: '', q2: '', q3: '' });
    setAnswers(loaded);
  }, []);

  const handleChange = (field: keyof typeof answers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveStorage('app2_reflection', answers);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
       <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-blue-900 mb-2">🤔 생각 실험실</h2>
          <p className="text-blue-800">
            RLE의 한계와 응용에 대해 자유롭게 적어보세요. 정답은 없습니다. 논리가 중요해요!
          </p>
       </div>

       <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <label className="block font-bold text-slate-800 mb-2">
                1. 조건 바꾸기
             </label>
             <p className="text-sm text-slate-500 mb-4">
                만약 색상이 3가지가 아니라 1,000가지가 된다면(예: 고화질 사진), RLE의 효율은 어떻게 변할까요?
             </p>
             <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="내 생각 적기..."
                value={answers.q1}
                onChange={(e) => handleChange('q1', e.target.value)}
             />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <label className="block font-bold text-slate-800 mb-2">
                2. 반례 찾기
             </label>
             <p className="text-sm text-slate-500 mb-4">
                체커보드(체스판) 패턴 외에, RLE 압축을 했을 때 용량이 오히려 커지는 '최악의 패턴'을 하나 더 찾아보세요.
             </p>
             <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="예: 그라데이션이 있는 경우..."
                value={answers.q2}
                onChange={(e) => handleChange('q2', e.target.value)}
             />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <label className="block font-bold text-slate-800 mb-2">
                3. 적용 설계
             </label>
             <p className="text-sm text-slate-500 mb-4">
                우리 학교 로고를 RLE 친화적으로 다시 디자인한다면? 지켜야 할 디자인 규칙 3가지를 만들어보세요.
             </p>
             <textarea 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
                placeholder="1. 테두리는 없앤다. 2. ..."
                value={answers.q3}
                onChange={(e) => handleChange('q3', e.target.value)}
             />
          </div>
       </div>

       <div className="flex justify-end sticky bottom-6">
          <Button size="lg" onClick={handleSave} className="shadow-lg">
             {saved ? '저장 완료! ✅' : '내 생각 저장하기 💾'}
          </Button>
       </div>
    </div>
  );
};