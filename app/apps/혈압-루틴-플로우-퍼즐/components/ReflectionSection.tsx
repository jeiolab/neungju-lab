import React, { useState, useEffect } from 'react';
import { REFLECTION_QUESTIONS } from '../constants';
import { Save, PenTool } from 'lucide-react';

interface ReflectionSectionProps {
  savedReflections: { [key: string]: string };
  onSave: (id: string, text: string) => void;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ savedReflections, onSave }) => {
  const [localTexts, setLocalTexts] = useState(savedReflections);

  useEffect(() => {
    setLocalTexts(savedReflections);
  }, [savedReflections]);

  const handleChange = (id: string, val: string) => {
    setLocalTexts(prev => ({ ...prev, [id]: val }));
  };

  const handleBlur = (id: string) => {
    if (localTexts[id] !== savedReflections[id]) {
      onSave(id, localTexts[id]);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">생각해볼 문제</h2>
        <p className="opacity-90">
          단순히 정답을 맞추는 것을 넘어, 왜 이런 구조가 필요한지 스스로 정리해보세요.
          작성한 내용은 브라우저에 자동 저장됩니다.
        </p>
      </div>

      <div className="grid gap-6">
        {REFLECTION_QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-start gap-2">
              <PenTool className="text-purple-500 mt-1 flex-shrink-0" size={20} />
              {q.text}
            </h3>
            <textarea
              value={localTexts[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              onBlur={() => handleBlur(q.id)}
              placeholder="여기에 생각을 적어보세요..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
            />
            <div className="flex justify-end mt-2">
               {localTexts[q.id] !== savedReflections[q.id] && (
                 <span className="text-xs text-amber-500 font-medium animate-pulse">저장되지 않음 (커서를 밖으로 이동하세요)</span>
               )}
               {localTexts[q.id] === savedReflections[q.id] && localTexts[q.id] && (
                 <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                   <Save size={12} /> 저장됨
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReflectionSection;