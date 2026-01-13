import React, { useState, useEffect, useMemo } from 'react';
import { PixelGrid } from './PixelGrid';
import { Button } from './Button';
import { GridSize, PixelColor, ScanMode, HistoryItem } from '../types';
import { generateEmptyGrid, calculateRLE, generateFeedback, generateDailyGrid } from '../utils';
import { RotateCcw, Save, Activity, ArrowRight, ArrowDown } from 'lucide-react';
import { SAMPLE_ARTWORKS, COLORS } from '../constants';

interface SimulationSectionProps {
  onScoreUpdate: (ratio: number) => void;
  onHistoryUpdate: () => void; // Trigger for parent to save/check badges
}

export const SimulationSection: React.FC<SimulationSectionProps> = ({ onScoreUpdate, onHistoryUpdate }) => {
  const [gridSize, setGridSize] = useState<GridSize>(8);
  const [grid, setGrid] = useState<PixelColor[]>(() => generateEmptyGrid(8));
  const [scanMode, setScanMode] = useState<ScanMode>('row');
  const [colorMode, setColorMode] = useState<'bw' | '3c'>('3c'); // Default 3 colors for fun
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<number | null>(null);

  // Derived state: RLE calculation
  const rleData = useMemo(() => {
    return calculateRLE(grid, gridSize, scanMode, false);
  }, [grid, gridSize, scanMode]);

  // Derived state: Feedback
  const feedback = useMemo(() => {
    return generateFeedback(rleData, scanMode);
  }, [rleData, scanMode]);

  // Auto-save best score logic
  useEffect(() => {
    if (rleData.compressionRatio < 100) {
      onScoreUpdate(rleData.compressionRatio);
    }
  }, [rleData.compressionRatio, onScoreUpdate]);

  const handlePixelClick = (index: number) => {
    const newGrid = [...grid];
    // Cycle colors: 0 -> 1 -> 2 -> 0 if 3c, else 0 -> 1 -> 0
    const maxColor = colorMode === '3c' ? 2 : 1;
    newGrid[index] = (newGrid[index] + 1) > maxColor ? 0 : (newGrid[index] + 1) as PixelColor;
    setGrid(newGrid);
    setActiveHistoryId(null); // Clear history selection if modified
  };

  const handleSaveToHistory = () => {
    const newItem: HistoryItem = {
      id: Date.now(),
      grid: [...grid],
      timestamp: Date.now(),
      stats: rleData
    };
    setHistory(prev => [newItem, ...prev].slice(0, 3)); // Keep last 3
    onHistoryUpdate();
  };

  const handleHistoryRestore = (item: HistoryItem) => {
    setGrid([...item.grid]);
    setActiveHistoryId(item.id);
  };

  const handleClear = () => {
    setGrid(generateEmptyGrid(gridSize));
    setActiveHistoryId(null);
  };

  const handleLoadSample = (sampleGrid: number[], size: number) => {
    setGridSize(size as GridSize);
    setGrid(sampleGrid as PixelColor[]);
    setActiveHistoryId(null);
  };

  const loadDailyChallenge = () => {
    const dailyGrid = generateDailyGrid(gridSize);
    setGrid(dailyGrid);
    setActiveHistoryId(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Scan</span>
            <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                    onClick={() => setScanMode('row')}
                    className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${scanMode === 'row' ? 'bg-white shadow text-blue-600 font-bold' : 'text-slate-500'}`}
                >
                    <ArrowRight size={14} /> 행(가로)
                </button>
                <button
                    onClick={() => setScanMode('col')}
                    className={`px-3 py-1 text-sm rounded-md transition-all flex items-center gap-1 ${scanMode === 'col' ? 'bg-white shadow text-blue-600 font-bold' : 'text-slate-500'}`}
                >
                    <ArrowDown size={14} /> 열(세로)
                </button>
            </div>
        </div>

        <div className="flex gap-2">
           <Button size="sm" variant="secondary" onClick={loadDailyChallenge}>📅 오늘의 도전</Button>
           <Button size="sm" variant="secondary" onClick={handleClear}><RotateCcw size={14} className="mr-1"/>초기화</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Editor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
             <div className="mb-4 flex justify-center">
                <PixelGrid 
                  grid={grid} 
                  size={gridSize} 
                  scanMode={scanMode} 
                  onPixelClick={handlePixelClick}
                  showScanPath={true}
                />
             </div>
             <p className="text-xs text-slate-400">픽셀을 클릭하여 색상을 변경하세요</p>
          </div>

           {/* Quick Samples */}
           <div className="flex gap-2 overflow-x-auto pb-2">
              {SAMPLE_ARTWORKS.map((sample, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleLoadSample(sample.grid, sample.size)}
                    className="flex-shrink-0 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs rounded-full text-slate-600 whitespace-nowrap"
                  >
                    {sample.name}
                  </button>
              ))}
           </div>
        </div>

        {/* Right: Stats & Feedback */}
        <div className="lg:col-span-7 space-y-4">
            {/* RLE Output Visualizer */}
            <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-nowrap shadow-inner">
                <div className="text-xs text-slate-400 mb-1">RLE Stream Output</div>
                <div className="flex gap-2">
                    {rleData.sequence.map((run, i) => (
                        <div key={i} className="flex flex-col items-center bg-slate-800 px-2 py-1 rounded border border-slate-700">
                             <div 
                                className="w-3 h-3 rounded-full mb-1 border border-slate-600" 
                                style={{backgroundColor: COLORS[run.color]}}
                             ></div>
                             <span className="text-lg font-bold text-yellow-400">{run.count}</span>
                        </div>
                    ))}
                    {rleData.sequence.length === 0 && <span className="text-slate-600">데이터 없음...</span>}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                    Raw: {rleData.rawString}
                </div>
            </div>

            {/* Gauge */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-700">압축률</span>
                    <span className={`text-2xl font-black ${rleData.compressionRatio < 50 ? 'text-green-500' : rleData.compressionRatio > 100 ? 'text-red-500' : 'text-blue-500'}`}>
                        {rleData.compressionRatio.toFixed(1)}%
                    </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative">
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${rleData.compressionRatio < 50 ? 'bg-green-500' : rleData.compressionRatio > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(rleData.compressionRatio, 100)}%` }}
                    ></div>
                    {/* Marker for 100% */}
                    <div className="absolute top-0 bottom-0 w-0.5 bg-slate-300 left-full -ml-[1px]" style={{ left: '100%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0% (완벽)</span>
                    <span>100% (원본크기)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div className="bg-slate-50 p-2 rounded">
                        <span className="block text-slate-400 text-xs">원본 크기</span>
                        <span className="font-bold">{rleData.originalSize} Units</span>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                         <span className="block text-blue-400 text-xs">압축 후 크기</span>
                         <span className="font-bold text-blue-700">{rleData.compressedSize} Units</span>
                    </div>
                </div>
            </div>

            {/* 3-Line Feedback */}
            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                <h4 className="text-yellow-800 font-bold text-sm mb-2 flex items-center gap-2">
                    <Activity size={16} /> 분석 리포트
                </h4>
                <ul className="space-y-2">
                    {feedback.map((line, idx) => (
                        <li key={idx} className="text-sm text-yellow-900 flex gap-2">
                            <span className="font-bold shrink-0">{idx + 1}.</span>
                            <span>{line}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="flex justify-end">
                 <Button onClick={handleSaveToHistory} className="w-full sm:w-auto">
                    <Save size={16} className="mr-2" /> 현재 결과 기록하기
                 </Button>
            </div>
        </div>
      </div>

      {/* History Strip */}
      {history.length > 0 && (
          <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold text-slate-500 mb-3">최근 실험 기록 (클릭하여 되돌리기)</h3>
              <div className="grid grid-cols-3 gap-4">
                  {history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => handleHistoryRestore(item)}
                        className={`relative p-3 rounded-lg border text-left transition-all hover:shadow-md ${activeHistoryId === item.id ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : 'bg-white border-slate-200'}`}
                      >
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-mono text-slate-400">#{item.id.toString().slice(-4)}</span>
                              <span className={`text-xs font-bold ${item.stats.compressionRatio < 60 ? 'text-green-600' : 'text-slate-600'}`}>
                                  {item.stats.compressionRatio.toFixed(0)}%
                              </span>
                          </div>
                          {/* Mini Grid Visualization */}
                          <div className="grid grid-cols-8 gap-px bg-slate-100 rounded overflow-hidden opacity-75" style={{width: '100%', aspectRatio: '1/1'}}>
                             {item.grid.map((c, i) => (
                                 <div key={i} style={{backgroundColor: COLORS[c]}} />
                             ))}
                          </div>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};