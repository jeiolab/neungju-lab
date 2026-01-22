import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GridData, CompressionResult, PALETTE, COLOR_LABELS, ColorType } from '../types';
import { encodeRow, getRLEString, calculateEfficiency } from '../utils/rle';
import { ArrowDown, Copy, Check, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface AnalysisPanelProps {
  grid: GridData;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ grid }) => {
  const [stats, setStats] = useState<CompressionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeRow, setActiveRow] = useState<number>(0);

  useEffect(() => {
    const result = calculateEfficiency(grid);
    setStats(result);
  }, [grid]);

  useEffect(() => {
    // Auto cycle active row for demonstration every 3 seconds if not interacting
    const interval = setInterval(() => {
        setActiveRow(prev => (prev + 1) % 10);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    const text = getRLEString(grid);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!stats) return null;

  const isEfficient = stats.efficiency > 0;
  const efficiencyColor = isEfficient ? 'text-green-600' : 'text-red-500';
  const efficiencyBg = isEfficient ? 'bg-green-50' : 'bg-red-50';
  const efficiencyBorder = isEfficient ? 'border-green-200' : 'border-red-200';

  const currentRowData = grid[activeRow];
  const currentRowEncoded = encodeRow(currentRowData);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingDown size={20} className="text-indigo-500" />
            실시간 데이터 분석
        </h2>
        <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors"
        >
            {copied ? <Check size={14} className="text-green-600"/> : <Copy size={14} />}
            {copied ? '복사됨!' : 'RLE 코드 복사'}
        </button>
      </div>

      {/* 1. Dynamic Efficiency Gauge */}
      <div className={`p-4 rounded-xl border ${efficiencyBorder} ${efficiencyBg} transition-colors duration-500`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-slate-700">압축 효율성</span>
          <span className={`text-xl font-black ${efficiencyColor}`}>
            {stats.efficiency.toFixed(1)}%
          </span>
        </div>
        
        {/* Bar Comparison */}
        <div className="space-y-2 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
                <span className="w-16">원본:</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-slate-400"
                    />
                </div>
                <span className="w-8 text-right">{stats.originalSize}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-16">RLE:</span>
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((stats.compressedSize / stats.originalSize) * 100, 100)}%` }}
                        className={`h-full ${isEfficient ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                </div>
                <span className="w-8 text-right">{stats.compressedSize}</span>
            </div>
        </div>

        <div className="mt-3 flex items-start gap-2">
            {isEfficient ? (
                <Check className="text-green-600 mt-0.5" size={16} />
            ) : (
                <AlertTriangle className="text-red-500 mt-0.5" size={16} />
            )}
            <p className={`text-sm ${isEfficient ? 'text-green-800' : 'text-red-800'}`}>
                {isEfficient 
                    ? `좋아요! 데이터가 ${stats.efficiency.toFixed(0)}% 줄어들었어요.` 
                    : "경고: 반복 패턴이 적어서 오히려 용량이 늘어났어요!"}
            </p>
        </div>
      </div>

      {/* 2. Visualizer (Magnet Effect) */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-slate-700">상세 변환 과정 (행 {activeRow + 1})</h3>
            <div className="flex gap-1">
                {Array.from({length: 10}).map((_, i) => (
                    <button 
                        key={i} 
                        onClick={() => setActiveRow(i)}
                        className={`w-2 h-2 rounded-full transition-all ${activeRow === i ? 'bg-indigo-500 w-4' : 'bg-slate-300'}`}
                    />
                ))}
            </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center items-center gap-4 flex-1 relative overflow-hidden">
            
            {/* Raw Data Row */}
            <div className="w-full">
                <p className="text-xs text-slate-400 mb-1">Raw Data (입력)</p>
                <div className="flex w-full h-8 rounded-md overflow-hidden border border-slate-300 shadow-sm">
                    {currentRowData.map((cell) => (
                        <div 
                            key={cell.id}
                            className="flex-1 h-full border-r border-slate-300/50 last:border-r-0"
                            style={{ backgroundColor: PALETTE[cell.color] }}
                        />
                    ))}
                </div>
            </div>

            <motion.div 
                animate={{ y: [0, 5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-slate-400"
            >
                <ArrowDown size={24} />
            </motion.div>

            {/* Compressed Data Row (Animated) */}
            <div className="w-full">
                <p className="text-xs text-slate-400 mb-1">Encoded Data (압축)</p>
                <div className="flex w-full h-12 gap-1 justify-start">
                   <AnimatePresence mode="popLayout">
                        {currentRowEncoded.map((run, idx) => (
                            <motion.div
                                key={`${activeRow}-${idx}-${run.color}`}
                                layoutId={`run-${activeRow}-${idx}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="h-full rounded-md shadow-sm border border-slate-300 flex items-center justify-center text-xs font-bold relative overflow-hidden min-w-[3rem]"
                                style={{ 
                                    backgroundColor: PALETTE[run.color],
                                    flex: run.count, // Flex grow based on count to show proportion visually
                                    color: run.color === 'white' ? '#1e293b' : 'white'
                                }}
                            >
                                <span className="z-10 bg-black/10 px-1 rounded backdrop-blur-[1px]">
                                    {run.count}{COLOR_LABELS[run.color]}
                                </span>
                            </motion.div>
                        ))}
                   </AnimatePresence>
                </div>
            </div>
            
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">
                Tip: 같은 색이 붙어있어야 자석처럼 합쳐져요!
            </div>
        </div>
      </div>
    </div>
  );
};