import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
  colorClass?: string;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  icon,
  onChange,
  colorClass = "accent-blue-600",
  disabled = false
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
          {icon}
          {label}
        </label>
        <span className="text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-200">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={disabled}
      />
    </div>
  );
};