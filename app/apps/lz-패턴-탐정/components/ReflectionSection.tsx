import React, { useState, useEffect } from 'react';
import { REFLECTION_QUESTIONS } from '../constants';
import { ReflectionEntry } from '../types';
import { loadReflections, saveReflections } from '../utils/storage';
import { Save } from 'lucide-react';

const ReflectionSection: React.FC = () => {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [activeQuestion, setActiveQuestion] = useState(REFLECTION_QUESTIONS[0].id);

  useEffect(() => {
    setEntries(loadReflections());
  }, []);

  const handleSave = (id: string, answer: string) => {
    const now = new Date().toISOString();
    const newEntries = [...entries];
    const existingIdx = newEntries.findIndex(e => e.id === id);

    if (existingIdx >= 0) {
      newEntries[existingIdx] = { ...newEntries[existingIdx], answer, lastUpdated: now };
    } else {
      newEntries.push({ 
        id, 
        question: REFLECTION_QUESTIONS.find(q => q.id === id)?.question || '',
        answer, 
        lastUpdated: now 
      });
    }

    setEntries(newEntries);
    saveReflections(newEntries);
  };

  const getAnswer = (id: string) => entries.find(e => e.id === id)?.answer || '';

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase px-2 mb-2">질문 목록</h3>
        {REFLECTION_QUESTIONS.map(q => (
          <button
            key={q.id}
            onClick={() => setActiveQuestion(q.id)}
            className={`w-full text-left p-4 rounded-xl text-sm font-medium transition-all ${
              activeQuestion === q.id 
                ? 'bg-white shadow-md border-l-4 border-indigo-500 text-indigo-700' 
                : 'bg-slate-50 hover:bg-white hover:shadow-sm text-slate-600'
            }`}
          >
            {q.question}
          </button>
        ))}
      </div>

      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 h-full flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            {REFLECTION_QUESTIONS.find(q => q.id === activeQuestion)?.question}
          </h2>
          
          <textarea
            className="flex-1 w-full p-4 rounded-xl bg-yellow-50 border-0 focus:ring-2 focus:ring-yellow-400 text-slate-700 leading-relaxed resize-none mb-4 min-h-[300px]"
            placeholder="자신의 생각을 자유롭게 적어보세요..."
            value={getAnswer(activeQuestion)}
            onChange={(e) => handleSave(activeQuestion, e.target.value)}
          ></textarea>

          <div className="flex justify-between items-center text-sm text-slate-400">
            <span>자동 저장됨</span>
            <div className="flex items-center space-x-1 text-green-600">
               <Save className="w-4 h-4" />
               <span>Saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionSection;