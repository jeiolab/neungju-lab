import React, { useState, useEffect, useRef } from 'react';
import { GridSize, Color, CompressionMode, CompressionStats } from '../types';
import { PALETTE, DEFAULT_COLOR } from '../constants';
import { calculateBMPSize, calculateRLE, simulateLossyCompression } from '../services/compressionService';
import { Save, RefreshCw, Eraser, Pen, PaintBucket, GitCompare } from 'lucide-react';

interface DesignLabProps {
  onSave: (grid: Color[], mode: CompressionMode, originalBytes: number, compressedBytes: number) => void;
}

const DesignLab: React.FC<DesignLabProps> = ({ onSave }) => {
  const [size, setSize] = useState<GridSize>(16);
  const [grid, setGrid] = useState<Color[]>(Array(16 * 16).fill(DEFAULT_COLOR));
  const [selectedColor, setSelectedColor] = useState<Color>(PALETTE[1]); // Default dark blue
  const [mode, setMode] = useState<CompressionMode>(CompressionMode.BMP);
  const [stats, setStats] = useState<CompressionStats>({ originalBytes: 0, compressedBytes: 0, compressionRatio: 1, streamVisualization: '' });
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const [isDietActive, setIsDietActive] = useState(false);
  const [compressedGrid, setCompressedGrid] = useState<Color[] | null>(null);
  const [compareValue, setCompareValue] = useState(50); // Slider 0-100

  // Refs for drag painting
  const isDrawing = useRef(false);

  // Initialize
  useEffect(() => {
    updateStats(grid, mode);
  }, [grid, mode]);

  const updateStats = (currentGrid: Color[], currentMode: CompressionMode) => {
    if (currentMode === CompressionMode.BMP) {
      const bytes = calculateBMPSize(currentGrid);
      // Create a fake hex stream for visual
      let stream = '';
      for(let i=0; i<Math.min(currentGrid.length, 10); i++) stream += `[${currentGrid[i]}] `;
      stream += '...';
      
      setStats({
        originalBytes: bytes,
        compressedBytes: bytes,
        compressionRatio: 1,
        streamVisualization: stream
      });
    } else if (currentMode === CompressionMode.RLE) {
      setStats(calculateRLE(currentGrid));
    } else if (currentMode === CompressionMode.JPEG) {
       // Handled separately when button is clicked usually, but we can show preview stats
       // If diet is NOT active, it's just BMP size essentially until compressed
       if (!isDietActive) {
         const bytes = calculateBMPSize(currentGrid);
         setStats({ originalBytes: bytes, compressedBytes: bytes, compressionRatio: 1, streamVisualization: '압축 대기 중...' });
       }
    }
  };

  const handlePixelClick = (index: number) => {
    if (isDietActive) return; // Locked when showing JPEG comparison

    const newGrid = [...grid];
    if (tool === 'fill') {
        const targetColor = newGrid[index];
        if (targetColor === selectedColor) return;
        
        const stack = [index];
        const visited = new Set();
        
        while(stack.length > 0) {
            const curr = stack.pop()!;
            if (visited.has(curr)) continue;
            visited.add(curr);
            
            if (newGrid[curr] === targetColor) {
                newGrid[curr] = selectedColor;
                
                const row = Math.floor(curr / size);
                const col = curr % size;
                
                if (col > 0) stack.push(curr - 1);
                if (col < size - 1) stack.push(curr + 1);
                if (row > 0) stack.push(curr - size);
                if (row < size - 1) stack.push(curr + size);
            }
        }
    } else {
        newGrid[index] = tool === 'eraser' ? DEFAULT_COLOR : selectedColor;
    }
    setGrid(newGrid);
  };

  const handleMouseDown = (index: number) => {
    isDrawing.current = true;
    handlePixelClick(index);
  }

  const handleMouseEnter = (index: number) => {
    if (isDrawing.current && tool !== 'fill') {
        handlePixelClick(index);
    }
  }

  const handleMouseUp = () => {
    isDrawing.current = false;
  }

  const runJpegSimulation = () => {
    const result = simulateLossyCompression(grid, size);
    setCompressedGrid(result.newGrid);
    setStats(result.stats);
    setIsDietActive(true);
    setMode(CompressionMode.JPEG);
  };

  const resetCanvas = () => {
    setGrid(Array(size * size).fill(DEFAULT_COLOR));
    setCompressedGrid(null);
    setIsDietActive(false);
    setMode(CompressionMode.BMP);
  };

  const handleModeChange = (m: CompressionMode) => {
    setMode(m);
    setIsDietActive(false);
    setCompressedGrid(null);
  }

  const getDisplayedGrid = () => {
    if (!isDietActive || !compressedGrid) return grid;
    // For comparison slider:
    // This is a bit complex for a single grid render, so we'll do a simple overlay logic visually
    // Instead of partial rendering, let's just show one or the other based on slider for now to keep code simple
    // Or, we render the "Comparison" view separately.
    return compareValue > 50 ? grid : compressedGrid; 
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full p-4" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      {/* Tools Panel */}
      <div className="w-full lg:w-64 flex flex-col gap-4 bg-retro-panel p-4 rounded-lg border-2 border-retro-dim shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
        <h2 className="text-retro-green font-retro text-lg mb-2">도구 상자</h2>
        
        {/* Colors */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {PALETTE.map(c => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-8 h-8 border-2 ${selectedColor === c ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Tools */}
        <div className="flex gap-2 justify-center mb-4">
            <button onClick={() => setTool('pen')} className={`p-2 rounded ${tool === 'pen' ? 'bg-retro-green text-black' : 'bg-gray-700'}`}><Pen size={20}/></button>
            <button onClick={() => setTool('eraser')} className={`p-2 rounded ${tool === 'eraser' ? 'bg-retro-green text-black' : 'bg-gray-700'}`}><Eraser size={20}/></button>
            <button onClick={() => setTool('fill')} className={`p-2 rounded ${tool === 'fill' ? 'bg-retro-green text-black' : 'bg-gray-700'}`}><PaintBucket size={20}/></button>
        </div>

        <div className="border-t border-retro-dim my-2"></div>

        {/* Format Select */}
        <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">포맷</label>
            <div className="flex gap-1">
                <button onClick={() => handleModeChange(CompressionMode.BMP)} className={`text-xs px-2 py-1 flex-1 ${mode === CompressionMode.BMP ? 'bg-retro-accent text-black' : 'bg-gray-700'}`}>BMP</button>
                <button onClick={() => handleModeChange(CompressionMode.RLE)} className={`text-xs px-2 py-1 flex-1 ${mode === CompressionMode.RLE ? 'bg-retro-accent text-black' : 'bg-gray-700'}`}>RLE</button>
                <button onClick={() => handleModeChange(CompressionMode.JPEG)} className={`text-xs px-2 py-1 flex-1 ${mode === CompressionMode.JPEG ? 'bg-retro-accent text-black' : 'bg-gray-700'}`}>JPEG</button>
            </div>
        </div>

        {mode === CompressionMode.JPEG && (
            <button 
                onClick={runJpegSimulation}
                disabled={isDietActive}
                className="mt-4 bg-red-500 hover:bg-red-400 text-white p-2 rounded font-retro text-xs border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
            >
                {isDietActive ? "다이어트 적용됨" : "용량 다이어트 실행"}
            </button>
        )}

        <div className="flex-grow"></div>

        <button onClick={resetCanvas} className="flex items-center justify-center gap-2 text-red-400 hover:text-white mb-2">
            <RefreshCw size={16}/> 초기화
        </button>
        
        <button 
            onClick={() => onSave(isDietActive && compressedGrid ? compressedGrid : grid, mode, stats.originalBytes, stats.compressedBytes)} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded font-retro flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
        >
            <Save size={16} /> 디스크에 저장
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Stats Bar */}
        <div className="bg-black border border-retro-green p-3 font-mono text-sm flex justify-between items-center text-retro-green rounded">
            <div>
                크기: {stats.compressedBytes} Bytes
                {mode !== CompressionMode.BMP && (
                    <span className="ml-2 text-retro-accent">
                        ({Math.round((1 - stats.compressionRatio) * 100)}% 절약)
                    </span>
                )}
            </div>
            <div>모드: {mode}</div>
        </div>

        {/* Data Stream Visualizer */}
        <div className="bg-gray-900 p-2 font-mono text-xs text-gray-400 h-16 overflow-hidden whitespace-nowrap border border-gray-700 rounded relative">
             <div className="absolute top-0 left-0 bg-gray-800 text-white px-1 text-[10px]">데이터 스트림</div>
             <div className="mt-4 animate-pulse">
                 {stats.streamVisualization || "00000000 00000000 ..."}
             </div>
        </div>

        {/* Editor Grid Area */}
        <div className="flex-1 bg-retro-dim rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
             
            <div 
                className="grid gap-[1px] bg-gray-600 shadow-2xl"
                style={{ 
                    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                    width: 'min(100%, 500px)',
                    aspectRatio: '1/1'
                }}
            >
                {(isDietActive && compressedGrid ? (compareValue > 50 ? grid : compressedGrid) : grid).map((color, idx) => (
                    <div
                        key={idx}
                        onMouseDown={() => handleMouseDown(idx)}
                        onMouseEnter={() => handleMouseEnter(idx)}
                        className="w-full h-full cursor-pointer hover:opacity-90 transition-none"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            {/* JPEG Comparison Overlay UI */}
            {isDietActive && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 bg-black/80 p-2 rounded-full flex items-center gap-2 backdrop-blur-md border border-white/20">
                    <span className="text-[10px] text-red-400 font-bold">압축본</span>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={compareValue} 
                        onChange={(e) => setCompareValue(parseInt(e.target.value))}
                        className="flex-1 accent-retro-green h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] text-green-400 font-bold">원본</span>
                </div>
            )}
             
            {isDietActive && (
                <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-300 p-2 rounded border border-yellow-500 animate-bounce text-xs font-bold text-center">
                    이미지 품질 저하!<br/>
                    크기: {Math.floor(stats.compressedBytes)}B
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default DesignLab;