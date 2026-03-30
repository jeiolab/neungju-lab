import React from 'react';

interface BitSwitchProps {
  bitValue: number;
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const BitSwitch: React.FC<BitSwitchProps> = ({ bitValue, isOn, onToggle, disabled = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-bold text-slate-500">{bitValue}</div>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          w-12 h-20 rounded-md border-2 transition-all duration-200 flex flex-col items-center justify-end pb-2
          ${isOn 
            ? 'bg-green-100 border-green-600 shadow-[0_0_10px_rgba(22,163,74,0.3)]' 
            : 'bg-white border-slate-300 hover:border-slate-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        `}
      >
        <div 
          className={`
            w-8 h-8 rounded-sm text-xs flex items-center justify-center font-bold transition-all
            ${isOn ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-400'}
          `}
        >
          {isOn ? '1' : '0'}
        </div>
      </button>
    </div>
  );
};