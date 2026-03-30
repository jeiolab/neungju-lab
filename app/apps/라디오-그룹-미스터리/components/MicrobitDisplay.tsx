import React from 'react';

interface MicrobitProps {
  leds?: boolean[][]; // 5x5 matrix
  icon?: 'heart' | 'check' | 'x' | 'skull' | 'happy' | 'none';
  text?: string;
  label?: string;
  color?: string; // casing color
}

const ICONS = {
  heart: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ],
  check: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0]
  ],
  x: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1]
  ],
  skull: [
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0]
  ],
  happy: [
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ],
  none: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
};

const MicrobitDisplay: React.FC<MicrobitProps> = ({ leds, icon, text, label, color = "bg-slate-800" }) => {
  // Determine pattern to show
  let displayPattern = ICONS.none;
  if (leds) {
    displayPattern = leds.map(row => row.map(cell => cell ? 1 : 0));
  } else if (icon && ICONS[icon]) {
    displayPattern = ICONS[icon];
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-40 h-32 ${color} rounded-xl shadow-lg p-2 border-b-4 border-slate-950 flex items-center justify-center`}>
        {/* LED Matrix */}
        <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-900/50 rounded-md border border-slate-700">
          {displayPattern.map((row, r) => (
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-3 h-3 rounded-sm transition-all duration-300 ${cell ? 'bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]' : 'bg-slate-800/80'}`}
              ></div>
            ))
          ))}
        </div>
        
        {/* Buttons A & B (Decoration) */}
        <div className="absolute left-2 top-12 w-3 h-3 bg-black rounded-full border border-gray-600"></div>
        <div className="absolute right-2 top-12 w-3 h-3 bg-black rounded-full border border-gray-600"></div>

        {/* Text Overlay (simulating scrolling text somewhat) */}
        {text && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
             <span className="text-red-500 font-bold text-2xl animate-pulse font-mono">{text}</span>
          </div>
        )}
      </div>
      {label && <span className="mt-2 text-sm font-semibold text-gray-700">{label}</span>}
    </div>
  );
};

export default MicrobitDisplay;