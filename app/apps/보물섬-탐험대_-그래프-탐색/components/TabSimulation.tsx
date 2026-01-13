import React, { useState, useEffect, useRef } from 'react';
import { LEVEL_2 } from '../constants';
import MapVisualizer from './MapVisualizer';
import { runBFS, runDFS } from '../utils/graphAlgorithms';
import { AlgorithmType } from '../types';
import { Play, RotateCcw, FastForward } from 'lucide-react';

const TabSimulation: React.FC = () => {
  const [algo, setAlgo] = useState<AlgorithmType>(AlgorithmType.BFS);
  const [history, setHistory] = useState<string[]>([]);
  const [step, setStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  const graph = LEVEL_2.graph; // Use Level 2 for Simulation
  const startNode = LEVEL_2.startNodeId;

  // Initialize path calculation when algo changes
  useEffect(() => {
    resetSim();
  }, [algo]);

  const resetSim = () => {
    stopTimer();
    setStep(-1);
    setIsPlaying(false);
    const newHistory = algo === AlgorithmType.BFS
      ? runBFS(graph, startNode)
      : runDFS(graph, startNode);
    setHistory(newHistory);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopTimer();
    } else {
      setIsPlaying(true);
      if (step >= history.length - 1) {
        setStep(-1); // Restart if finished
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setStep((prev) => {
          if (prev >= history.length - 1) {
            stopTimer();
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800); // 800ms per step
    }
    return () => stopTimer();
  }, [isPlaying, history.length]);

  // Derived state for visualization
  const visitedNodeIds = step >= 0 ? history.slice(0, step + 1) : [];
  const activeNodeId = step >= 0 ? history[step] : null;
  const pathEdgeIds = new Set<string>();

  // Helper to highlight edges used in traversal (approximate for vis)
  if (step > 0) {
    // This logic is simple: if we visited B then C, and they are connected, highlight edge.
    // Real traversal tree logic is complex to reconstruct just from history list,
    // so we will just show visited nodes for simplicity in this demo,
    // or infer edges based on history adjacency.
    for (let i = 0; i < visitedNodeIds.length - 1; i++) {
        const u = visitedNodeIds[i];
        // For visualization, finding the exact parent in BFS history is tricky without storing it.
        // We will just leave edges purely static or fully highlight valid connections between visited set.
    }
  }

  // Calculate connections between visited nodes for visualization
  // Only connect if there is a direct edge
  visitedNodeIds.forEach(u => {
     visitedNodeIds.forEach(v => {
        if (u === v) return;
        const hasEdge = graph.edges.some(e =>
            (e.source === u && e.target === v) || (e.source === v && e.target === u)
        );
        if (hasEdge) {
             // In exact tree, we'd filter more, but showing all connections in visited set is okay for "Explored Area"
             pathEdgeIds.add([u, v].sort().join('-'));
        }
     });
  });


  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-center w-full max-w-4xl">
        <div className="flex items-center gap-2">
          <label className="font-bold text-gray-700">탐색 방식:</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as AlgorithmType)}
            className="border-2 border-ocean rounded-lg px-3 py-1 bg-white text-gray-800 font-medium focus:outline-none"
          >
            <option value={AlgorithmType.BFS}>BFS (너비 우선 - 문어발)</option>
            <option value={AlgorithmType.DFS}>DFS (깊이 우선 - 드릴)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${
              isPlaying ? 'bg-orange-500 shadow-orange-200' : 'bg-green-500 shadow-green-200'
            } shadow-lg`}
          >
            {isPlaying ? <span className="flex items-center gap-1">❚❚ 일시정지</span> : <span className="flex items-center gap-1"><Play size={18}/> 탐색 시작</span>}
          </button>

          <button
            onClick={resetSim}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-300 transition-colors"
          >
            <RotateCcw size={18} /> 초기화
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-4xl bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
        <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow border border-gray-200">
           <span className="text-sm font-bold text-gray-500">현재 방문: </span>
           <span className="text-lg font-bold text-ocean">{activeNodeId || "-"}</span>
        </div>
        <MapVisualizer
          graph={graph}
          activeNodeId={activeNodeId}
          visitedNodeIds={visitedNodeIds}
          pathEdgeIds={pathEdgeIds}
        />
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-2 text-sm">탐색 순서 (Log):</h4>
            <div className="flex flex-wrap gap-2">
                {history.map((node, idx) => (
                    <div key={idx} className={`flex items-center ${idx === step ? 'scale-110' : 'opacity-50'} transition-all`}>
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border-2
                            ${idx <= step ? 'bg-ocean text-white border-ocean' : 'bg-gray-200 text-gray-500 border-gray-300'}
                        `}>
                            {node}
                        </span>
                        {idx < history.length - 1 && <span className="text-gray-300 mx-1">→</span>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;