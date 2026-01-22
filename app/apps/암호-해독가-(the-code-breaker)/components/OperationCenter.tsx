import React, { useState, useMemo } from 'react';
import { calculateFrequency, createLeafNodes, generateCodes, calculateBits } from '../services/huffmanLogic';
import { HuffmanNode, FrequencyMap } from '../types';
import { InteractiveTreeBuilder } from './InteractiveTreeBuilder';
import { TreeVisualizer } from './TreeVisualizer';
import { Play, RotateCcw, Check, ArrowRight, Lock, Binary } from 'lucide-react';

interface Props {
  setMastery: React.Dispatch<React.SetStateAction<number>>;
  mastery: number;
}

export const OperationCenter: React.FC<Props> = ({ setMastery, mastery }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [text, setText] = useState('banana');
  const [freqMap, setFreqMap] = useState<FrequencyMap>({});
  const [nodes, setNodes] = useState<HuffmanNode[]>([]);
  const [root, setRoot] = useState<HuffmanNode | null>(null);
  const [codes, setCodes] = useState<Record<string, string>>({});

  // Step 1: Analyze
  const handleAnalyze = () => {
    if (!text) return;
    const f = calculateFrequency(text);
    setFreqMap(f);
    setStep(2);
  };

  // Step 2: Create Nodes & Sort
  const handleCreateNodes = () => {
    const leaves = createLeafNodes(freqMap);
    // Sort logic happens in the builder, but here we just prep the data
    setNodes(leaves);
    setStep(3);
  };

  // Step 3 Completion Handler
  const handleTreeComplete = (treeRoot: HuffmanNode) => {
    setRoot(treeRoot);
    setStep(4);
  };

  // Step 4: Generate Codes
  const handleGenerateCodes = () => {
    if (!root) return;
    const c = generateCodes(root);
    setCodes(c);
  };

  const reset = () => {
    setStep(1);
    setFreqMap({});
    setNodes([]);
    setRoot(null);
    setCodes({});
  };

  const originalBits = text.length * 8;
  const compressedBits = useMemo(() => calculateBits(text, codes), [text, codes]);
  const savings = originalBits > 0 ? ((originalBits - compressedBits) / originalBits * 100).toFixed(1) : 0;

  const maxFreq = useMemo(() => {
    const values = Object.values(freqMap);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [freqMap]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Binary className="text-indigo-600" /> 작전 본부
        </h2>
        <div className="flex gap-2">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`h-2 w-12 rounded ${step >= s ? 'bg-indigo-500' : 'bg-slate-200'}`} />
           ))}
        </div>
        <button onClick={reset} className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm">
            <RotateCcw size={14} /> 초기화
        </button>
      </div>

      {/* STEP 1: INPUT & FREQUENCY */}
      <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'hidden'}`}>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">분석 대상 데이터</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-300 text-slate-800 p-4 rounded-lg font-mono text-lg focus:outline-none focus:border-indigo-500"
              placeholder="압축할 텍스트 입력..."
              maxLength={20}
            />
            <button 
              onClick={handleAnalyze}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap shadow-md"
            >
              <Play size={20} /> 분석 개시
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: FREQUENCY VISUALIZATION */}
      {step >= 2 && (
        <div className={`bg-white p-6 rounded-xl border-2 ${step === 2 ? 'border-indigo-500 shadow-md' : 'border-slate-200'}`}>
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               {step > 2 ? <Check className="text-green-600" /> : <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse" />}
               빈도수 스펙트럼
             </h3>
             <div className="flex gap-4 items-end h-32 border-b border-slate-200 pb-2 mb-4 px-4 overflow-x-auto">
                {Object.entries(freqMap).map(([char, count], idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-[40px]">
                        <div 
                            style={{ height: `${(count / maxFreq) * 100}%` }}
                            className="w-full bg-indigo-500 border-t-2 border-indigo-600 rounded-t transition-all duration-1000 ease-out"
                        />
                        <span className="font-mono font-bold text-slate-800 text-lg">{count}</span>
                        <span className="text-xs text-slate-600 uppercase">{char === ' ' ? '공백' : char}</span>
                    </div>
                ))}
             </div>
             {step === 2 && (
                 <div className="flex justify-center">
                    <button onClick={handleCreateNodes} className="flex items-center gap-2 text-indigo-600 border-2 border-indigo-500 hover:bg-indigo-50 px-6 py-2 rounded-lg transition-all font-semibold">
                        노드 정렬 및 트리 생성 시작 <ArrowRight size={16} />
                    </button>
                 </div>
             )}
        </div>
      )}

      {/* STEP 3: INTERACTIVE BUILDER */}
      {step === 3 && (
          <div className="bg-white p-6 rounded-xl border-2 border-indigo-500 shadow-md relative overflow-hidden">
             <InteractiveTreeBuilder 
                initialNodes={nodes} 
                onComplete={handleTreeComplete} 
                onError={() => setMastery(m => Math.max(0, m - 5))}
             />
          </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && root && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
            {/* Left: Tree */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-h-[400px] overflow-auto flex items-center justify-center">
                 <TreeVisualizer node={root} />
            </div>

            {/* Right: Data */}
            <div className="flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="text-slate-800 font-bold mb-4 flex justify-between items-center">
                        <span>압축 매트릭스</span>
                        <button onClick={handleGenerateCodes} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700">재계산</button>
                    </h4>
                    
                    {Object.keys(codes).length === 0 ? (
                         <button onClick={handleGenerateCodes} className="w-full py-8 border-2 border-dashed border-slate-300 text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors rounded-lg">
                            클릭하여 0과 1 부여하기 (이진 경로 생성)
                         </button>
                    ) : (
                        <div className="overflow-auto max-h-[200px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-3 py-2">문자</th>
                                        <th className="px-3 py-2">빈도</th>
                                        <th className="px-3 py-2">코드 (Binary)</th>
                                        <th className="px-3 py-2">비트 수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(codes).map(([char, code]) => (
                                        <tr key={char} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-3 py-2 font-bold text-slate-800">'{char}'</td>
                                            <td className="px-3 py-2 text-slate-600">{freqMap[char]}</td>
                                            <td className="px-3 py-2 font-mono text-indigo-600">{(code as string)}</td>
                                            <td className="px-3 py-2 text-slate-500">{(code as string).length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Comparison Stats */}
                {Object.keys(codes).length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                         <h4 className="text-slate-800 font-bold mb-2">효율성 보고서</h4>
                         <div className="grid grid-cols-2 gap-4 text-center">
                             <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                                 <div className="text-xs text-slate-600">기존 ASCII (8비트)</div>
                                 <div className="text-xl font-mono text-red-600">{originalBits} bits</div>
                             </div>
                             <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                                 <div className="text-xs text-slate-600">허프만 압축</div>
                                 <div className="text-xl font-mono text-green-600">{compressedBits} bits</div>
                             </div>
                         </div>
                         <div className="mt-4 text-center">
                            <span className="text-3xl font-bold text-slate-800">{savings}%</span>
                            <span className="text-slate-600 text-sm ml-2">공간 절약</span>
                         </div>
                         <div className="mt-4 p-3 bg-slate-50 rounded-lg font-mono text-xs break-all text-indigo-600 border border-slate-200">
                            {text.split('').map(c => codes[c]).join(' ')}
                         </div>
                    </div>
                )}
            </div>
         </div>
      )}
    </div>
  );
};