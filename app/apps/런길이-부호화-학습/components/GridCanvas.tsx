import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ColorType, GridData, PALETTE } from '../types';
import { PaintBucket, RotateCcw, FileJson, Grid3X3, Eraser } from 'lucide-react';

interface GridCanvasProps {
  grid: GridData;
  setGrid: React.Dispatch<React.SetStateAction<GridData>>;
  selectedColor: ColorType;
  setSelectedColor: (c: ColorType) => void;
  onPresetSelect: (type: 'stripe' | 'check' | 'flag') => void;
  onReset: () => void;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
  grid,
  setGrid,
  selectedColor,
  setSelectedColor,
  onPresetSelect,
  onReset,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCellAction = (rowIndex: number, colIndex: number) => {
    setGrid((prev) => {
      const newGrid = [...prev];
      const newRow = [...newGrid[rowIndex]];
      newRow[colIndex] = { ...newRow[colIndex], color: selectedColor };
      newGrid[rowIndex] = newRow;
      return newGrid;
    });
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    handleCellAction(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing) {
      handleCellAction(r, c);
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  const colors: ColorType[] = ['white', 'black', 'red', 'blue'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PaintBucket size={20} className="text-indigo-500" />
          그림판 (10x10)
        </h2>
        <button
          onClick={onReset}
          className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
        >
          <Eraser size={14} />
          초기화
        </button>
      </div>

      {/* Tools */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2 justify-center bg-slate-50 p-2 rounded-xl">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all transform hover:scale-110 flex items-center justify-center ${
                selectedColor === color
                  ? 'border-indigo-500 shadow-md scale-110 ring-2 ring-indigo-200'
                  : 'border-slate-200'
              }`}
              style={{ backgroundColor: PALETTE[color] }}
              aria-label={`Select ${color}`}
            >
              {selectedColor === color && (
                <div className={`w-2 h-2 rounded-full ${color === 'white' ? 'bg-indigo-500' : 'bg-white'}`} />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
            <button onClick={() => onPresetSelect('stripe')} className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex flex-col items-center gap-1">
                <span className="w-4 h-4 border border-slate-300 bg-[linear-gradient(to_bottom,white_50%,black_50%)] block rounded-sm"></span>
                줄무늬 (압축 ↑)
            </button>
            <button onClick={() => onPresetSelect('check')} className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex flex-col items-center gap-1">
                <span className="w-4 h-4 border border-slate-300 bg-[conic-gradient(at_center,black_25%,white_0_50%,black_0_75%,white_0)] block rounded-sm"></span>
                체크 (압축 ↓)
            </button>
            <button onClick={() => onPresetSelect('flag')} className="text-xs px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex flex-col items-center gap-1">
                <span className="w-4 h-4 border border-slate-300 bg-red-500 rounded-full block"></span>
                원형
            </button>
        </div>
      </div>

      {/* Grid */}
      <div 
        className="flex-1 flex items-center justify-center select-none"
        onMouseLeave={handleMouseUp}
      >
        <div className="grid grid-cols-10 gap-[1px] bg-slate-200 border-2 border-slate-200 rounded-lg overflow-hidden shadow-inner">
          {grid.map((row, rIndex) =>
            row.map((cell, cIndex) => (
              <div
                key={cell.id}
                onMouseDown={() => handleMouseDown(rIndex, cIndex)}
                onMouseEnter={() => handleMouseEnter(rIndex, cIndex)}
                onMouseUp={handleMouseUp}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 cursor-pointer transition-colors duration-75 hover:opacity-90"
                style={{ backgroundColor: PALETTE[cell.color] }}
              />
            ))
          )}
        </div>
      </div>
      
      <p className="mt-4 text-center text-xs text-slate-400">
        클릭하거나 드래그하여 색칠해보세요!
      </p>
    </div>
  );
};