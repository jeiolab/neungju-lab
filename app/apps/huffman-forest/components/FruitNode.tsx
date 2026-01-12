import React from 'react';
import { motion } from 'framer-motion';
import { HuffmanNode } from '../types';

interface FruitNodeProps {
  node: HuffmanNode;
  isResult?: boolean;
}

const FruitNode: React.FC<FruitNodeProps> = ({ node, isResult = false }) => {
  const isLeaf = node.char !== null;
  
  // Size based on count, clamped
  const sizeClass = isResult 
    ? "w-14 h-14 md:w-16 md:h-16 text-sm" 
    : "w-16 h-16 md:w-20 md:h-20 text-base md:text-lg";

  return (
    <motion.div
      layoutId={node.id}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`relative flex items-center justify-center rounded-full shadow-md z-10 transition-colors duration-300
        ${node.isNew ? 'ring-[6px] ring-blue-300' : ''}
        ${isLeaf 
          ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-blue-700 text-white' 
          : 'bg-gradient-to-br from-slate-200 to-slate-400 border-2 border-slate-600 text-slate-900'}
        ${sizeClass}
      `}
    >
      <div className="flex flex-col items-center leading-none">
        {isLeaf ? (
          <>
            <span className="font-black text-lg md:text-xl drop-shadow-md">{node.char}</span>
            <span className="font-bold text-xs md:text-sm bg-white/20 px-2 py-0.5 rounded-full mt-1">
              {node.count}
            </span>
          </>
        ) : (
          <>
            <span className="text-[10px] md:text-xs font-bold text-slate-700 mb-0.5">그룹</span>
            <span className="font-black text-lg md:text-xl text-slate-900">
              {node.count}
            </span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FruitNode;