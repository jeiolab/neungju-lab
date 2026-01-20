import React, { useState, useEffect } from 'react';
import { PixelGrid } from '../components/PixelGrid';
import { DataVisualizer } from '../components/DataVisualizer';
import { CodeConsole } from '../components/CodeConsole';
import { GridData } from '../types';
import { Trash2, Save, Wand2, Loader2, Download, Upload } from 'lucide-react';
import { generatePixelArtFromText } from '../services/geminiService';

const INITIAL_SIZE = 5;

const createEmptyGrid = (size: number): GridData => 
  Array(size).fill(0).map(() => Array(size).fill(0));

export const SimulationTab: React.FC = () => {
  const [size, setSize] = useState<5 | 8>(INITIAL_SIZE);
  const [grid, setGrid] = useState<GridData>(createEmptyGrid(INITIAL_SIZE));
  const [hoveredCell, setHoveredCell] = useState<{r: number, c: number} | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Sync grid when size changes
  useEffect(() => {
    setGrid(createEmptyGrid(size));
  }, [size]);

  const handlePixelClick = (r: number, c: number) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = newGrid[r][c] === 1 ? 0 : 1;
    setGrid(newGrid);
  };

  const handleCodeExecute = (r: number, c: number, val: number) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = val as 0 | 1;
    setGrid(newGrid);
  };

  const handleClear = () => setGrid(createEmptyGrid(size));

  const handleSave = () => {
    const name = prompt("작품 이름을 입력하세요:");
    if (!name) return;
    
    const savedArt = {
      id: Date.now().toString(),
      name,
      data: grid,
      createdAt: Date.now()
    };
    
    const existing = localStorage.getItem('pixelLog_gallery');
    const gallery = existing ? JSON.parse(existing) : [];
    localStorage.setItem('pixelLog_gallery', JSON.stringify([savedArt, ...gallery]));
    alert("저장되었습니다! 갤러리 탭에서 확인하세요.");
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    const result = await generatePixelArtFromText(aiPrompt, size);
    if (result) {
        setGrid(result);
    } else {
        alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
    }
    setIsAiLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-2 md:p-6 max-w-7xl mx-auto gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-slate-300 font-bold">Grid Size:</span>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setSize(5)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${size === 5 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              5 x 5
            </button>
            <button 
              onClick={() => setSize(8)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${size === 8 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              8 x 8
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleClear} className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors text-sm">
            <Trash2 size={16} /> 초기화
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded transition-colors text-sm font-medium shadow-lg shadow-green-900/20">
            <Save size={16} /> 저장하기
          </button>
        </div>
      </div>

      {/* AI Bar */}
      <div className="bg-slate-800/50 p-3 rounded-xl border border-purple-900/50 flex gap-2 items-center">
        <Wand2 className="text-purple-400 ml-2" size={20} />
        <input 
            type="text" 
            placeholder={`AI에게 부탁하기 (예: ${size}x${size} 크기의 하트 그려줘)`}
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
        />
        <button 
            onClick={handleAiGenerate}
            disabled={isAiLoading}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
            {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : '생성'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Visual Grid */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-[300px] bg-slate-900/50 rounded-xl border border-slate-800 relative">
             <div className="absolute top-4 left-4 text-xs font-mono text-slate-500">INPUT VIEW</div>
             <PixelGrid 
                data={grid} 
                onPixelClick={handlePixelClick} 
                highlightCell={hoveredCell}
             />
          </div>
          <CodeConsole onExecute={handleCodeExecute} gridSize={size} />
        </div>

        {/* Right Panel: Data View */}
        <div className="flex-1 min-h-[300px] flex flex-col relative">
           <div className="absolute top-4 right-4 text-xs font-mono text-slate-500 z-10">MEMORY VIEW</div>
           <DataVisualizer 
             data={grid} 
             hoveredCell={hoveredCell}
             onHoverCell={(r, c) => r !== null && c !== null ? setHoveredCell({r, c}) : setHoveredCell(null)}
           />
        </div>
      </div>
    </div>
  );
};