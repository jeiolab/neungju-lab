import React, { useRef, useEffect, useState } from 'react';
import { Point, Neighbor, ClassType } from '../types';
import { findNearestNeighbors, classifyPoint } from '../utils/knn';
import { Star, RefreshCw } from 'lucide-react';

interface SimulationCanvasProps {
  k: number;
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  onSimulationRun: () => void;
  interactive?: boolean;
  predefinedTarget?: { x: number; y: number } | null;
  showControls?: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  k,
  points,
  setPoints,
  onSimulationRun,
  interactive = true,
  predefinedTarget = null,
  showControls = true,
}) => {
  const [target, setTarget] = useState<{ x: number; y: number } | null>(predefinedTarget);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [prediction, setPrediction] = useState<ClassType>('neutral');
  const svgRef = useRef<SVGSVGElement>(null);

  // Constants for viewBox
  const VIEW_WIDTH = 400;
  const VIEW_HEIGHT = 300;

  useEffect(() => {
    if (predefinedTarget) {
      setTarget(predefinedTarget);
    }
  }, [predefinedTarget]);

  // Recalculate when K, points, or target changes
  useEffect(() => {
    if (target) {
      const nearest = findNearestNeighbors(target, points, k);
      setNeighbors(nearest);
      const result = classifyPoint(nearest);
      setPrediction(result);
    }
  }, [k, target, points]);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEW_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * VIEW_HEIGHT;

    setTarget({ x, y });
    onSimulationRun();
  };

  const regeneratePoints = () => {
    // Keep 50/50 distribution roughly
    const newPoints: Point[] = Array.from({ length: 20 }).map((_, i) => ({
      id: `p-${Date.now()}-${i}`,
      x: Math.random() * VIEW_WIDTH,
      y: Math.random() * VIEW_HEIGHT,
      type: Math.random() > 0.5 ? 'red' : 'blue',
    }));
    setPoints(newPoints);
    setTarget(null);
    setNeighbors([]);
    setPrediction('neutral');
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {showControls && (
        <div className="flex justify-between w-full items-center mb-2 px-2">
           <div className="text-sm font-medium text-slate-600">
             {target ? (
               <span>
                 예측 결과: <span className={`font-bold ${prediction === 'red' ? 'text-red-500' : prediction === 'blue' ? 'text-blue-500' : 'text-yellow-500'}`}>
                   {prediction === 'red' ? '빨강 팀' : prediction === 'blue' ? '파랑 팀' : '판단 중...'}
                 </span>
               </span>
             ) : (
               <span>빈 공간을 클릭해보세요!</span>
             )}
           </div>
           <button 
             onClick={regeneratePoints}
             className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded transition"
           >
             <RefreshCw size={12} /> 데이터 재배치
           </button>
        </div>
      )}

      <div className="relative w-full aspect-[4/3] bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden cursor-crosshair">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full h-full"
          onClick={handleCanvasClick}
        >
          {/* Grid Background (Optional) */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection Lines */}
          {target && neighbors.map((n) => (
            <line
              key={`line-${n.id}`}
              x1={target.x}
              y1={target.y}
              x2={n.x}
              y2={n.y}
              stroke={n.type === 'red' ? '#fca5a5' : '#93c5fd'}
              strokeWidth="2"
              strokeDasharray="4"
              className="animate-pulse"
            />
          ))}

          {/* Existing Points */}
          {points.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={6}
              fill={p.type === 'red' ? '#ef4444' : '#3b82f6'}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-300"
            />
          ))}

          {/* Neighbors Highlight Ring */}
          {neighbors.map((n) => (
            <circle
              key={`highlight-${n.id}`}
              cx={n.x}
              cy={n.y}
              r={10}
              fill="none"
              stroke={n.type === 'red' ? '#b91c1c' : '#1d4ed8'}
              strokeWidth="1.5"
              className="opacity-50"
            />
          ))}

          {/* Target Point (Star) */}
          {target && (
            <g transform={`translate(${target.x - 12}, ${target.y - 12})`}>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={prediction === 'red' ? '#ef4444' : prediction === 'blue' ? '#3b82f6' : '#eab308'}
                stroke="white"
                strokeWidth="2"
                className="drop-shadow-md transition-colors duration-300"
              />
            </g>
          )}
        </svg>

        {/* Floating Label for K */}
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-500 border border-slate-200">
          K = {k}
        </div>
      </div>
    </div>
  );
};

export default SimulationCanvas;
