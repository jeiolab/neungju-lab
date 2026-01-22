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
    ? 'bg-cyber-accent text-cyber-900 bit-glow-1 border-cyber-accent' 
    : 'bg-cyber-800 text-slate-500 bit-glow-0 border-slate-600';

  const resultClass = isResult && value === 1
    ? 'bg-cyber-success text-cyber-900 shadow-[0_0_15px_#22c55e]'
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
    <div className="flex flex-col gap-2 p-4 bg-cyber-900/50 rounded-xl border border-cyber-700/50">
      {label && <h3 className="text-sm font-semibold text-cyber-400 uppercase tracking-wider">{label}</h3>}
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
      <div className="text-right text-xs font-mono text-slate-500 mt-1">
        = {parseInt(bits.join(''), 2)} (10진수)
      </div>
    </div>
  );
};