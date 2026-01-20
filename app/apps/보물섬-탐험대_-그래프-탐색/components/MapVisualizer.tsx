import React from 'react';
import { GraphData, Node } from '../types';
import { motion } from 'framer-motion';

interface MapVisualizerProps {
  graph: GraphData;
  activeNodeId?: string | null;
  visitedNodeIds?: string[];
  pathEdgeIds?: Set<string>; // Set of "source-target" strings
  userPath?: string[]; // For puzzle mode
  onNodeClick?: (nodeId: string) => void;
  width?: number;
  height?: number;
}

const MapVisualizer: React.FC<MapVisualizerProps> = ({
  graph,
  activeNodeId,
  visitedNodeIds = [],
  pathEdgeIds = new Set(),
  userPath = [],
  onNodeClick,
  width = 800,
  height = 600
}) => {

  const getEdgeId = (s: string, t: string) => [s, t].sort().join('-');

  const isEdgeHighlighted = (s: string, t: string) => {
    // Check algorithmic path
    if (pathEdgeIds.has(getEdgeId(s, t))) return true;

    // Check user path (Puzzle mode)
    if (userPath.length > 1) {
      for (let i = 0; i < userPath.length - 1; i++) {
        if ((userPath[i] === s && userPath[i + 1] === t) || (userPath[i] === t && userPath[i + 1] === s)) {
          return true;
        }
      }
    }
    return false;
  };

  const isNodeVisited = (id: string) => visitedNodeIds.includes(id) || userPath.includes(id);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-blue-50 border-4 border-ocean shadow-inner select-none">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 opacity-20 text-ocean">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2 12h20M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10M2 12c0-5.5 4.5-10 10-10S22 6.5 22 12" />
        </svg>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[60vh] md:max-h-[500px]">
        {/* Edges */}
        {graph.edges.map((edge, idx) => {
          const start = graph.nodes.find(n => n.id === edge.source)!;
          const end = graph.nodes.find(n => n.id === edge.target)!;
          const isHighlighted = isEdgeHighlighted(edge.source, edge.target);

          return (
            <motion.line
              key={`edge-${idx}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isHighlighted ? "#f1c40f" : "#94a3b8"} // Yellow for path, gray for default
              strokeWidth={isHighlighted ? 6 : 3}
              strokeDasharray={isHighlighted ? "0" : "8 4"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, stroke: isHighlighted ? "#f1c40f" : "#94a3b8" }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => {
          const isVisited = isNodeVisited(node.id);
          const isActive = activeNodeId === node.id;
          const isTreasure = node.isTreasure;
          
          let visitOrderIndex = -1;
          if (visitedNodeIds.includes(node.id)) {
            visitOrderIndex = visitedNodeIds.indexOf(node.id) + 1;
          }

          return (
            <g
              key={node.id}
              onClick={() => onNodeClick && onNodeClick(node.id)}
              className={onNodeClick ? "cursor-pointer" : ""}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isActive ? 35 : 28}
                fill={isTreasure ? "#fbbf24" : (isActive ? "#ec4899" : (isVisited ? "#4ade80" : "#fef3c7"))}
                stroke={isTreasure ? "#b45309" : (isActive ? "#be185d" : (isVisited ? "#166534" : "#d97706"))}
                strokeWidth={4}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              
              {/* Node Label (ID or Name) */}
              <text
                x={node.x}
                y={node.y}
                dy={6}
                textAnchor="middle"
                className="text-sm font-bold fill-gray-800 pointer-events-none"
                style={{ fontSize: '14px' }}
              >
                 {isTreasure ? '👑' : node.id}
              </text>

              {/* Visit Order Badge */}
              {visitOrderIndex > 0 && !userPath.length && (
                <circle cx={node.x + 20} cy={node.y - 20} r={10} fill="#ef4444" />
              )}
              {visitOrderIndex > 0 && !userPath.length && (
                <text x={node.x + 20} y={node.y - 18} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                  {visitOrderIndex}
                </text>
              )}
              
              {/* Tooltip-ish Label below */}
               <text
                x={node.x}
                y={node.y + 50}
                textAnchor="middle"
                className="fill-gray-600 text-xs font-semibold pointer-events-none"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MapVisualizer;