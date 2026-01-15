import React, { useState, useRef, useEffect, useMemo } from 'react';
import { DATASETS } from '../constants';
import { DatasetType, DataPoint } from '../types';
import * as d3 from 'd3';

const FieldInvestigation: React.FC = () => {
  const [currentDataset, setCurrentDataset] = useState<DatasetType>(DatasetType.PENGUINS);
  const [isDrawing, setIsDrawing] = useState(false);
  const [circleCenter, setCircleCenter] = useState<{ x: number; y: number } | null>(null);
  const [circleRadius, setCircleRadius] = useState<number>(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState<{ accuracy: number; found: number; total: number } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const dataset = DATASETS[currentDataset];
  
  // Chart dimensions
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  // Scales
  const xScale = useMemo(() => {
    const xValues = dataset.data.map(d => d.x);
    return d3.scaleLinear()
      .domain([Math.min(...xValues) * 0.9, Math.max(...xValues) * 1.1])
      .range([margin.left, width - margin.right]);
  }, [dataset, margin.left, margin.right]);

  const yScale = useMemo(() => {
    const yValues = dataset.data.map(d => d.y);
    return d3.scaleLinear()
      .domain([Math.min(...yValues) * 0.9, Math.max(...yValues) * 1.1])
      .range([height - margin.bottom, margin.top]);
  }, [dataset, margin.bottom, margin.top]);

  // Reset state when dataset changes
  useEffect(() => {
    setRevealed(false);
    setCircleCenter(null);
    setCircleRadius(0);
    setStats(null);
  }, [currentDataset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (revealed) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCircleCenter({ x, y });
    setCircleRadius(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !circleCenter) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius = Math.sqrt(Math.pow(x - circleCenter.x, 2) + Math.pow(y - circleCenter.y, 2));
    setCircleRadius(radius);
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (circleCenter && circleRadius > 5) {
      calculateResults();
    } else {
        // Reset if too small
        setCircleCenter(null);
        setCircleRadius(0);
    }
  };

  const calculateResults = () => {
    if (!circleCenter) return;

    let correctCount = 0;
    let selectedCount = 0;
    const targetTotal = dataset.data.filter(d => d.category === dataset.targetCategory).length;

    dataset.data.forEach(point => {
        const px = xScale(point.x);
        const py = yScale(point.y);
        const dist = Math.sqrt(Math.pow(px - circleCenter.x, 2) + Math.pow(py - circleCenter.y, 2));
        
        if (dist <= circleRadius) {
            selectedCount++;
            if (point.category === dataset.targetCategory) {
                correctCount++;
            }
        }
    });

    // Simple score: Found / Total Existing Target
    const recall = Math.round((correctCount / targetTotal) * 100);
    setStats({
        accuracy: recall,
        found: correctCount,
        total: targetTotal
    });
    setRevealed(true);
  };

  const resetInvestigation = () => {
    setRevealed(false);
    setCircleCenter(null);
    setCircleRadius(0);
    setStats(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold text-amber-500 mb-4">임무 선택 (Mission Select)</h3>
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setCurrentDataset(DatasetType.PENGUINS)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-bold transition ${currentDataset === DatasetType.PENGUINS ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                    🐧 펭귄
                </button>
                <button 
                    onClick={() => setCurrentDataset(DatasetType.SCHOOLS)}
                    className={`flex-1 py-2 px-3 rounded text-sm font-bold transition ${currentDataset === DatasetType.SCHOOLS ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                >
                    🏫 학교
                </button>
            </div>
            <div className="text-slate-300 text-sm">
                <p className="font-semibold text-white mb-1">{dataset.title}</p>
                <p className="mb-2">{dataset.description}</p>
                <div className="bg-slate-900 p-3 rounded border border-slate-600">
                    <span className="block text-xs text-slate-500 uppercase">타겟(목표)</span>
                    <span className="font-mono text-amber-400 text-lg font-bold">{dataset.targetCategory}</span>
                </div>
            </div>
        </div>

        {stats && (
            <div className="bg-slate-800 p-5 rounded-lg border-l-4 border-green-500 animate-slideUp">
                <h3 className="text-lg font-bold text-white mb-2">수사 보고서</h3>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold text-green-400">{stats.accuracy}%</span>
                    <span className="text-slate-400 text-sm mb-1">검거율</span>
                </div>
                <p className="text-sm text-slate-300">
                    총 {stats.total}개의 목표 중 {stats.found}개를 찾았습니다.
                </p>
                <button 
                    onClick={resetInvestigation}
                    className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition"
                >
                    재수사 (Try Again)
                </button>
            </div>
        )}

        {!revealed && (
            <div className="bg-blue-900/30 p-4 rounded border border-blue-500/30 text-blue-200 text-sm">
                <p><strong>지령:</strong> 차트 위를 드래그하여 <span className="font-bold text-white">{dataset.targetCategory}</span>라고 의심되는 점들의 그룹에 동그라미를 치세요.</p>
            </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="flex-1 bg-slate-800 rounded-lg p-4 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-white">현장 스캐너 (Field Scanner)</h2>
            {hoveredPoint && (
                <div className="text-xs bg-slate-900 px-2 py-1 rounded text-amber-300 border border-amber-500/50">
                     x: {hoveredPoint.x.toFixed(0)}, y: {hoveredPoint.y.toFixed(0)} {revealed ? `(${hoveredPoint.category})` : ''}
                </div>
            )}
        </div>
        
        <div className="relative flex-1 bg-slate-900 rounded border border-slate-700 cursor-crosshair">
            <svg 
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Grid Lines */}
                <g className="opacity-20">
                    {xScale.ticks(10).map(tick => (
                        <line key={`x-${tick}`} x1={xScale(tick)} y1={margin.top} x2={xScale(tick)} y2={height - margin.bottom} stroke="currentColor" />
                    ))}
                    {yScale.ticks(10).map(tick => (
                        <line key={`y-${tick}`} x1={margin.left} y1={yScale(tick)} x2={width - margin.right} y2={yScale(tick)} stroke="currentColor" />
                    ))}
                </g>

                {/* Axes */}
                <g>
                    {/* X Axis */}
                    <line x1={margin.left} y1={height - margin.bottom} x2={width - margin.right} y2={height - margin.bottom} stroke="#94a3b8" strokeWidth="2" />
                    <text x={width / 2} y={height - 10} fill="#94a3b8" textAnchor="middle" fontSize="12">{dataset.xLabel}</text>
                    {xScale.ticks(5).map(tick => (
                         <text key={`xt-${tick}`} x={xScale(tick)} y={height - margin.bottom + 15} fill="#64748b" textAnchor="middle" fontSize="10">{tick}</text>
                    ))}

                    {/* Y Axis */}
                    <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#94a3b8" strokeWidth="2" />
                    <text x={15} y={height / 2} fill="#94a3b8" textAnchor="middle" transform={`rotate(-90, 15, ${height/2})`} fontSize="12">{dataset.yLabel}</text>
                     {yScale.ticks(5).map(tick => (
                         <text key={`yt-${tick}`} x={margin.left - 10} y={yScale(tick) + 3} fill="#64748b" textAnchor="end" fontSize="10">{tick}</text>
                    ))}
                </g>

                {/* Data Points */}
                {dataset.data.map((point) => (
                    <circle
                        key={point.id}
                        cx={xScale(point.x)}
                        cy={yScale(point.y)}
                        r={revealed ? 5 : 4}
                        fill={revealed ? point.color : '#94a3b8'}
                        opacity={revealed ? 0.8 : 0.6}
                        stroke={revealed ? '#fff' : 'none'}
                        strokeWidth={revealed ? 1 : 0}
                        className="transition-all duration-500 ease-out"
                        onMouseEnter={() => setHoveredPoint(point)}
                        onMouseLeave={() => setHoveredPoint(null)}
                    />
                ))}

                {/* User Drawn Circle */}
                {circleCenter && (
                    <circle 
                        cx={circleCenter.x}
                        cy={circleCenter.y}
                        r={circleRadius}
                        fill="rgba(245, 158, 11, 0.1)"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                    />
                )}
            </svg>
        </div>
      </div>
    </div>
  );
};

export default FieldInvestigation;
