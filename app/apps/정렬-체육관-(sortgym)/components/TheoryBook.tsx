import React, { useState } from 'react';
import { ALGORITHMS } from '../constants';
import { ChevronDown, ChevronUp, Code, BookOpen } from 'lucide-react';

const TheoryBook: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('Selection');
  const [showCode, setShowCode] = useState<boolean>(false);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <BookOpen className="mr-2 text-indigo-600" /> 핵심 개념 정리
      </h2>
      
      <div className="space-y-4">
        {Object.values(ALGORITHMS).map((algo) => (
          <div key={algo.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <button
              onClick={() => toggle(algo.id)}
              className="w-full px-6 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg text-slate-800">{algo.name}</span>
                <div className="flex space-x-2">
                   {algo.keywords.map(k => (
                     <span key={k} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">{k}</span>
                   ))}
                </div>
              </div>
              {openId === algo.id ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
            </button>

            {openId === algo.id && (
              <div className="p-6 border-t border-slate-200">
                <p className="text-slate-700 mb-4 text-lg">{algo.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">복잡도 (시간/공간)</h4>
                    <ul className="text-sm space-y-1 text-slate-600">
                      <li><span className="font-medium text-slate-900">최선:</span> {algo.bestCase}</li>
                      <li><span className="font-medium text-slate-900">평균:</span> {algo.avgCase}</li>
                      <li><span className="font-medium text-slate-900">최악:</span> {algo.worstCase}</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">장단점</h4>
                    <div className="text-sm space-y-2">
                       <div>
                         <span className="text-emerald-600 font-bold">장점:</span> {algo.pros.join(', ')}
                       </div>
                       <div>
                         <span className="text-rose-600 font-bold">단점:</span> {algo.cons.join(', ')}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="font-semibold text-slate-800 flex items-center">
                       <Code className="w-4 h-4 mr-1" /> 구현 코드
                     </h4>
                     <div className="flex bg-slate-100 rounded-lg p-1">
                        <button 
                          onClick={() => setShowCode(false)}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${!showCode ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                        >
                          Python
                        </button>
                        <button 
                          onClick={() => setShowCode(true)}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${showCode ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                        >
                          Pseudo-code
                        </button>
                     </div>
                  </div>
                  <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                    <code>{showCode ? algo.codePseudo : algo.codePython}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoryBook;
