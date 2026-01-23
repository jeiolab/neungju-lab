import React, { useState, useEffect } from 'react';
import { HuffmanNode } from '../types';
import { calculateFrequencies, createInitialNodes, generateCodes, calculateOriginalBits, calculateTotalBits } from '../services/huffmanLogic';
import TreeView from './TreeView';
import { ArrowRight, RefreshCw, Scissors, CheckCircle, AlertTriangle } from 'lucide-react';

interface SimulationSectionProps {
  onComplete: (savings: number) => void;
}

const DEFAULT_STRINGS = ["BANANA", "HELLO WORLD", "MISSISSIPPI", "AAAABBBCCD"];

// Helper to generate a random string for "Daily Challenge"
const generateDailyString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  // Create skewed distribution
  for(let i=0; i<30; i++) {
    const r = Math.random();
    if(r < 0.5) result += "A";
    else if(r < 0.7) result += "B";
    else if(r < 0.85) result += "C";
    else result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const SimulationSection: React.FC<SimulationSectionProps> = ({ onComplete }) => {
  const [inputText, setInputText] = useState("BANANA");
  const [step, setStep] = useState<'INPUT' | 'BUILD' | 'RESULT'>('INPUT');
  
  // Game State
  const [pool, setPool] = useState<HuffmanNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rootNode, setRootNode] = useState<HuffmanNode | null>(null);
  const [resultData, setResultData] = useState<{original: number, huffman: number, map: Map<string, string>} | null>(null);

  // Initialize Build
  const startBuild = () => {
    if (inputText.length < 2) {
      setErrorMsg("최소 2글자 이상 입력해주세요.");
      return;
    }
    const freqs = calculateFrequencies(inputText.toUpperCase());
    const initialNodes = createInitialNodes(freqs);
    setPool(initialNodes);
    setStep('BUILD');
    setSelectedIds([]);
    setErrorMsg(null);
    setRootNode(null);
  };

  // Node Selection Logic
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(s => s !== id));
    } else {
      if (selectedIds.length >= 2) return; // Max 2
      setSelectedIds(prev => [...prev, id]);
    }
    setErrorMsg(null);
  };

  // Merge Logic
  const handleMerge = () => {
    if (selectedIds.length !== 2) return;

    const nodeA = pool.find(n => n.id === selectedIds[0]);
    const nodeB = pool.find(n => n.id === selectedIds[1]);

    if (!nodeA || !nodeB) return;

    // Validation: Must be two smallest frequencies (with allowance for ties)
    const sortedPool = [...pool].sort((a, b) => a.freq - b.freq);
    const minFreq1 = sortedPool[0].freq;
    const minFreq2 = sortedPool[1].freq;

    // Check if selected nodes are valid candidates (their freq <= minFreq2)
    // We check against minFreq2 because we need the two smallest.
    // E.g. 1, 1, 2, 3. min1=1, min2=1. Selected must be 1 and 1.
    // E.g. 1, 2, 3. min1=1, min2=2. Selected must be 1 and 2.
    // If user picks 2 and 3 while 1 exists, invalid.
    
    // Looser check: Are the selected nodes among the minimal set?
    const maxAllowedFreq = minFreq2;
    
    if (nodeA.freq > maxAllowedFreq && nodeB.freq > maxAllowedFreq) {
         setErrorMsg(`가장 빈도수가 작은 노드들을 먼저 묶어야 합니다! (현재 최소 빈도: ${minFreq1}, ${minFreq2})`);
         return;
    }
    
    // Even stricter: at least one of them must be the absolute minimum? 
    // Let's implement the standard check:
    // User selection freq sum vs Optimal selection freq sum check is complex due to ties.
    // Simple check: Is there any unselected node with freq < selected_max_freq?
    // Exception: If we selected the two smallest, logic holds.
    
    const maxSelected = Math.max(nodeA.freq, nodeB.freq);
    const unselectedMin = sortedPool.filter(n => !selectedIds.includes(n.id))[0]?.freq ?? Infinity;

    if (unselectedMin < maxSelected && (nodeA.freq > unselectedMin || nodeB.freq > unselectedMin)) {
       // Logic: If there is a node strictly smaller than one of our selected nodes, we should probably pick that one first.
       // Allow ties.
       // Case: 2, 3, 4. User picks 3, 4. Unselected 2. 2 < 4. Error.
       // Case: 2, 2, 3. User picks 2, 3. Unselected 2. 2 < 3. Error.
       // Case: 2, 2, 2. User picks 2, 2. Unselected 2. OK.
       setErrorMsg(`더 작은 빈도수(${unselectedMin})를 가진 노드가 남아있습니다.`);
       return;
    }

    // Success Merge
    const newNode: HuffmanNode = {
      id: `internal-${Date.now()}`,
      char: null,
      freq: nodeA.freq + nodeB.freq,
      left: nodeA.freq <= nodeB.freq ? nodeA : nodeB, // Convention: smaller on left, or standard order
      right: nodeA.freq <= nodeB.freq ? nodeB : nodeA,
      isLeaf: false
    };

    const newPool = pool.filter(n => !selectedIds.includes(n.id));
    newPool.push(newNode);
    
    setPool(newPool);
    setSelectedIds([]);

    // Check Completion
    if (newPool.length === 1) {
      finishSimulation(newPool[0]);
    }
  };

  const finishSimulation = (root: HuffmanNode) => {
    setRootNode(root);
    const codes = generateCodes(root);
    const originalBits = calculateOriginalBits(inputText.toUpperCase());
    const huffmanBits = calculateTotalBits(inputText.toUpperCase(), codes);
    const savings = ((originalBits - huffmanBits) / originalBits) * 100;
    
    setResultData({
      original: originalBits,
      huffman: huffmanBits,
      map: codes
    });
    setStep('RESULT');
    onComplete(savings);
  };

  const reset = () => {
    setStep('INPUT');
    setPool([]);
    setSelectedIds([]);
    setResultData(null);
    setRootNode(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Scissors className="w-5 h-5 text-indigo-600" />
          Huffman Maker
        </h2>
        <div className="flex gap-2 text-sm text-slate-500 font-medium">
            <span className={step === 'INPUT' ? "text-indigo-600" : ""}>1. 입력</span>
            <span>→</span>
            <span className={step === 'BUILD' ? "text-indigo-600" : ""}>2. 트리 조립</span>
            <span>→</span>
            <span className={step === 'RESULT' ? "text-indigo-600" : ""}>3. 결과</span>
        </div>
      </div>

      {step === 'INPUT' && (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">압축할 문자열 입력</label>
            <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase tracking-widest text-lg font-mono"
                rows={2}
            />
            <div className="flex flex-wrap gap-2">
                {DEFAULT_STRINGS.map(s => (
                    <button key={s} onClick={() => setInputText(s)} className="px-3 py-1 bg-slate-100 text-xs rounded-full hover:bg-slate-200">
                        {s}
                    </button>
                ))}
                <button onClick={() => setInputText(generateDailyString())} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full hover:bg-amber-200 font-bold">
                    오늘의 문자열 🎲
                </button>
            </div>
            <button 
                onClick={startBuild}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
            >
                빈도 분석 및 트리 만들기 <ArrowRight size={18} />
            </button>
        </div>
      )}

      {step === 'BUILD' && (
        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex items-start gap-2">
                <CheckCircle size={18} className="shrink-0 mt-0.5" />
                <span>
                    <strong>미션:</strong> 빈도수(숫자)가 가장 작은 카드 2개를 선택해서 '결합' 버튼을 누르세요. 
                    하나만 남을 때까지 반복합니다!
                </span>
            </div>

            {errorMsg && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2 animate-bounce">
                    <AlertTriangle size={18} /> {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 min-h-[200px] content-start">
                {pool.sort((a,b) => a.freq - b.freq).map(node => (
                    <button
                        key={node.id}
                        onClick={() => toggleSelection(node.id)}
                        className={`
                            relative p-4 rounded-xl border-2 transition-all transform hover:scale-105
                            flex flex-col items-center justify-center aspect-square
                            ${selectedIds.includes(node.id) 
                                ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105' 
                                : 'border-slate-200 bg-white hover:border-slate-300'}
                        `}
                    >
                        <span className="text-2xl font-bold text-slate-800">
                            {node.char ? node.char : node.freq}
                        </span>
                        {node.char && (
                            <span className="text-xs text-slate-500 mt-1">빈도: {node.freq}</span>
                        )}
                        {!node.char && (
                            <span className="text-xs text-slate-400 mt-1">그룹</span>
                        )}
                        {selectedIds.includes(node.id) && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-center">
                <button
                    onClick={handleMerge}
                    disabled={selectedIds.length !== 2}
                    className={`
                        px-8 py-3 rounded-full font-bold shadow-lg transition-all
                        ${selectedIds.length === 2 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-1' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    선택한 2개 결합하기
                </button>
            </div>
        </div>
      )}

      {step === 'RESULT' && resultData && rootNode && (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-3 text-slate-800">압축 결과 분석</h3>
                    <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-500">원본 크기 (ASCII 8bit)</span>
                            <span className="font-mono font-bold">{resultData.original} bits</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">허프만 압축 크기</span>
                            <span className="font-mono font-bold text-indigo-600">{resultData.huffman} bits</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800">절감률</span>
                            <span className="text-2xl font-black text-green-600">
                                {((resultData.original - resultData.huffman) / resultData.original * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mt-6 mb-3 text-slate-800">생성된 코드표</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {Array.from(resultData.map.entries()).map(([char, code]) => (
                            <div key={char} className="flex justify-between items-center p-2 bg-white border rounded text-sm">
                                <span className="font-bold w-6">{char}</span>
                                <span className="font-mono text-slate-600">{code}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                     <h3 className="font-bold text-lg mb-3 text-slate-800">트리 시각화</h3>
                     <TreeView rootNode={rootNode} />
                     <p className="text-xs text-center text-slate-400 mt-2">
                        왼쪽 가지 = 0, 오른쪽 가지 = 1
                     </p>
                </div>
            </div>
            
            <button 
                onClick={reset}
                className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 flex justify-center items-center gap-2"
            >
                <RefreshCw size={18} /> 다른 문자열로 다시 하기
            </button>
        </div>
      )}
    </div>
  );
};

export default SimulationSection;
