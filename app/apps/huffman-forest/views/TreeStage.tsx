import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import FruitNode from '../components/FruitNode';
import { HuffmanNode } from '../types';
import { createLeafNodes } from '../utils/huffmanLogic';
import { ArrowDown, Merge } from 'lucide-react';

interface TreeStageProps {
  freqMap: Record<string, number>;
  onComplete: (root: HuffmanNode) => void;
}

// Recursive component to render the forest/tree structure
const TreeNodeRenderer: React.FC<{ node: HuffmanNode }> = ({ node }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <FruitNode node={node} />
      
      {/* If it's an internal node, show children and branches */}
      {(node.left || node.right) && (
        <div className="flex items-start justify-center mt-12 relative w-full">
           {/* SVG Lines - Orthogonal Style */}
           {/* Positioned absolute top-0, but we need it to connect from the node above. 
               The node above is roughly 64-80px tall. The gap is mt-12 (48px).
               We render the SVG in the gap space.
           */}
           <svg className="absolute top-[-3rem] left-0 w-full h-12 pointer-events-none z-0" style={{ overflow: 'visible' }}>
             {/* Common vertical stem from parent center bottom */}
             <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
             
             {/* Horizontal Bar */}
             <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
             
             {/* Left Drop */}
             {node.left && (
               <line x1="25%" y1="50%" x2="25%" y2="100%" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
             )}
             
             {/* Right Drop */}
             {node.right && (
                <line x1="75%" y1="50%" x2="75%" y2="100%" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
             )}
           </svg>

          <div className="flex w-full justify-center gap-4 md:gap-8">
            <div className="flex-1 flex justify-center">
              {node.left && <TreeNodeRenderer node={node.left} />}
            </div>
            <div className="flex-1 flex justify-center">
              {node.right && <TreeNodeRenderer node={node.right} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TreeStage: React.FC<TreeStageProps> = ({ freqMap, onComplete }) => {
  const [forest, setForest] = useState<HuffmanNode[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setForest(createLeafNodes(freqMap));
  }, [freqMap]);

  const handleMerge = () => {
    if (forest.length < 2) return;

    const sortedForest = [...forest].sort((a, b) => a.count - b.count);
    const left = sortedForest[0];
    const right = sortedForest[1];
    const remaining = sortedForest.slice(2);

    const newNode: HuffmanNode = {
      id: `merge-${left.id}-${right.id}`,
      char: null,
      count: left.count + right.count,
      left: left,
      right: right,
      isNew: true
    };

    left.isNew = false;
    right.isNew = false;

    setForest([...remaining, newNode]);
    
    const leftName = left.char ? `'${left.char}'` : `(${left.count})`;
    const rightName = right.char ? `'${right.char}'` : `(${right.count})`;
    setHistory(prev => [...prev, `${leftName} + ${rightName} = (${newNode.count}) 합체!`]);
  };

  const isFinished = forest.length === 1;

  return (
    <div className="flex flex-col items-center w-full h-full max-w-5xl">
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">허프만 나무 키우기</h2>
        <p className="text-slate-600">
          {isFinished 
            ? "나무가 완성되었어요! 이제 코드를 확인해볼까요?" 
            : "숫자가 가장 작은 두 친구를 선택해서 합쳐주세요."}
        </p>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 w-full min-h-[500px] bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden flex flex-col shadow-sm">
        
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* Forest Area */}
        <div className="flex-1 flex items-end justify-center pb-12 px-4 z-10 overflow-x-auto overflow-y-hidden">
             <AnimatePresence mode="popLayout">
               <div className="flex items-end gap-12 md:gap-16 min-w-max mx-auto pb-4">
                 {forest.map((node) => (
                   <motion.div 
                     key={node.id} 
                     layoutId={node.id} 
                     initial={{ scale: 0.8, opacity: 0, y: 50 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0, opacity: 0, y: -20 }}
                     transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                     className="relative"
                   >
                     <TreeNodeRenderer node={node} />
                   </motion.div>
                 ))}
               </div>
             </AnimatePresence>
        </div>

        {/* Ground */}
        <div className="h-12 w-full bg-gradient-to-b from-slate-200 to-slate-300 relative z-0 mt-auto border-t border-slate-400">
        </div>
      </div>

      {/* Controls & Log */}
      <div className="w-full mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 h-28 overflow-y-auto w-full text-sm text-slate-700 shadow-sm scrollbar-hide">
           {history.length === 0 ? (
             <p className="text-slate-400 italic text-center mt-2">화면 속 열매들을 살펴보세요...</p>
           ) : (
             <div className="flex flex-col-reverse gap-1">
               {history.map((log, i) => (
                 <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                   <span className="text-xl">🌱</span> 
                   <span className="bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">{log}</span>
                 </motion.div>
               ))}
             </div>
           )}
        </div>

        <div className="flex gap-4 shrink-0">
           {!isFinished ? (
             <Button onClick={handleMerge} className="w-48 h-16 text-xl shadow-amber-200/50 shadow-lg" variant="primary">
               <Merge className="mr-2" size={24} /> 합치기
             </Button>
           ) : (
             <Button onClick={() => onComplete(forest[0])} className="w-48 h-16 text-xl animate-bounce" variant="secondary">
               코드 확인 <ArrowDown className="ml-2" size={24} />
             </Button>
           )}
        </div>
      </div>
    </div>
  );
};

export default TreeStage;