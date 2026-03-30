import React from 'react';
import { Bit } from '../types';
import { Lightbulb, LightbulbOff } from 'lucide-react';

interface BitProps {
  value: Bit;
  interactive?: boolean;
  onClick?: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  isResult?: boolean;
}

export const BitBlock: React.FC<BitProps> = ({ 
  value, 
  interactive = false, 
  onClick, 
  label, 
  size = 'md',
  isResult = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-10 text-xs',
    md: 'w-12 h-16 text-sm',
    lg: 'w-16 h-20 text-base'
  };

  const activeClass = value === 1 
    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md' 
    : 'bg-slate-200 text-slate-600 border-slate-300';

  const resultClass = isResult && value === 1
    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
    : '';

  return (
    <div className="flex flex-col items-center gap-1">
      {label && <span className="text-xs text-slate-400 font-mono">{label}</span>}
      <button
        onClick={interactive ? onClick : undefined}
        disabled={!interactive}
        className={`
          ${sizeClasses[size]} 
          ${isResult ? resultClass : activeClass}
          border-2 rounded-lg flex flex-col items-center justify-center 
          transition-all duration-200 
          ${interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
        `}
      >
        {value === 1 ? <Lightbulb size={size === 'sm' ? 14 : 20} strokeWidth={2.5} /> : <LightbulbOff size={size === 'sm' ? 14 : 20} />}
        <span className="font-mono font-bold mt-1">{value}</span>
      </button>
    </div>
  );
};

interface ByteBlockProps {
  bits: Bit[];
  setBits?: (index: number) => void;
  interactive?: boolean;
  label?: string;
  isResult?: boolean;
}

export const ByteBlock: React.FC<ByteBlockProps> = ({ bits, setBits, interactive, label, isResult }) => {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      {label && <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">{label}</h3>}
      <div className="flex gap-2 justify-center">
        {bits.map((bit, idx) => (
          <BitBlock
            key={idx}
            value={bit}
            interactive={interactive}
            onClick={() => setBits && setBits(idx)}
            isResult={isResult}
            label={`2^${bits.length - 1 - idx}`}
          />
        ))}
      </div>
      <div className="text-right text-xs font-mono text-slate-600 mt-1">
        = {parseInt(bits.join(''), 2)} (10진수)
      </div>
    </div>
  );
};