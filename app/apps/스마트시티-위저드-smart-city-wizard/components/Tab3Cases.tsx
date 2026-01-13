import React, { useState } from 'react';
import { CASES } from '../constants';
import { Pin } from 'lucide-react';

interface Props {
  onPin: (id: string) => void;
}

export const Tab3Cases: React.FC<Props> = ({ onPin }) => {
  const [pinned, setPinned] = useState<string[]>([]);
  const [filter, setFilter] = useState("전체");

  const categories = ["전체", ...Array.from(new Set(CASES.map(c => c.category)))];

  const handlePin = (id: string) => {
    if (pinned.includes(id)) {
      setPinned(pinned.filter(p => p !== id));
    } else {
      setPinned([...pinned, id]);
      onPin(id);
    }
  };

  const filteredCases = filter === "전체" ? CASES : CASES.filter(c => c.category === filter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-indigo-800">3. 스마트 서비스 사례 탐구</h2>
      
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              filter === cat 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCases.map(c => (
          <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{c.category}</span>
              <button 
                onClick={() => handlePin(c.id)}
                className={`p-2 rounded-full transition-colors ${pinned.includes(c.id) ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300 hover:text-indigo-400'}`}
                title="내 아이디어로 핀하기"
              >
                <Pin size={20} fill={pinned.includes(c.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{c.title}</h3>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{c.content}</p>
            <div className="flex gap-2">
              {c.tags.map(tag => (
                <span key={tag} className="text-xs text-slate-500">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};