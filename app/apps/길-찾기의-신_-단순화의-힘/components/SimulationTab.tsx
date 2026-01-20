import React, { useState, useEffect, useRef } from 'react';
import { Node, Edge, Coordinate, SimulationStats } from '../types';
import { getAIHint } from '../services/geminiService';
import { Lightbulb, RotateCcw, CheckCircle, Info } from 'lucide-react';

// Hardcoded "Complex Map" Data
const MAP_WIDTH = 600;
const MAP_HEIGHT = 400;

const TRUE_NODES: Node[] = [
  { id: 'n1', x: 50, y: 350, label: '집 (출발)', type: 'start' },
  { id: 'n2', x: 150, y: 350, label: '교차로1', type: 'intersection' },
  { id: 'n3', x: 150, y: 200, label: '교차로2', type: 'intersection' },
  { id: 'n4', x: 300, y: 200, label: '다리 입구', type: 'intersection' },
  { id: 'n5', x: 450, y: 200, label: '다리 출구', type: 'intersection' },
  { id: 'n6', x: 450, y: 100, label: '학교 앞', type: 'intersection' },
  { id: 'n7', x: 550, y: 100, label: '학교 (도착)', type: 'end' },
];

const NOISE_OBJECTS: Node[] = [
  { id: 'noise1', x: 80, y: 300, label: '편의점', type: 'building', isNoise: true },
  { id: 'noise2', x: 200, y: 320, label: '가로수', type: 'tree', isNoise: true },
  { id: 'noise3', x: 220, y: 180, label: '광고판', type: 'building', isNoise: true },
  { id: 'noise4', x: 380, y: 240, label: '오리배', type: 'tree', isNoise: true },
  { id: 'noise5', x: 500, y: 50, label: '문구점', type: 'building', isNoise: true },
  { id: 'noise6', x: 100, y: 100, label: '공원 벤치', type: 'tree', isNoise: true },
];

const SimulationTab: React.FC = () => {
  const [userNodes, setUserNodes] = useState<Node[]>([]);
  const [userEdges, setUserEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [abstractionLevel, setAbstractionLevel] = useState<number>(0); // 0 = Reality, 100 = Model
  const [feedback, setFeedback] = useState<string>("지도의 중요 지점(교차로, 건물)을 클릭하세요.");
  const [stats, setStats] = useState<SimulationStats>({
    nodesFound: 0,
    noiseClicked: 0,
    edgesCreated: 0,
    completed: false,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Handle click on canvas
  const handleMapClick = async (e: React.MouseEvent) => {
    if (abstractionLevel > 50) {
      setFeedback("추상화 모드에서는 지도를 수정할 수 없습니다. 슬라이더를 왼쪽으로 옮기세요.");
      return;
    }

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check collision with True Nodes (increased click radius for better UX)
    const CLICK_RADIUS = 35; // Increased from 25 to 35 for easier clicking
    const clickedNode = TRUE_NODES.find(n => Math.hypot(n.x - x, n.y - y) < CLICK_RADIUS);
    
    if (clickedNode) {
      if (!userNodes.find(n => n.id === clickedNode.id)) {
        setUserNodes(prev => [...prev, clickedNode]);
        setFeedback(`✅ '${clickedNode.label}' 추가됨! 연결할 다음 지점을 선택하거나 선을 이으세요.`);
        setStats(prev => ({ ...prev, nodesFound: prev.nodesFound + 1 }));
      } else {
        setFeedback(`'${clickedNode.label}'는 이미 추가되었습니다. 다른 지점을 클릭하세요.`);
      }
      return;
    }

    // Check collision with Noise
    const clickedNoise = NOISE_OBJECTS.find(n => Math.hypot(n.x - x, n.y - y) < CLICK_RADIUS);
    if (clickedNoise) {
      setFeedback("정보 과부하! 등굣길 찾기에 편의점 브랜드나 나무는 필요 없습니다.");
      setStats(prev => ({ ...prev, noiseClicked: prev.noiseClicked + 1 }));
      
      // Get AI Hint if struggling with noise
      if (stats.noiseClicked > 2) {
        const hint = await getAIHint(stats.nodesFound, stats.noiseClicked + 1);
        setFeedback(`[AI 코치] ${hint}`);
      }
      return;
    }

    // Clicking empty space
    setFeedback("💡 중요 지점(교차로, 건물 입구)을 클릭하세요. 편의점이나 나무 같은 것은 무시하세요.");
  };

  const handleNodeClick = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation(); // Prevent map click
    if (abstractionLevel > 50) return;

    if (selectedNodeId === null) {
      setSelectedNodeId(node.id);
      setFeedback("시작점 선택됨. 연결할 다른 점을 클릭하세요.");
    } else {
      if (selectedNodeId === node.id) {
        setSelectedNodeId(null);
        setFeedback("선택 취소.");
      } else {
        // Create Edge
        const edgeId = `${selectedNodeId}-${node.id}`;
        const reverseId = `${node.id}-${selectedNodeId}`;
        if (!userEdges.find(ed => ed.id === edgeId || ed.id === reverseId)) {
          setUserEdges(prev => [...prev, {
            id: edgeId,
            source: selectedNodeId,
            target: node.id,
            weight: 1
          }]);
          setStats(prev => ({ ...prev, edgesCreated: prev.edgesCreated + 1 }));
          setFeedback("경로 연결 성공!");
        }
        setSelectedNodeId(null);
      }
    }
  };

  const resetSimulation = () => {
    setUserNodes([]);
    setUserEdges([]);
    setSelectedNodeId(null);
    setAbstractionLevel(0);
    setStats({ nodesFound: 0, noiseClicked: 0, edgesCreated: 0, completed: false });
    setFeedback("지도를 초기화했습니다. 다시 시작해보세요.");
  };

  const checkCompletion = () => {
    const allNodesFound = TRUE_NODES.every(tn => userNodes.find(un => un.id === tn.id));
    // Simple check: minimal edges to connect (n-1 for simple path)
    const enoughEdges = userEdges.length >= TRUE_NODES.length - 1; 
    
    if (allNodesFound && enoughEdges) {
        setStats(prev => ({...prev, completed: true}));
        setFeedback("완벽합니다! 이것이 바로 '모델링'입니다.");
        setAbstractionLevel(100); // Auto maximize abstraction on win
    } else {
        setFeedback(`아직 부족합니다. 찾은 지점: ${userNodes.length}/${TRUE_NODES.length}`);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
           <CheckCircle className="w-6 h-6" /> 미션: 등굣길 모델링
        </h2>
        <p className="text-sm text-gray-700 mt-1">
          복잡한 현실 지도에서 <strong>필요 없는 정보(나무, 간판)</strong>를 없애고, 
          <strong>중요한 지점(점)</strong>과 <strong>길(선)</strong>만 남겨보세요.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-4 w-full md:w-1/2">
            <span className="text-sm font-semibold whitespace-nowrap">현실</span>
            <input 
                type="range" 
                min="0" 
                max="100" 
                value={abstractionLevel} 
                onChange={(e) => setAbstractionLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-semibold whitespace-nowrap">모델(추상화)</span>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={checkCompletion}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-bold transition-colors"
            >
                검증하기
            </button>
            <button 
                onClick={resetSimulation}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                title="Reset"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Feedback Banner */}
      <div className={`p-3 rounded text-center font-medium transition-colors ${
        stats.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {feedback}
      </div>

      {/* Map Canvas */}
      <div className="relative border-2 border-gray-300 rounded-xl overflow-hidden shadow-inner bg-gray-50 mx-auto" style={{ maxWidth: MAP_WIDTH }}>
        <svg 
            ref={svgRef}
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} 
            onClick={handleMapClick}
            className="cursor-crosshair select-none bg-blue-50"
        >
            {/* 1. Background (Reality) Layer - Fades out with abstraction */}
            <g style={{ opacity: Math.max(0, 1 - abstractionLevel / 80) }}>
                {/* River */}
                <path d="M250,0 Q300,200 250,400" stroke="#93C5FD" strokeWidth="60" fill="none" />
                
                {/* Decorative Roads */}
                <path d="M0,350 L600,350" stroke="#E5E7EB" strokeWidth="30" />
                <path d="M450,0 L450,400" stroke="#E5E7EB" strokeWidth="25" />
                <path d="M150,200 L450,200" stroke="#E5E7EB" strokeWidth="20" />

                {/* Noise Objects */}
                {NOISE_OBJECTS.map(obj => (
                     <g key={obj.id} transform={`translate(${obj.x}, ${obj.y})`}>
                        {obj.type === 'tree' ? (
                            <circle r="15" fill="#4ADE80" opacity="0.6" />
                        ) : (
                            <rect x="-15" y="-15" width="30" height="30" fill="#9CA3AF" opacity="0.6" />
                        )}
                        <text y="25" textAnchor="middle" fontSize="10" fill="#6B7280">{obj.label}</text>
                     </g>
                ))}
            </g>

            {/* 2. True Nodes (Always visible for clicking) - Show as clickable hints when not yet added */}
            <g>
                {TRUE_NODES.map(node => {
                    const isAdded = userNodes.find(n => n.id === node.id);
                    if (isAdded) return null; // Already added, will be shown in User Graph Layer
                    
                    return (
                        <g 
                            key={`hint-${node.id}`}
                            transform={`translate(${node.x}, ${node.y})`}
                            style={{ pointerEvents: 'none', opacity: 0.3 }}
                        >
                            <circle 
                                r="20" 
                                fill="#94A3B8" 
                                stroke="#64748B"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />
                            <text y="-25" textAnchor="middle" fontSize="10" fill="#64748B" fontWeight="500">
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </g>

            {/* 3. User Graph Layer - Always visible (or emphasized in abstraction) */}
            <g>
                {/* Edges */}
                {userEdges.map(edge => {
                    const source = userNodes.find(n => n.id === edge.source);
                    const target = userNodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;
                    return (
                        <line 
                            key={edge.id}
                            x1={source.x} y1={source.y}
                            x2={target.x} y2={target.y}
                            stroke="#2563EB"
                            strokeWidth="4"
                        />
                    );
                })}

                {/* Nodes */}
                {userNodes.map(node => (
                    <g 
                        key={node.id} 
                        transform={`translate(${node.x}, ${node.y})`}
                        onClick={(e) => handleNodeClick(e, node)}
                        className="cursor-pointer hover:scale-110 transition-transform"
                    >
                        <circle 
                            r="12" 
                            fill={selectedNodeId === node.id ? "#F59E0B" : "#2563EB"} 
                            stroke="white"
                            strokeWidth="2"
                        />
                        <text y="-20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1E40AF" className="bg-white">
                            {node.label}
                        </text>
                    </g>
                ))}
            </g>

             {/* Hint Overlay if empty */}
             {userNodes.length === 0 && (
                <text x="50%" y="50%" textAnchor="middle" fill="#9CA3AF" fontSize="16" style={{pointerEvents: 'none'}}>
                    지도를 클릭하여 주요 지점을 찾으세요
                </text>
             )}
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center mt-4">
        <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.nodesFound}/{TRUE_NODES.length}</div>
            <div className="text-xs text-gray-500">찾은 지점</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
            <div className={`text-2xl font-bold ${stats.noiseClicked > 2 ? 'text-red-500' : 'text-green-600'}`}>
                {stats.noiseClicked}
            </div>
            <div className="text-xs text-gray-500">정보 과부하(실수)</div>
        </div>
        <div className="p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-indigo-600">{userEdges.length}</div>
            <div className="text-xs text-gray-500">연결된 경로</div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;