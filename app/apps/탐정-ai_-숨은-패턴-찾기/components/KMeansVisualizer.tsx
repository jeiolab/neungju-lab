import React, { useState, useEffect, useRef } from 'react';
import { Point, Centroid } from '../types';
import { generateRandomPoints, initializeCentroids, assignClusters, updateCentroids } from '../services/clusteringService';
import { RefreshCw, Play, Plus, Trash2 } from 'lucide-react';

const WIDTH = 350;
const HEIGHT = 300;

export const KMeansVisualizer: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [k, setK] = useState(3);
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setPoints(generateRandomPoints(20, WIDTH, HEIGHT));
    setCentroids(initializeCentroids(k, WIDTH, HEIGHT));
    setStep(0);
  };

  const handleRunStep = () => {
    // Step 1: Assign to nearest centroid
    const newPoints = assignClusters(points, centroids);
    
    // Check if points actually changed cluster to prevent infinite loops visually (simplified)
    const pointsChanged = JSON.stringify(newPoints) !== JSON.stringify(points);
    
    setPoints(newPoints);
    
    // Step 2: Update centroid positions
    const newCentroids = updateCentroids(newPoints, centroids);
    setCentroids(newCentroids);
    
    setStep((prev) => prev + 1);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x >= 0 && x <= WIDTH && y >= 0 && y <= HEIGHT) {
      setPoints([...points, { id: `manual-${Date.now()}`, x, y, clusterId: null }]);
    }
  };

  const handleKChange = (newK: number) => {
    setK(newK);
    setCentroids(initializeCentroids(newK, WIDTH, HEIGHT));
    setPoints(points.map(p => ({ ...p, clusterId: null, color: undefined }))); // Reset assignments
    setStep(0);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-blue-600 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs">1</span>
        데이터 탐정 훈련소 (2D 시각화)
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">군집 수 (K): {k}</label>
            <input 
              type="range" 
              min="2" 
              max="5" 
              value={k} 
              onChange={(e) => handleKChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 space-y-2">
             <p className="flex items-center gap-2"><Plus size={16}/> 빈 공간을 클릭해 데이터를 추가하세요.</p>
             <p>현재 단계: {step}회 반복</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleRunStep}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Play size={16} /> 실행 (1단계)
            </button>
            <button 
              onClick={reset}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={16} /> 초기화
            </button>
          </div>
        </div>

        {/* Visualization Area */}
        <div 
          className="relative bg-slate-100 rounded-xl border border-slate-300 overflow-hidden cursor-crosshair mx-auto"
          style={{ width: WIDTH, height: HEIGHT }}
          ref={containerRef}
          onClick={handleCanvasClick}
        >
          {/* Centroids */}
          {centroids.map((c) => (
            <div
              key={`centroid-${c.id}`}
              className="absolute w-6 h-6 border-2 border-white rounded-full flex items-center justify-center shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-10"
              style={{ 
                left: c.x, 
                top: c.y, 
                backgroundColor: c.color 
              }}
            >
              <span className="text-white text-xs font-bold">K</span>
            </div>
          ))}

          {/* Points */}
          {points.map((p) => (
            <div
              key={p.id}
              className="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
              style={{ 
                left: p.x, 
                top: p.y, 
                backgroundColor: p.color || '#94a3b8' // Gray if not assigned
              }}
            />
          ))}
          
          <div className="absolute bottom-2 right-2 text-xs text-slate-400 select-none">
            Click to add points
          </div>
        </div>
      </div>
    </div>
  );
};