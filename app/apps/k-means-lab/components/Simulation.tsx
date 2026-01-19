import React, { useState, useEffect, useRef } from 'react';
import { Point, Centroid, SimulationStep } from '../types';
import { CLUSTER_COLORS, UNASSIGNED_COLOR } from '../constants';
import { generateReport } from '../services/geminiService';

interface SimulationProps {
  onComplete: () => void;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const POINT_COUNT = 50;

const Simulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [k, setK] = useState<number>(3);
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [step, setStep] = useState<SimulationStep>(SimulationStep.IDLE);
  const [iteration, setIteration] = useState<number>(0);
  const [report, setReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Initialize random points
  useEffect(() => {
    resetSimulation();
  }, []);

  const generateRandomPoints = () => {
    const newPoints: Point[] = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      newPoints.push({
        id: i,
        x: Math.random() * (CANVAS_WIDTH - 40) + 20,
        y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
        clusterIndex: -1,
      });
    }
    return newPoints;
  };

  const resetSimulation = () => {
    setPoints(generateRandomPoints());
    setCentroids([]);
    setStep(SimulationStep.IDLE);
    setIteration(0);
    setReport(null);
  };

  const initCentroids = () => {
    const newCentroids: Centroid[] = [];
    // Pick K random points as initial centroids or just random locations
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        id: i,
        x: Math.random() * (CANVAS_WIDTH - 40) + 20,
        y: Math.random() * (CANVAS_HEIGHT - 40) + 20,
        color: CLUSTER_COLORS[i % CLUSTER_COLORS.length],
      });
    }
    setCentroids(newCentroids);
    // Reset points assignment
    setPoints(prev => prev.map(p => ({ ...p, clusterIndex: -1 })));
    setStep(SimulationStep.IDLE);
    setIteration(0);
    setReport(null);
  };

  const calculateDistance = (p1: Point, c: Centroid) => {
    return Math.sqrt(Math.pow(p1.x - c.x, 2) + Math.pow(p1.y - c.y, 2));
  };

  const assignPoints = () => {
    let changed = false;
    const newPoints = points.map(point => {
      let minDist = Infinity;
      let closestClusterIndex = -1;

      centroids.forEach((centroid, idx) => {
        const dist = calculateDistance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          closestClusterIndex = idx;
        }
      });

      if (point.clusterIndex !== closestClusterIndex) {
        changed = true;
      }

      return { ...point, clusterIndex: closestClusterIndex };
    });

    setPoints(newPoints);
    setStep(SimulationStep.ASSIGNED);
  };

  const updateCentroids = () => {
    const newCentroids = centroids.map((centroid, idx) => {
      const assignedPoints = points.filter(p => p.clusterIndex === idx);
      
      if (assignedPoints.length === 0) return centroid;

      const sumX = assignedPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = assignedPoints.reduce((sum, p) => sum + p.y, 0);

      return {
        ...centroid,
        x: sumX / assignedPoints.length,
        y: sumY / assignedPoints.length,
        color: centroid.color
      };
    });

    // Check convergence
    const hasMoved = newCentroids.some((nc, i) => {
      const old = centroids[i];
      return Math.abs(nc.x - old.x) > 0.5 || Math.abs(nc.y - old.y) > 0.5;
    });

    setCentroids(newCentroids);
    setIteration(prev => prev + 1);

    if (!hasMoved) {
      setStep(SimulationStep.CONVERGED);
      onComplete(); // Trigger XP gain
      handleReportGeneration(iteration + 1, true);
    } else {
      setStep(SimulationStep.UPDATED);
    }
  };

  const handleReportGeneration = async (finalIter: number, converged: boolean) => {
    setIsGeneratingReport(true);
    const result = await generateReport(k, finalIter, converged);
    setReport(result);
    setIsGeneratingReport(false);
  };

  const handleNextStep = () => {
    if (centroids.length === 0) {
      initCentroids();
      return;
    }

    if (step === SimulationStep.IDLE || step === SimulationStep.UPDATED) {
      assignPoints();
    } else if (step === SimulationStep.ASSIGNED) {
      updateCentroids();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Control Panel */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">실험 제어 패널</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              군집 개수 (K): <span className="text-indigo-600 font-bold text-lg">{k}</span>
            </label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={k} 
              onChange={(e) => {
                setK(Number(e.target.value));
                setCentroids([]); // Reset centroids when K changes
                setStep(SimulationStep.IDLE);
              }}
              disabled={centroids.length > 0 && step !== SimulationStep.CONVERGED}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-2">
              * 실험 중에는 K값을 변경할 수 없습니다. 초기화 후 변경하세요.
            </p>
          </div>

          <div className="flex flex-col gap-3">
             <button
              onClick={handleNextStep}
              disabled={step === SimulationStep.CONVERGED}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors shadow-md
                ${step === SimulationStep.CONVERGED 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 transform transition-transform'}`}
            >
              {centroids.length === 0 ? '실험 시작 (초기화)' : 
               step === SimulationStep.ASSIGNED ? '2단계: 중심 이동 (Move)' : 
               '1단계: 군집 할당 (Assign)'}
            </button>

            <button
              onClick={resetSimulation}
              className="w-full py-2 px-4 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200"
            >
              데이터 재설정 (Reset)
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-500">현재 상태</span>
              <span className={`px-2 py-1 rounded text-xs font-bold 
                ${step === SimulationStep.CONVERGED ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {step === SimulationStep.IDLE ? '준비됨' :
                 step === SimulationStep.ASSIGNED ? '할당 완료' :
                 step === SimulationStep.UPDATED ? '이동 완료' : '수렴 완료 (Converged)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">반복 횟수 (Iteration)</span>
              <span className="text-lg font-mono font-bold text-slate-800">{iteration}</span>
            </div>
          </div>
        </div>

        {/* AI Report Section */}
        {(step === SimulationStep.CONVERGED || report) && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI 실험 리포트
            </h3>
            {isGeneratingReport ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                <div className="h-4 bg-indigo-200 rounded w-full"></div>
                <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-sm text-indigo-800 whitespace-pre-wrap leading-relaxed">
                {report}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Visualization Canvas */}
      <div className="lg:w-2/3 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden relative">
        <div className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-500 border border-slate-200">
          50 Points • {k} Clusters
        </div>
        
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} 
          className="bg-slate-50 w-full h-full min-h-[400px]"
        >
          {/* Grid lines for scientific look */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Connection Lines (Optional visualization aid) */}
          {step === SimulationStep.ASSIGNED && points.map(p => {
             if (p.clusterIndex === -1) return null;
             const centroid = centroids[p.clusterIndex];
             return (
               <line 
                key={`line-${p.id}`}
                x1={p.x} 
                y1={p.y} 
                x2={centroid.x} 
                y2={centroid.y} 
                stroke={centroid.color} 
                strokeOpacity="0.2" 
                strokeWidth="1"
               />
             )
          })}

          {/* Points */}
          {points.map((p) => (
            <circle
              key={`point-${p.id}`}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={p.clusterIndex === -1 ? UNASSIGNED_COLOR : CLUSTER_COLORS[p.clusterIndex % CLUSTER_COLORS.length]}
              className="transition-all duration-500 ease-in-out"
              opacity={0.8}
            />
          ))}

          {/* Centroids */}
          {centroids.map((c) => (
            <g 
              key={`centroid-${c.id}`} 
              className="transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ transform: `translate(${c.x}px, ${c.y}px)` }}
            >
              {/* Star shape for centroid */}
              <polygon
                points="0,-12 3,-4 11,-4 5,1 7,9 0,5 -7,9 -5,1 -11,-4 -3,-4"
                fill={c.color}
                stroke="#fff"
                strokeWidth="2"
                className="drop-shadow-md"
              />
              <circle r="15" fill={c.color} opacity="0.1" className="animate-ping-slow" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Simulation;
