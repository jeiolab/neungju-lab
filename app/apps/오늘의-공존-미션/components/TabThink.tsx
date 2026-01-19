import React from 'react';
import { THINK_PROMPTS } from '../constants';
import { Lightbulb, RefreshCw, PenTool } from 'lucide-react';

const TabThink: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-2xl text-white shadow-md">
        <h2 className="text-2xl font-bold mb-2">생각해볼 문제</h2>
        <p className="opacity-80">정답은 없습니다. 논리적인 이유를 스스로 만들어보세요.</p>
      </div>

      <div className="space-y-4">
        {THINK_PROMPTS.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              {item.type === 'change' && <RefreshCw className="text-blue-500" size={20} />}
              {item.type === 'counter' && <Lightbulb className="text-amber-500" size={20} />}
              {item.type === 'design' && <PenTool className="text-green-500" size={20} />}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.title}</span>
            </div>
            
            <h3 className="text-lg font-medium text-slate-800 leading-relaxed mb-4">
              {item.prompt}
            </h3>

            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none h-24"
              placeholder="나의 생각을 정리해보세요..."
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabThink;