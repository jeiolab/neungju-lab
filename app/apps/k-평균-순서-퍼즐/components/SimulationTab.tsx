import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { generatePoints, initializeCentroids, assignClusters, updateCentroids } from '../services/kMeansLogic';
import { Point, Centroid } from '../types';
import { Play, SkipForward, RefreshCw, Settings, Info } from 'lucide-react';
import { CLUSTER_COLORS } from '../constants';

interface SimulationTabProps {
  onSimulationComplete: () => void;
}

const WIDTH = 600;
const HEIGHT = 400;

const SimulationTab: React.FC<SimulationTabProps> = ({ onSimulationComplete }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Simulation Settings
  const [k, setK] = useState<number>(3);
  const [initMethod, setInitMethod] = useState<'random' | 'far'>('random');
  
  // State
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isConverged, setIsConverged] = useState(false);
  const [statusMessage, setStatusMessage] = useState("설정 후 '초기화'를 눌러주세요.");

  // Init Data
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetSimulation = () => {
    const newPoints = generatePoints(150, WIDTH, HEIGHT);
    setPoints(newPoints);
    const newCentroids = initializeCentroids(k, WIDTH, HEIGHT, initMethod, newPoints);
    setCentroids(newCentroids);
    setIteration(0);
    setIsConverged(false);
    setIsRunning(false);
    setStatusMessage("데이터와 초기 중심이 준비되었습니다.");
  };

  const step = () => {
    if (isConverged) return;

    // Step 1: Assign
    const { points: assignedPoints, changed: assignmentChanged } = assignClusters(points, centroids);
    setPoints(assignedPoints);

    // If step 1 caused no changes, we might already be stable, but strictly we usually update centroids then check.
    // However, for visual flow: Update Assignment -> (Wait) -> Update Centroids
    
    // Step 2: Update Centroids
    const newCentroids = updateCentroids(assignedPoints, centroids);
    
    // Check convergence based on centroid movement
    const centroidMovement = newCentroids.reduce((sum, c, i) => {
        const old = centroids[i];
        return sum + Math.sqrt(Math.pow(c.x - old.x, 2) + Math.pow(c.y - old.y, 2));
    }, 0);

    setCentroids(newCentroids);
    setIteration(prev => prev + 1);

    if (centroidMovement < 0.1 && !assignmentChanged) {
        setIsConverged(true);
        setIsRunning(false);
        setStatusMessage(`총 ${iteration + 1}회 반복 후 수렴했습니다!`);
        onSimulationComplete();
    } else {
        setStatusMessage(`${iteration + 1}번째 반복: 중심 이동 중...`);
    }
  };

  // Auto-run effect
  useEffect(() => {
    let interval: number;
    if (isRunning && !isConverged) {
      interval = window.setInterval(step, 800);
    }
    return () => clearInterval(interval);
  }); // run on every render if running

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    // 1. Draw Points
    const pointSelection = svg.selectAll<SVGCircleElement, Point>('circle.point')
      .data(points, (d, i) => i.toString());

    pointSelection.enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 0) // animate in
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .merge(pointSelection as any)
      .transition()
      .duration(500)
      .attr('r', 4)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => d.clusterIndex === -1 ? '#cbd5e1' : CLUSTER_COLORS[d.clusterIndex % CLUSTER_COLORS.length]);

    pointSelection.exit().remove();

    // 2. Draw Centroids
    const centroidSelection = svg.selectAll<SVGGElement, Centroid>('g.centroid')
      .data(centroids);

    const centroidEnter = centroidSelection.enter()
      .append('g')
      .attr('class', 'centroid');
    
    // Centroid shape (X)
    centroidEnter.append('path')
        .attr('d', d3.symbol().type(d3.symbolCross).size(400))
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    centroidEnter.merge(centroidSelection as any)
      .transition()
      .duration(500)
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .select('path')
      .attr('fill', d => d.color);

    centroidSelection.exit().remove();

  }, [points, centroids]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto p-4">
      {/* Controls */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" />
            설정
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">군집 개수 (K): {k}</label>
              <input 
                type="range" min="2" max="5" value={k} 
                onChange={(e) => setK(Number(e.target.value))}
                className="w-full accent-indigo-600"
                disabled={iteration > 0}
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">초기 중심 설정 방식</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInitMethod('random')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border ${initMethod === 'random' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                  disabled={iteration > 0}
                >
                  무작위 (Random)
                </button>
                <button
                  onClick={() => setInitMethod('far')}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border ${initMethod === 'far' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
                  disabled={iteration > 0}
                >
                  멀리 두기 (Heuristic)
                </button>
              </div>
            </div>
            
            <button
              onClick={resetSimulation}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              초기화 & 데이터 생성
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h3 className="text-lg font-bold mb-3">상태: <span className="text-indigo-600">{statusMessage}</span></h3>
            <div className="flex gap-2">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    disabled={isConverged}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-50`}
                >
                    {isRunning ? '일시정지' : <><Play className="w-4 h-4" /> 자동 실행</>}
                </button>
                <button
                    onClick={step}
                    disabled={isRunning || isConverged}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold disabled:opacity-50"
                >
                    <SkipForward className="w-4 h-4" />
                    1단계 실행
                </button>
            </div>
        </div>

        {isConverged && (
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
                <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div className="text-sm text-indigo-800">
                        <p className="font-bold mb-1">분석 결과</p>
                        <p>{iteration}번의 반복 만에 군집화가 완료되었습니다.</p>
                        <p>초기화 방식이나 K값을 바꿔가며 반복 횟수가 어떻게 변하는지 관찰해보세요!</p>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Visualization Canvas */}
      <div className="w-full lg:w-2/3 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner relative flex items-center justify-center">
        <svg 
            ref={svgRef} 
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`} 
            className="w-full h-auto bg-white"
            style={{ maxHeight: '500px' }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs font-mono border border-slate-200 shadow-sm">
            Iteration: {iteration} <br/>
            Clusters: {k}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;