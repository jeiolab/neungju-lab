import React, { useEffect, useState, useRef } from 'react';
import { GraphData, Node, Link, AlgoType } from '../types';

interface GraphVisualizerProps {
  data: GraphData;
  algo: AlgoType;
  onMissionComplete: (success: boolean) => void;
  isPractice?: boolean;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ data, algo, onMissionComplete, isPractice }) => {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [currentNodeId, setCurrentNodeId] = useState<string>(data.startNodeId);
  const [path, setPath] = useState<string[]>([data.startNodeId]);
  const [message, setMessage] = useState<string>("이웃 노드를 클릭하여 시작하세요!");
  const [historyStack, setHistoryStack] = useState<string[]>([data.startNodeId]); // For DFS backtracking
  
  // Reset when data changes
  useEffect(() => {
    setVisited(new Set([data.startNodeId]));
    setCurrentNodeId(data.startNodeId);
    setPath([data.startNodeId]);
    setHistoryStack([data.startNodeId]);
    setMessage(algo === AlgoType.DFS 
      ? "DFS 미션: 깊게 들어가세요! 연결된 노드를 클릭하세요. 막히면 이전 노드를 클릭해 되돌아가세요(백트래킹)." 
      : "BFS 미션: 넓게 탐색하세요! 현재 레벨의 모든 이웃을 방문하세요.");
  }, [data, algo]);

  const handleNodeClick = (clickedNodeId: string) => {
    if (clickedNodeId === currentNodeId) return;

    // Check if connected
    const isConnected = data.links.some(
      l => (l.source === currentNodeId && l.target === clickedNodeId) ||
           (l.source === clickedNodeId && l.target === currentNodeId)
    );

    if (!isConnected) {
       // Check if it's a backtrack move (only valid for DFS usually, but visually we allow clicking previous in path)
       // Actually, let's strictly enforce connectivity.
       setMessage("연결된 노드로만 이동할 수 있습니다!");
       return;
    }

    if (algo === AlgoType.DFS) {
      handleDFSClick(clickedNodeId);
    } else {
      handleBFSClick(clickedNodeId);
    }
  };

  const handleDFSClick = (targetId: string) => {
    // DFS Logic:
    // 1. Visit unvisited neighbor (Push to stack)
    // 2. Backtrack to previous visited node (Pop from stack)
    
    // Is it a forward move to unvisited?
    if (!visited.has(targetId)) {
      const newVisited = new Set(visited);
      newVisited.add(targetId);
      setVisited(newVisited);
      setCurrentNodeId(targetId);
      setPath([...path, targetId]);
      setHistoryStack([...historyStack, targetId]);
      
      if (targetId === data.targetNodeId) {
        setMessage("목표 도달! 미션 완료!");
        setTimeout(() => onMissionComplete(true), 1000);
      } else {
        setMessage("좋아요! 계속 깊이 들어가세요.");
      }
    } else {
      // Is it a valid backtrack? (Must be the immediate parent in our history stack)
      // historyStack = [A, B, C]. Current is C. Valid backtrack is B.
      const previousNode = historyStack[historyStack.length - 2];
      if (targetId === previousNode) {
        // Backtrack
        const newStack = historyStack.slice(0, -1);
        setHistoryStack(newStack);
        setCurrentNodeId(targetId);
        // We do not remove from visited in DFS, we just move back
        setMessage("되돌아가는 중(백트래킹)...");
      } else {
        setMessage("DFS에서는 새로운 노드를 방문하거나 바로 이전 부모 노드로만 되돌아갈 수 있습니다.");
      }
    }
  };

  // Simplified BFS Interaction for playability
  // Rule: You can jump to any unvisited neighbor of ANY currently 'active frontier' node?
  // To keep it simple: "Teleport" isn't allowed.
  // We will simplify BFS mode: Just simple navigation. 
  // But strict BFS requires visiting ALL neighbors of depth D before D+1.
  // Implementation: We track 'depth'. User must visit all nodes at depth 1 before clicking any node at depth 2.
  // However, calculating depth dynamically on user clicks is tricky if they make mistakes.
  // let's stick to a simpler rule: "Click any unvisited neighbor of the current node." 
  // BUT warn if they go deep before wide? That's too complex for a quick web game UI.
  // 
  // REVISED BFS GAMEPLAY:
  // User clicks nodes to visit them.
  // Valid Click: Any unvisited node connected to *any visited node* (simulating the queue frontier).
  // This captures the essence of "Frontier Expansion".
  const handleBFSClick = (targetId: string) => {
    if (visited.has(targetId)) {
        setMessage("이미 방문했습니다!");
        return;
    }

    // Is this node connected to ANY visited node? (Frontier check)
    // Actually, strictly BFS expands from the *earliest* visited nodes.
    // Let's relax it: "Is it connected to any node we have already visited?"
    // This allows the user to feel the "Expansion" effect.
    const connectedToVisited = data.links.some(l => 
        (l.source === targetId && visited.has(l.target)) ||
        (l.target === targetId && visited.has(l.source))
    );

    if (connectedToVisited) {
         const newVisited = new Set(visited);
         newVisited.add(targetId);
         setVisited(newVisited);
         // Current node visual updates to the one just clicked, effectively jumping focus
         setCurrentNodeId(targetId); 
         setPath([...path, targetId]);

         if (targetId === data.targetNodeId) {
            setMessage("목표 발견! BFS 완료.");
            setTimeout(() => onMissionComplete(true), 1000);
         } else {
            setMessage("탐색 영역 확장 중...");
         }
    } else {
        setMessage("BFS에서는 방문한 영역에서 확장해 나가야 합니다!");
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-700">
      <div className="absolute top-4 left-4 bg-slate-800/80 px-3 py-1 rounded text-sm text-slate-300 pointer-events-none">
        {message}
      </div>
      <svg className="w-full h-full">
        {/* Links */}
        {data.links.map((link, i) => {
            const source = data.nodes.find(n => n.id === link.source)!;
            const target = data.nodes.find(n => n.id === link.target)!;
            const isTraversed = path.includes(source.id) && path.includes(target.id) && 
                                (Math.abs(path.indexOf(source.id) - path.indexOf(target.id)) === 1 || 
                                 visited.has(source.id) && visited.has(target.id)); // simplified visual
            
            return (
                <line 
                    key={i}
                    x1={source.x} y1={source.y}
                    x2={target.x} y2={target.y}
                    stroke={isTraversed ? (algo === AlgoType.DFS ? '#818cf8' : '#34d399') : '#475569'}
                    strokeWidth={isTraversed ? 3 : 1}
                    className="transition-all duration-300"
                />
            );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => {
          const isCurrent = node.id === currentNodeId;
          const isStart = node.id === data.startNodeId;
          const isTarget = node.id === data.targetNodeId;
          const isVisited = visited.has(node.id);

          let fill = "#1e293b"; // slate-800
          let stroke = "#94a3b8"; // slate-400
          
          if (isStart) { stroke = "#3b82f6"; fill = "#1e3a8a"; }
          if (isTarget) { stroke = "#ef4444"; fill = "#7f1d1d"; }
          if (isVisited && !isStart && !isTarget) { fill = algo === AlgoType.DFS ? "#312e81" : "#064e3b"; stroke = algo === AlgoType.DFS ? "#6366f1" : "#10b981"; }
          if (isCurrent) { stroke = "#facc15"; strokeWidth: 4; }

          return (
            <g 
                key={node.id} 
                onClick={() => handleNodeClick(node.id)}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle
                cx={node.x} cy={node.y}
                r={18}
                fill={fill}
                stroke={stroke}
                strokeWidth={isCurrent ? 3 : 2}
              />
              <text
                x={node.x} y={node.y}
                dy=".3em"
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="12"
                fontWeight="bold"
                pointerEvents="none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 flex gap-3 text-xs">
         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-900 border border-blue-500"></div> 시작점</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-900 border border-red-500"></div> 목표점</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-800 border border-yellow-400"></div> 현재 위치</div>
      </div>
    </div>
  );
};

export default GraphVisualizer;