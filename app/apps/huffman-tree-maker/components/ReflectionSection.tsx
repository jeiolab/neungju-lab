import React, { useState, useEffect } from 'react';
import { REFLECTION_QUESTIONS } from '../constants';
import { Reflection } from '../types';
import { Save } from 'lucide-react';

interface ReflectionSectionProps {
  onSave: (reflections: Reflection[]) => void;
  savedReflections?: Reflection[];
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ onSave, savedReflections }) => {
  const [reflections, setReflections] = useState<Reflection[]>(savedReflections || REFLECTION_QUESTIONS);

  useEffect(() => {
    if (savedReflections && savedReflections.length > 0) {
        setReflections(savedReflections);
    }
  }, [savedReflections]);

  const handleChange = (id: string, text: string) => {
    setReflections(prev => prev.map(r => r.id === id ? { ...r, userAnswer: text } : r));
  };

  const handleSave = () => {
    const updated = reflections.map(r => ({ ...r, isCompleted: r.userAnswer.length > 5 }));
    setReflections(updated);
    onSave(updated);
    alert("생각 노트가 저장되었습니다!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        🤔 생각해볼 문제
      </h2>
      <div className="space-y-6">
        {reflections.map((item, idx) => (
          <div key={item.id} className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 mb-2">Q{idx+1}. {item.question}</h3>
            <textarea
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              rows={3}
              placeholder="자신의 생각을 자유롭게 적어보세요..."
              value={item.userAnswer}
              onChange={(e) => handleChange(item.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button 
        onClick={handleSave}
        className="mt-6 w-full bg-slate-800 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-slate-700"
      >
        <Save size={18} /> 저장하기
      </button>
    </div>
  );
};

export default ReflectionSection;
