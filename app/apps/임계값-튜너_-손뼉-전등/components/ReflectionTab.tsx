import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2 } from 'lucide-react';
import { ReflectionEntry } from '../types';
import * as storageService from '../services/storageService';

const ReflectionTab: React.FC = () => {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [situation, setSituation] = useState('');
  const [counterExample, setCounterExample] = useState('');
  const [solution, setSolution] = useState('');

  useEffect(() => {
    setEntries(storageService.getReflections());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation || !counterExample || !solution) return;

    const newEntry: ReflectionEntry = {
      situation,
      counterExample,
      solution,
      timestamp: Date.now(),
    };

    storageService.saveReflection(newEntry);
    setEntries(storageService.getReflections());
    
    // Reset form
    setSituation('');
    setCounterExample('');
    setSolution('');
    alert("반례 보고서가 저장되었습니다!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <PenTool size={24} />
            <h2 className="text-xl font-bold">엔지니어링 노트 작성</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                1. 적용 환경 (예: 도서관, 클럽, 우리집 거실)
              </label>
              <input 
                type="text" 
                value={situation}
                onChange={e => setSituation(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="어디에 전등을 설치하나요?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                2. 반례 찾기 (오작동 시나리오)
              </label>
              <textarea 
                value={counterExample}
                onChange={e => setCounterExample(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                placeholder="예: 문이 쾅 닫히는 소리에 전등이 켜질 것 같다."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                3. 개선 설계 (안전장치)
              </label>
              <textarea 
                value={solution}
                onChange={e => setSolution(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                placeholder="예: 연속으로 두 번 손뼉을 쳐야 켜지도록 바꾼다."
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 transition"
            >
              <Save size={18} /> 노트 저장하기
            </button>
          </form>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-700">작성된 보고서 ({entries.length})</h3>
        <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
          {entries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              작성된 노트가 없습니다. <br/>첫 번째 반례를 찾아보세요!
            </div>
          ) : (
            entries.map((entry, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                <div className="text-xs text-slate-400 mb-2">{new Date(entry.timestamp).toLocaleDateString()}</div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">환경</span>
                    <p className="text-slate-800 mt-1 font-medium">{entry.situation}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">반례</span>
                    <p className="text-slate-600 mt-1 text-sm">{entry.counterExample}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">해결책</span>
                    <p className="text-slate-600 mt-1 text-sm">{entry.solution}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionTab;