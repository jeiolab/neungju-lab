import React, { useState, useEffect } from 'react';
import { ReflectionEntry } from '../types';
import { Save, Book } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [currentText, setCurrentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem('commute_v1_reflections');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = (type: ReflectionEntry['type']) => {
    if (!currentText[type]?.trim()) return;
    
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      type,
      content: currentText[type],
      date: new Date().toLocaleDateString()
    };
    
    const updated = [...entries, newEntry];
    setEntries(updated);
    localStorage.setItem('commute_v1_reflections', JSON.stringify(updated));
    setCurrentText({ ...currentText, [type]: '' });
    alert('저장되었습니다!');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-orange-50 p-5 rounded-lg border border-orange-100">
         <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
           <Book size={20} />
           생각해볼 문제
         </h2>
         <p className="text-sm text-orange-700 mt-2">
           코딩은 문법을 외우는 게 아니라, 생각을 구조화하는 과정입니다. 오늘 배운 내용을 글로 정리해보세요. (로컬에만 저장됩니다)
         </p>
      </div>

      <div className="space-y-6">
        {/* Prompt 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">1. 조건 바꾸기</h3>
          <p className="text-sm text-slate-600 mb-3">만약 "지각 기준"이 고정된 시간이 아니라, "수업 시작 전 10분"으로 매번 바뀐다면 조건식을 어떻게 세워야 할까요?</p>
          <textarea 
            className="w-full h-24 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="예: arrival_time <= class_start_time - 10 처럼..."
            value={currentText['change_condition'] || ''}
            onChange={(e) => setCurrentText({...currentText, 'change_condition': e.target.value})}
          />
          <div className="mt-2 flex justify-end">
             <button onClick={() => saveEntry('change_condition')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-sm font-bold hover:bg-indigo-700">
               <Save size={16}/> 저장하기
             </button>
          </div>
        </div>

        {/* Prompt 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">2. 반례 찾기</h3>
          <p className="text-sm text-slate-600 mb-3">"비가 오면 무조건 택시"라는 규칙의 허점(문제점)은 무엇일까요? 예외 상황을 생각해보세요.</p>
          <textarea 
            className="w-full h-24 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="예: 돈이 아예 없을 수도 있고, 택시가 안 잡힐 수도 있다..."
            value={currentText['find_counter'] || ''}
            onChange={(e) => setCurrentText({...currentText, 'find_counter': e.target.value})}
          />
          <div className="mt-2 flex justify-end">
             <button onClick={() => saveEntry('find_counter')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded text-sm font-bold hover:bg-indigo-700">
               <Save size={16}/> 저장하기
             </button>
          </div>
        </div>

        {/* Display Saved List */}
        {entries.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-slate-800 mb-4">내 생각 기록</h3>
            <div className="space-y-3">
              {entries.map((entry) => (
                 <div key={entry.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-xs font-bold text-indigo-600 uppercase">
                       {entry.type === 'change_condition' ? '조건 바꾸기' : '반례 찾기'}
                     </span>
                     <span className="text-xs text-slate-400">{entry.date}</span>
                   </div>
                   <p className="text-sm text-slate-700">{entry.content}</p>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
