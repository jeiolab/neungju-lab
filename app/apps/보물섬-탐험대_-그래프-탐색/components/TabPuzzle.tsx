import React, { useState, useEffect } from 'react';
import { LEVEL_1, LEVEL_2, LEVEL_3 } from '../constants';
import MapVisualizer from './MapVisualizer';
import { findShortestPath } from '../utils/graphAlgorithms';
import { Trophy, RefreshCw, Map as MapIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

const TabPuzzle: React.FC = () => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [userPath, setUserPath] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState("출발지(A)부터 보물까지 연결해보세요!");

  const currentLevel = LEVELS[levelIndex];
  const { graph, startNodeId, targetNodeId, minMoves } = currentLevel;

  // Reset when level changes
  useEffect(() => {
    resetLevel();
  }, [levelIndex]);

  const resetLevel = () => {
    setUserPath([startNodeId]);
    setGameState('playing');
    setMessage(`최소 ${minMoves}번의 이동으로 보물을 찾아보세요!`);
  };

  const handleNodeClick = (nodeId: string) => {
    if (gameState !== 'playing') return;

    const lastNode = userPath[userPath.length - 1];

    // Check if clicked node is a neighbor of the last node
    const isNeighbor = graph.edges.some(
      e => (e.source === lastNode && e.target === nodeId) ||
           (e.target === lastNode && e.source === nodeId)
    );

    // If clicking the last node again, undo (go back)
    if (nodeId === userPath[userPath.length - 2]) {
        setUserPath(prev => prev.slice(0, -1));
        return;
    }

    if (!isNeighbor) {
      setMessage("⚠️ 연결된 길이 없어요! 인접한 장소만 갈 수 있습니다.");
      // Small shake animation could go here
      return;
    }

    // Add to path
    const newPath = [...userPath, nodeId];
    setUserPath(newPath);

    // Check Win Condition
    if (nodeId === targetNodeId) {
      const optimalPath = findShortestPath(graph, startNodeId, targetNodeId);
      // Moves = nodes visited - 1
      const moves = newPath.length - 1;

      if (moves <= minMoves) {
        setGameState('won');
        setMessage("🎉 완벽해요! 최단 경로를 발견했습니다!");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4ecdc4', '#f1c40f', '#e67e22']
        });
      } else {
        // Reached target but path too long
        setGameState('playing'); // Let them continue or reset? Let's treat as partial success but encourage optimization
        setMessage(`도착했지만 조금 멀리 돌아왔네요. (${moves} 이동). 최단 경로는 ${minMoves} 이동입니다.`);
      }
    } else {
        setMessage("탐험 진행 중...");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Level Selector */}
      <div className="flex gap-2 overflow-x-auto p-2 w-full justify-center">
        {LEVELS.map((lvl, idx) => (
          <button
            key={lvl.id}
            onClick={() => setLevelIndex(idx)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-bold transition-all ${
              levelIndex === idx
                ? 'bg-ocean text-white shadow-lg scale-105'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            Level {lvl.id}: {lvl.name}
          </button>
        ))}
      </div>

      {/* Game Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">{currentLevel.name}</h2>
        <div className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${
            gameState === 'won' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
            {message}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
        <MapVisualizer
          graph={graph}
          userPath={userPath}
          onNodeClick={handleNodeClick}
        />

        {/* Floating Controls */}
        <div className="absolute bottom-6 right-6 flex gap-2">
            <button
                onClick={resetLevel}
                className="bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-ocean hover:bg-blue-50 transition-colors border border-gray-200"
                title="다시 시작"
            >
                <RefreshCw size={24} />
            </button>
        </div>

        {/* Win Overlay */}
        {gameState === 'won' && (
             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                 <div className="bg-white p-8 rounded-3xl text-center shadow-2xl transform animate-bounce-slow">
                     <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
                     <h3 className="text-3xl font-bold text-gray-800 mb-2">보물 발견!</h3>
                     <p className="text-gray-600 mb-6">최단 경로로 보물에 도착했습니다.</p>
                     {levelIndex < LEVELS.length - 1 ? (
                         <button
                            onClick={() => setLevelIndex(prev => prev + 1)}
                            className="bg-ocean hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                         >
                            다음 레벨 도전
                         </button>
                     ) : (
                         <div className="text-ocean font-bold">모든 레벨을 정복했습니다!</div>
                     )}
                 </div>
             </div>
        )}
      </div>

      <div className="w-full max-w-4xl bg-blue-50 p-4 rounded-xl text-sm text-blue-800 flex items-start gap-2">
        <MapIcon size={20} className="mt-0.5 shrink-0" />
        <p>
          <strong>힌트:</strong> 최단 경로를 찾으려면 BFS(너비 우선 탐색) 처럼 현재 위치에서 가장 가까운 곳을 먼저 확인하며 나아가야 합니다.
          왔던 길을 되돌아가지 않도록 주의하세요!
        </p>
      </div>
    </div>
  );
};

export default TabPuzzle;