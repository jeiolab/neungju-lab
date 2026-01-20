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
    <div className="h-full flex flex-col p-4 md:p-6 max-w-7xl mx-auto gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl shadow-lg border-2 border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-bold text-base">Grid Size:</span>
          <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300">
            <button 
              onClick={() => setSize(5)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${size === 5 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
            >
              5 x 5
            </button>
            <button 
              onClick={() => setSize(8)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${size === 8 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}
            >
              8 x 8
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-semibold border border-gray-300">
            <Trash2 size={18} /> 초기화
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-green-200">
            <Save size={18} /> 저장하기
          </button>
        </div>
      </div>

      {/* AI Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200 shadow-md flex gap-3 items-center">
        <Wand2 className="text-purple-600 ml-2" size={22} />
        <input 
            type="text" 
            placeholder={`AI에게 부탁하기 (예: ${size}x${size} 크기의 하트 그려줘)`}
            className="flex-1 bg-white border border-purple-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 placeholder-gray-400 text-sm"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
        />
        <button 
            onClick={handleAiGenerate}
            disabled={isAiLoading}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-md transition-all"
        >
            {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : '생성'}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Panel: Visual Grid */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex items-center justify-center min-h-[350px] bg-white rounded-2xl border-2 border-gray-300 shadow-lg relative p-6">
             <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">INPUT VIEW</div>
             <PixelGrid 
                data={grid} 
                onPixelClick={handlePixelClick} 
                highlightCell={hoveredCell}
             />
          </div>
          <CodeConsole onExecute={handleCodeExecute} gridSize={size} />
        </div>

        {/* Right Panel: Data View */}
        <div className="flex-1 min-h-[350px] flex flex-col relative bg-white rounded-2xl border-2 border-gray-300 shadow-lg p-6">
           <div className="absolute top-4 right-4 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded z-10">MEMORY VIEW</div>
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