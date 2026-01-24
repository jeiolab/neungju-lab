import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NetworkNode, Packet, NetworkEdge } from '../types';
import { Play, RotateCcw, Truck, AlertTriangle, CheckCircle } from 'lucide-react';

// --- Graph Setup ---
const INITIAL_NODES: NetworkNode[] = [
  { id: 'seoul', label: 'Seoul (Start)', x: 100, y: 300, isObstacle: false },
  { id: 'tokyo', label: 'Tokyo', x: 250, y: 150, isObstacle: false },
  { id: 'shanghai', label: 'Shanghai', x: 250, y: 450, isObstacle: false },
  { id: 'hawaii', label: 'Hawaii (Hub)', x: 500, y: 300, isObstacle: false },
  { id: 'la', label: 'Los Angeles', x: 750, y: 150, isObstacle: false },
  { id: 'ny', label: 'New York', x: 750, y: 450, isObstacle: false },
  { id: 'harvard', label: 'Harvard (End)', x: 900, y: 300, isObstacle: false },
];

const EDGES: NetworkEdge[] = [
  { source: 'seoul', target: 'tokyo', weight: 1 },
  { source: 'seoul', target: 'shanghai', weight: 1 },
  { source: 'tokyo', target: 'hawaii', weight: 2 },
  { source: 'shanghai', target: 'hawaii', weight: 2 },
  { source: 'hawaii', target: 'la', weight: 2 },
  { source: 'hawaii', target: 'ny', weight: 2 },
  { source: 'la', target: 'harvard', weight: 1 },
  { source: 'ny', target: 'harvard', weight: 1 },
  // Cross connections for alternate routes
  { source: 'tokyo', target: 'la', weight: 4 }, // Long route
  { source: 'shanghai', target: 'ny', weight: 4 }, // Long route
];

const SimulationTab: React.FC = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [message, setMessage] = useState<string>('HELLO TCP/IP');
  const [packetSize, setPacketSize] = useState<number>(3);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per hop
  const [reassembledData, setReassembledData] = useState<Packet[]>([]);
  const [successBadge, setSuccessBadge] = useState(false);

  // --- Pathfinding Algorithm (Dijkstra) ---
  const findPath = (startId: string, endId: string, currentNodes: NetworkNode[]): string[] => {
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    currentNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    distances[startId] = 0;

    while (unvisited.size > 0) {
      let closestNode: string | null = null;
      let minDist = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDist) {
          minDist = distances[nodeId];
          closestNode = nodeId;
        }
      });

      if (closestNode === null || closestNode === endId) break;
      if (distances[closestNode] === Infinity) break; // Trapped

      unvisited.delete(closestNode);
      const currentNodeId = closestNode; // Capture for closure

      // Find neighbors
      const neighbors = EDGES.filter(e => e.source === currentNodeId || e.target === currentNodeId);
      
      neighbors.forEach(edge => {
        const neighborId = edge.source === currentNodeId ? edge.target : edge.source;
        if (!unvisited.has(neighborId)) return;

        const neighborNode = currentNodes.find(n => n.id === neighborId);
        // If obstacle, treat weight as Infinity (effectively unreachable)
        const weight = neighborNode?.isObstacle ? Infinity : edge.weight;

        const alt = distances[currentNodeId] + weight;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = currentNodeId;
        }
      });
    }

    // Reconstruct path
    const path: string[] = [];
    let u: string | null = endId;
    if (previous[u] || u === startId) {
      while (u) {
        path.unshift(u);
        u = previous[u];
      }
    }
    return path.length > 0 && path[0] === startId ? path : []; // Return empty if no path
  };

  // --- Handlers ---
  const toggleObstacle = (id: string) => {
    if (isSimulating) return;
    if (id === 'seoul' || id === 'harvard') return; // Can't block start/end
    setNodes(prev => prev.map(n => n.id === id ? { ...n, isObstacle: !n.isObstacle } : n));
  };

  const startSimulation = () => {
    if (!message) return;
    setSuccessBadge(false);
    setReassembledData([]);
    
    // Split message into packets
    const chunks: string[] = [];
    for (let i = 0; i < message.length; i += packetSize) {
      chunks.push(message.slice(i, i + packetSize));
    }

    const newPackets: Packet[] = chunks.map((data, idx) => {
        // Calculate path immediately before sending
        // In a real scenario, routing is dynamic, but for this simpler viz, we calculate once per sim start
        // To make it interesting, we could vary paths per packet, but let's stick to one optimal path for now
        // UNLESS we want to simulate load balancing. 
        // Let's create a slight variation: some packets might take a slightly longer path if we had random weights.
        // For now, consistent optimal path.
        const path = findPath('seoul', 'harvard', nodes);
        return {
            id: idx,
            data,
            sequence: idx,
            status: 'PENDING',
            currentNodeId: 'seoul',
            pathIndex: 0,
            path: path,
            delay: Math.random() * 500 // Random startup delay
        };
    });

    if (newPackets.some(p => p.path.length === 0)) {
        alert("목적지까지 갈 수 있는 경로가 없습니다! 장애물을 제거해주세요.");
        return;
    }

    setPackets(newPackets);
    setIsSimulating(true);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setPackets([]);
    setReassembledData([]);
    setSuccessBadge(false);
  };

  // --- Simulation Loop ---
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
        setPackets(prevPackets => {
            let allArrived = true;
            
            const updatedPackets = prevPackets.map(p => {
                if (p.status === 'ARRIVED' || p.status === 'LOST') return p;
                
                allArrived = false;

                // Move packet logic
                if (p.pathIndex < p.path.length - 1) {
                    return {
                        ...p,
                        pathIndex: p.pathIndex + 1,
                        currentNodeId: p.path[p.pathIndex + 1],
                        status: 'IN_TRANSIT' as const
                    };
                } else {
                    // Arrived at destination
                    return {
                        ...p,
                        status: 'ARRIVED' as const,
                        currentNodeId: 'harvard'
                    };
                }
            });

            // Update reassembled buffer when packets arrive
            const arrivedPackets = updatedPackets.filter(p => p.status === 'ARRIVED');
            setReassembledData(arrivedPackets); // Logic handled in render for sorting

            if (allArrived) {
                setIsSimulating(false);
                setSuccessBadge(true);
            }

            return updatedPackets;
        });
    }, speed);

    return () => clearInterval(interval);
  }, [isSimulating, speed, nodes]); // Dependencies

  // --- SVG Calculation Helpers ---
  const getNodePos = (id: string) => nodes.find(n => n.id === id) || { x: 0, y: 0 };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-500 mb-1">전송할 메시지</label>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSimulating}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="보낼 내용을 입력하세요"
          />
        </div>
        <div className="w-32">
            <label className="block text-xs font-semibold text-slate-500 mb-1">패킷 크기: {packetSize}</label>
            <input 
                type="range" 
                min="1" 
                max="10" 
                value={packetSize} 
                onChange={(e) => setPacketSize(Number(e.target.value))}
                disabled={isSimulating}
                className="w-full"
            />
        </div>
        <div className="w-32">
            <label className="block text-xs font-semibold text-slate-500 mb-1">속도 조절</label>
            <input 
                type="range" 
                min="200" 
                max="2000" 
                step="200"
                value={2200 - speed} 
                onChange={(e) => setSpeed(2200 - Number(e.target.value))}
                className="w-full accent-green-500"
            />
        </div>
        <div className="flex gap-2">
            <button 
                onClick={startSimulation} 
                disabled={isSimulating}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold text-white transition-colors ${isSimulating ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                <Play size={16} /> 전송 시작
            </button>
            <button 
                onClick={resetSimulation} 
                className="flex items-center gap-2 px-4 py-2 rounded-md font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
                <RotateCcw size={16} /> 리셋
            </button>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="relative bg-slate-800 rounded-xl overflow-hidden h-[600px] shadow-inner border border-slate-700">
        <svg className="w-full h-full pointer-events-none absolute top-0 left-0 z-0">
             {/* Draw Edges */}
             {EDGES.map((edge, idx) => {
                 const start = getNodePos(edge.source);
                 const end = getNodePos(edge.target);
                 return (
                     <line 
                        key={idx}
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke="#475569" 
                        strokeWidth="3"
                        strokeDasharray="5,5"
                     />
                 );
             })}
        </svg>

        {/* Draw Nodes */}
        {nodes.map(node => (
            <div 
                key={node.id}
                onClick={() => toggleObstacle(node.id)}
                className={`absolute w-24 h-24 -ml-12 -mt-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-10
                    ${node.isObstacle ? 'opacity-50 grayscale' : 'opacity-100'}
                `}
                style={{ left: node.x, top: node.y }}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-colors
                    ${node.id === 'seoul' ? 'bg-blue-500 border-blue-300' : 
                      node.id === 'harvard' ? 'bg-green-500 border-green-300' : 
                      node.isObstacle ? 'bg-red-500 border-red-300' : 'bg-slate-600 border-slate-400'
                    }
                `}>
                    {node.isObstacle ? <AlertTriangle className="text-white" /> : <div className="text-white font-bold text-xs">{node.id.substring(0,2).toUpperCase()}</div>}
                </div>
                <span className="mt-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    {node.label}
                    {node.isObstacle && " (혼잡)"}
                </span>
            </div>
        ))}

        {/* Draw Packets */}
        {packets.map(packet => {
            const pos = getNodePos(packet.currentNodeId);
            return (
                <div 
                    key={packet.id}
                    className="absolute z-20 transition-all ease-linear"
                    style={{ 
                        left: pos.x, 
                        top: pos.y, 
                        transitionDuration: `${speed}ms`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <div className="bg-yellow-400 text-yellow-900 w-10 h-10 rounded shadow-lg border-2 border-yellow-200 flex items-center justify-center font-bold text-xs">
                        {packet.sequence + 1}
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white whitespace-nowrap bg-black/50 px-1 rounded">
                        {packet.data}
                    </div>
                </div>
            );
        })}
        
        {/* Success Overlay */}
        {successBadge && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">배달 완료!</h2>
                    <p className="text-slate-600 mt-2">모든 데이터 패킷이 성공적으로 하버드에 도착했습니다.</p>
                </div>
            </div>
        )}
      </div>

      {/* Reassembly Buffer */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
            <Truck size={16}/> 도착지 재조립 버퍼 (Packet Reassembly)
        </h3>
        <div className="flex gap-2 min-h-[60px] p-2 bg-slate-100 rounded-lg overflow-x-auto">
            {reassembledData
                .sort((a, b) => a.sequence - b.sequence)
                .map(packet => (
                <div key={packet.id} className="bg-green-100 border border-green-300 px-3 py-2 rounded shadow-sm text-center min-w-[50px] animate-bounce-in">
                    <div className="text-xs text-green-600 font-bold mb-1">#{packet.sequence + 1}</div>
                    <div className="text-slate-800 font-bold">{packet.data}</div>
                </div>
            ))}
            {reassembledData.length === 0 && (
                <div className="w-full flex items-center justify-center text-slate-400 text-sm">
                    아직 도착한 패킷이 없습니다...
                </div>
            )}
        </div>
        {reassembledData.length > 0 && (
            <div className="mt-2 text-right text-sm font-bold text-green-700">
                복원된 메시지: {reassembledData.sort((a,b) => a.sequence - b.sequence).map(p => p.data).join('')}
            </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;
