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
    <div className="mt-4 bg-white rounded-xl border-2 border-gray-300 shadow-lg overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2.5 text-xs text-gray-700 font-bold flex items-center gap-2 border-b border-gray-300">
        <Terminal size={16} className="text-blue-600" />
        <span>PixelLog Console</span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center">
          <span className="text-green-600 font-mono text-base font-bold">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="grid[2][3] = 1"
            className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-mono text-sm placeholder-gray-400"
          />
          <button 
            type="submit"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all"
          >
            <Play size={18} />
          </button>
        </form>
        {error && <div className="text-red-600 text-sm mt-3 font-mono pl-4 bg-red-50 border border-red-200 rounded-lg py-2 px-3">{error}</div>}
        {successMsg && <div className="text-green-600 text-sm mt-3 font-mono pl-4 bg-green-50 border border-green-200 rounded-lg py-2 px-3">{successMsg}</div>}
      </div>
    </div>
  );
};