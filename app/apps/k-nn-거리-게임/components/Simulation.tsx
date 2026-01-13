import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Settings, Info, AlertTriangle, Crosshair } from 'lucide-react';
import { SCENARIOS, GENRE_COLORS, GENRE_LABELS } from '../constants';
import { findNearestNeighbors, getMajorityVote } from '../services/knnService';
import { DistanceMetric } from '../types';

interface SimulationProps {
  onUnlockBadge: (badge: string) => void;
}

const Simulation: React.FC<SimulationProps> = ({ onUnlockBadge }) => {
  const [scenarioId, setScenarioId] = useState('balanced');
  const [k, setK] = useState(3);
  const [metric, setMetric] = useState<DistanceMetric>('Euclidean');
  const [isNormalized, setIsNormalized] = useState(false);
  
  // User position in DATA coordinates (not pixels)
  const [userPos, setUserPos] = useState({ x: 5, y: 5 });
  const [isDragging, setIsDragging] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);

  const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];

  // Reset user pos when scenario changes to keep it in view
  useEffect(() => {
    setUserPos({ 
      x: (scenario.xAxis.max - scenario.xAxis.min) / 2, 
      y: (scenario.yAxis.max - scenario.yAxis.min) / 2 
    });
  }, [scenarioId, scenario]);

  // Gamification checks
  useEffect(() => {
    if (scenarioId === 'unbalanced' && isNormalized) {
      onUnlockBadge('Normalization Master');
    }
    if (k >= 7) {
      onUnlockBadge('K-Tuner');
    }
  }, [scenarioId, isNormalized, k, onUnlockBadge]);

  // Dimensions
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(() => d3.scaleLinear()
    .domain([scenario.xAxis.min, scenario.xAxis.max])
    .range([0, innerWidth]), [scenario, innerWidth]);

  const yScale = useMemo(() => d3.scaleLinear()
    .domain([scenario.yAxis.min, scenario.yAxis.max])
    .range([innerHeight, 0]), [scenario, innerHeight]);

  // Computation
  const nearestData = useMemo(() => {
    return findNearestNeighbors(
      userPos,
      scenario.points,
      k,
      metric,
      isNormalized,
      { minX: scenario.xAxis.min, maxX: scenario.xAxis.max, minY: scenario.yAxis.min, maxY: scenario.yAxis.max }
    );
  }, [userPos, scenario, k, metric, isNormalized]);

  const result = useMemo(() => getMajorityVote(nearestData), [nearestData]);

  // Interaction Handlers
  const handleDrag = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!isDragging && e.type !== 'click') return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const point = svg.createSVGPoint();
    // Normalize event coordinates
    const clientX = (e as any).touches ? (e as any).touches[0].clientX : (e as any).clientX;
    const clientY = (e as any).touches ? (e as any).touches[0].clientY : (e as any).clientY;
    
    point.x = clientX;
    point.y = clientY;
    
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const svgPoint = point.matrixTransform(ctm.inverse());
      // Convert SVG pixels to graph data coordinates
      const graphX = svgPoint.x - margin.left;
      const graphY = svgPoint.y - margin.top;
      
      const clampedX = Math.max(scenario.xAxis.min, Math.min(scenario.xAxis.max, xScale.invert(graphX)));
      const clampedY = Math.max(scenario.yAxis.min, Math.min(scenario.yAxis.max, yScale.invert(graphY)));
      
      setUserPos({ x: clampedX, y: clampedY });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Controls Panel */}
      <div className="lg:w-1/3 space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-800">
            <Settings className="w-5 h-5 text-gray-600" />
            설정 (Configuration)
          </h3>
          
          <div className="space-y-4">
            {/* Scenario Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">데이터 시나리오</label>
              <select 
                value={scenarioId} 
                onChange={(e) => setScenarioId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              >
                {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
            </div>

            {/* K Slider */}
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">이웃 수 (k): {k}</label>
                {k === 1 && <span className="text-xs text-red-500 font-bold flex items-center"><AlertTriangle size={12} className="mr-1"/> 불안정(Unstable)!</span>}
              </div>
              <input 
                type="range" 
                min="1" 
                max="9" 
                step="2" 
                value={k} 
                onChange={(e) => setK(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 px-1">
                <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">정규화 (Normalization)</span>
              <button 
                onClick={() => setIsNormalized(!isNormalized)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isNormalized ? 'bg-indigo-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isNormalized ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">거리 측정법 (Metric)</span>
              <div className="flex bg-gray-200 rounded-lg p-1">
                 <button 
                  onClick={() => setMetric('Euclidean')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${metric === 'Euclidean' ? 'bg-white shadow text-indigo-700 font-bold' : 'text-gray-500'}`}
                 >Euclidean</button>
                 <button 
                  onClick={() => setMetric('Manhattan')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${metric === 'Manhattan' ? 'bg-white shadow text-indigo-700 font-bold' : 'text-gray-500'}`}
                 >Manhattan</button>
              </div>
            </div>

          </div>
        </div>

        {/* Live Result */}
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <h4 className="text-xs uppercase text-indigo-500 font-bold mb-2">예측된 장르 (Predicted)</h4>
          <div className="flex items-center gap-3">
             <div className="text-3xl font-bold text-indigo-900">
               {result.winner === 'Tie' ? '불확실 (동점)' : GENRE_LABELS[result.winner]}
             </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            이웃 {k}명 기준:
            <ul className="mt-1 list-disc list-inside">
              {Object.entries(result.counts).map(([g, c]) => (
                <li key={g}>{g}: {c}표</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 bg-white p-4 rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
         <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-lg shadow text-xs text-gray-500 z-10 pointer-events-none border border-gray-100">
           <div className="font-bold flex items-center gap-1"><Crosshair size={12}/> 좌표 (Coordinates)</div>
           <div>{scenario.xAxis.label}: {userPos.x.toFixed(1)}</div>
           <div>{scenario.yAxis.label}: {userPos.y.toFixed(0)}</div>
         </div>

        <svg 
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto touch-none cursor-crosshair select-none"
          onMouseDown={(e) => { setIsDragging(true); handleDrag(e); }}
          onMouseMove={handleDrag}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={(e) => { setIsDragging(true); handleDrag(e); }}
          onTouchMove={handleDrag}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Grid and Axes */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* X Axis */}
            <line x1={0} y1={innerHeight} x2={innerWidth} y2={innerHeight} stroke="#ccc" strokeWidth="2" />
            <text x={innerWidth / 2} y={innerHeight + 35} textAnchor="middle" className="text-sm fill-gray-500 font-medium">
              {scenario.xAxis.label} ({scenario.xAxis.unit})
            </text>
            {/* Y Axis */}
            <line x1={0} y1={0} x2={0} y2={innerHeight} stroke="#ccc" strokeWidth="2" />
             <text x={-40} y={innerHeight / 2} textAnchor="middle" transform={`rotate(-90, -40, ${innerHeight/2})`} className="text-sm fill-gray-500 font-medium">
              {scenario.yAxis.label} ({scenario.yAxis.unit})
            </text>

            {/* Connecting Lines to K Nearest */}
            {nearestData.map((n) => (
              <line 
                key={`line-${n.neighbor.id}`}
                x1={xScale(userPos.x)} 
                y1={yScale(userPos.y)}
                x2={xScale(n.neighbor.x)} 
                y2={yScale(n.neighbor.y)}
                stroke={GENRE_COLORS[n.neighbor.genre]}
                strokeWidth={isNormalized ? 1 : 2}
                strokeDasharray="4"
                opacity={0.6}
              />
            ))}

            {/* Data Points */}
            {scenario.points.map((p) => {
              const isNeighbor = nearestData.some(n => n.neighbor.id === p.id);
              return (
                <circle 
                  key={p.id}
                  cx={xScale(p.x)}
                  cy={yScale(p.y)}
                  r={isNeighbor ? 8 : 5}
                  fill={GENRE_COLORS[p.genre]}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300"
                  opacity={isNeighbor ? 1 : 0.4}
                />
              );
            })}

            {/* User Draggable Point */}
            <circle 
              cx={xScale(userPos.x)}
              cy={yScale(userPos.y)}
              r={12}
              fill="#4f46e5"
              stroke="white"
              strokeWidth="3"
              className="filter drop-shadow-md cursor-grab active:cursor-grabbing"
            />
            <text 
              x={xScale(userPos.x)} 
              y={yScale(userPos.y) - 20} 
              textAnchor="middle" 
              className="text-xs font-bold fill-indigo-700 pointer-events-none bg-white"
            >
              ME(나)
            </text>
          </g>
        </svg>

        {scenarioId === 'unbalanced' && !isNormalized && (
          <div className="mt-2 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="break-keep">
              <strong>경고:</strong> 정규화를 하지 않아 Y축(용돈, 0~10만)이 X축(0~10)을 완전히 압도하고 있습니다. 
              알고리즘이 공부 시간을 무시하고 있어요! '정규화'를 켜서 해결하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;