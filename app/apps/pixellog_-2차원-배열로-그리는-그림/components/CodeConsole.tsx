import React, { useState } from 'react';
import { Terminal, Play } from 'lucide-react';

interface CodeConsoleProps {
  onExecute: (row: number, col: number, value: number) => void;
  gridSize: number;
}

export const CodeConsole: React.FC<CodeConsoleProps> = ({ onExecute, gridSize }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Basic parser for pattern: grid[r][c] = v or grid[r][c]=v
    const regex = /grid\[(\d+)\]\[(\d+)\]\s*=\s*(\d+)/;
    const match = input.match(regex);

    if (match) {
      const r = parseInt(match[1]);
      const c = parseInt(match[2]);
      const v = parseInt(match[3]);

      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        if (v === 0 || v === 1) {
          onExecute(r, c, v);
          setSuccessMsg(`Executed: grid[${r}][${c}] is now ${v}`);
          setInput('');
        } else {
          setError(`Invalid value: ${v}. Use 0 or 1.`);
        }
      } else {
        setError(`Index out of bounds. Max index is ${gridSize - 1}.`);
      }
    } else {
      setError("Syntax Error. Format: grid[row][col] = value (e.g., grid[2][3] = 1)");
    }
  };

  return (
    <div className="mt-4 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
      <div className="bg-slate-800 px-3 py-1 text-xs text-slate-400 flex items-center gap-2 border-b border-slate-700">
        <Terminal size={14} />
        <span>PixelLog Console</span>
      </div>
      <div className="p-3">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <span className="text-green-500 font-mono text-sm">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="grid[2][3] = 1"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 font-mono text-sm placeholder-slate-600"
          />
          <button 
            type="submit"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Play size={16} />
          </button>
        </form>
        {error && <div className="text-red-400 text-xs mt-2 font-mono pl-4">{error}</div>}
        {successMsg && <div className="text-green-400 text-xs mt-2 font-mono pl-4">{successMsg}</div>}
      </div>
    </div>
  );
};