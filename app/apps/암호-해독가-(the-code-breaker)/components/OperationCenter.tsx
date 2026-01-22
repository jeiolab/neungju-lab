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
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
          <Binary /> 작전 본부 (OPERATION CENTER)
        </h2>
        <div className="flex gap-2">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`h-2 w-12 rounded ${step >= s ? 'bg-green-500' : 'bg-slate-700'}`} />
           ))}
        </div>
        <button onClick={reset} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
            <RotateCcw size={14} /> 초기화
        </button>
      </div>

      {/* STEP 1: INPUT & FREQUENCY */}
      <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'hidden'}`}>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-xl">
          <label className="block text-sm text-slate-400 mb-2">분석 대상 데이터 (INPUT STRING)</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-black border border-green-800 text-green-400 p-4 rounded font-mono text-lg focus:outline-none focus:border-green-500"
              placeholder="압축할 텍스트 입력..."
              maxLength={20}
            />
            <button 
              onClick={handleAnalyze}
              className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 rounded flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Play size={20} /> 분석 개시
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: FREQUENCY VISUALIZATION */}
      {step >= 2 && (
        <div className={`bg-slate-900/50 p-6 rounded border border-slate-800 ${step === 2 ? 'ring-2 ring-green-500/50' : ''}`}>
             <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
               {step > 2 ? <Check className="text-green-500" /> : <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />}
               빈도수 스펙트럼 (FREQUENCY SPECTRUM)
             </h3>
             <div className="flex gap-4 items-end h-32 border-b border-slate-700 pb-2 mb-4 px-4 overflow-x-auto">
                {Object.entries(freqMap).map(([char, count], idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 min-w-[40px]">
                        <div 
                            style={{ height: `${(count / maxFreq) * 100}%` }}
                            className="w-full bg-green-500/30 border-t-2 border-green-400 rounded-t transition-all duration-1000 ease-out"
                        />
                        <span className="font-mono font-bold text-white text-lg">{count}</span>
                        <span className="text-xs text-slate-500 uppercase">{char === ' ' ? '공백' : char}</span>
                    </div>
                ))}
             </div>
             {step === 2 && (
                 <div className="flex justify-center">
                    <button onClick={handleCreateNodes} className="flex items-center gap-2 text-green-400 border border-green-400 hover:bg-green-400 hover:text-black px-6 py-2 rounded transition-all">
                        노드 정렬 및 트리 생성 시작 <ArrowRight size={16} />
                    </button>
                 </div>
             )}
        </div>
      )}

      {/* STEP 3: INTERACTIVE BUILDER */}
      {step === 3 && (
          <div className="bg-black p-6 rounded border border-slate-700 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent opacity-50"></div>
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
            <div className="bg-slate-900 p-4 rounded border border-slate-700 min-h-[400px] overflow-auto flex items-center justify-center">
                 <TreeVisualizer node={root} />
            </div>

            {/* Right: Data */}
            <div className="flex flex-col gap-4">
                <div className="bg-slate-800 p-4 rounded border border-slate-600">
                    <h4 className="text-green-400 font-bold mb-4 flex justify-between items-center">
                        <span>압축 매트릭스 (COMPRESSION MATRIX)</span>
                        <button onClick={handleGenerateCodes} className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">재계산</button>
                    </h4>
                    
                    {Object.keys(codes).length === 0 ? (
                         <button onClick={handleGenerateCodes} className="w-full py-8 border-2 border-dashed border-slate-600 text-slate-400 hover:border-green-500 hover:text-green-400 transition-colors">
                            클릭하여 0과 1 부여하기 (이진 경로 생성)
                         </button>
                    ) : (
                        <div className="overflow-auto max-h-[200px]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-700">
                                    <tr>
                                        <th className="px-3 py-2">문자</th>
                                        <th className="px-3 py-2">빈도</th>
                                        <th className="px-3 py-2">코드 (Binary)</th>
                                        <th className="px-3 py-2">비트 수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(codes).map(([char, code]) => (
                                        <tr key={char} className="border-b border-slate-700 hover:bg-slate-700/50">
                                            <td className="px-3 py-2 font-bold text-white">'{char}'</td>
                                            <td className="px-3 py-2">{freqMap[char]}</td>
                                            <td className="px-3 py-2 font-mono text-green-400">{(code as string)}</td>
                                            <td className="px-3 py-2 text-slate-400">{(code as string).length}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Comparison Stats */}
                {Object.keys(codes).length > 0 && (
                    <div className="bg-slate-800 p-4 rounded border border-slate-600">
                         <h4 className="text-white font-bold mb-2">효율성 보고서 (EFFICIENCY REPORT)</h4>
                         <div className="grid grid-cols-2 gap-4 text-center">
                             <div className="p-2 bg-red-900/20 border border-red-900 rounded">
                                 <div className="text-xs text-slate-400">기존 ASCII (8비트)</div>
                                 <div className="text-xl font-mono text-red-400">{originalBits} bits</div>
                             </div>
                             <div className="p-2 bg-green-900/20 border border-green-900 rounded">
                                 <div className="text-xs text-slate-400">허프만 압축</div>
                                 <div className="text-xl font-mono text-green-400">{compressedBits} bits</div>
                             </div>
                         </div>
                         <div className="mt-4 text-center">
                            <span className="text-3xl font-bold text-white">{savings}%</span>
                            <span className="text-slate-400 text-sm ml-2">공간 절약 (SPACE SAVED)</span>
                         </div>
                         <div className="mt-4 p-3 bg-black rounded font-mono text-xs break-all text-green-500 border border-green-900">
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