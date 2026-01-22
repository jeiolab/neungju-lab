import React, { useState, useEffect } from 'react';
import { HuffmanNode } from '../types';
import { ArrowUp, Merge, Lightbulb } from 'lucide-react';

interface Props {
  initialNodes: HuffmanNode[];
  onComplete: (root: HuffmanNode) => void;
  onError: () => void; // Trigger mastery penalty
}

export const InteractiveTreeBuilder: React.FC<Props> = ({ initialNodes, onComplete, onError }) => {
  const [nodes, setNodes] = useState<HuffmanNode[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    // Sort initially for display, but logic depends on user selection
    const sorted = [...initialNodes].sort((a, b) => a.freq - b.freq);
    setNodes(sorted);
  }, [initialNodes]);

  const handleSelect = (node: HuffmanNode) => {
    if (selectedIds.includes(node.id)) {
      setSelectedIds(prev => prev.filter(id => id !== node.id));
    } else {
      if (selectedIds.length < 2) {
        setSelectedIds(prev => [...prev, node.id]);
      }
    }
    setHint(null);
  };

  const attemptMerge = () => {
    if (selectedIds.length !== 2) return;

    // Validation Logic
    // Users must pick the two nodes with the lowest frequencies among ALL available nodes.
    const sortedAvailable = [...nodes].sort((a, b) => a.freq - b.freq);
    const correctIds = [sortedAvailable[0].id, sortedAvailable[1].id];

    const isCorrect = selectedIds.every(id => correctIds.includes(id));

    if (isCorrect) {
      const left = nodes.find(n => n.id === selectedIds[0])!;
      const right = nodes.find(n => n.id === selectedIds[1])!;
      
      // Usually left is smaller, but visually we just take selection order or sort them
      const [first, second] = left.freq <= right.freq ? [left, right] : [right, left];

      const parent: HuffmanNode = {
        id: `merged-${Date.now()}`,
        char: null,
        freq: first.freq + second.freq,
        left: first,
        right: second,
        isNew: true
      };

      const newNodes = nodes.filter(n => !selectedIds.includes(n.id));
      newNodes.push(parent);
      // Re-sort for display tidiness, or keep messy? Let's sort to help user.
      newNodes.sort((a, b) => a.freq - b.freq);

      setNodes(newNodes);
      setSelectedIds([]);

      if (newNodes.length === 1) {
        onComplete(newNodes[0]);
      }
    } else {
      onError();
      setHint("잘못된 연결: 빈도수가 가장 낮은(작은 숫자) 노드 2개를 먼저 선택해야 합니다.");
    }
  };

  const showHint = () => {
    const sortedAvailable = [...nodes].sort((a, b) => a.freq - b.freq);
    const n1 = sortedAvailable[0];
    const n2 = sortedAvailable[1];
    setHint(`힌트: 숫자 ${n1.freq}와(과) ${n2.freq}를 찾아서 더해보세요.`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="flex justify-between w-full max-w-2xl items-center mb-4">
        <h3 className="text-xl text-slate-800 font-bold">
          프로토콜: 노드 병합
        </h3>
        <button 
          onClick={showHint}
          className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
        >
          <Lightbulb size={18} />
          <span>힌트 보기</span>
        </button>
      </div>

      {hint && (
        <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg">
          {hint}
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center items-end min-h-[200px]">
        {nodes.map((node) => {
            const isSelected = selectedIds.includes(node.id);
            const isInternal = node.char === null;
            return (
                <div
                    key={node.id}
                    onClick={() => handleSelect(node)}
                    className={`
                        relative flex flex-col items-center justify-center
                        w-20 h-20 rounded-lg border-2 cursor-pointer transition-all duration-300 select-none
                        ${isSelected 
                            ? 'border-indigo-500 bg-indigo-100 shadow-md scale-110' 
                            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'}
                        ${node.isNew ? 'animate-[bounce_0.5s_ease-out]' : ''}
                    `}
                >
                    <span className="text-2xl font-bold text-slate-800">
                        {node.freq}
                    </span>
                    <span className="text-xs text-slate-600 uppercase mt-1">
                        {isInternal ? '노드' : `'${node.char}'`}
                    </span>
                    {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-1">
                            <ArrowUp size={12} />
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className="h-16 flex items-center">
        {selectedIds.length === 2 ? (
             <button
             onClick={attemptMerge}
             className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all"
           >
             <Merge size={20} />
             선택 항목 병합
           </button>
        ) : (
            <p className="text-slate-500 italic">가장 작은 숫자(빈도수)를 가진 노드 2개를 선택하세요...</p>
        )}
      </div>
    </div>
  );
};