import React, { useEffect, useRef } from 'react';
import { BlockDef, BlockType } from '../types';

interface Props {
  blocks: BlockDef[];
  activeBlockIndex: number | null;
}

const FlowchartVisualizer: React.FC<Props> = ({ blocks, activeBlockIndex }) => {
  // Simple layout calculation
  const nodeWidth = 140;
  const nodeHeight = 60;
  const gapY = 40;
  const startY = 20;
  const canvasWidth = 300;
  const canvasHeight = Math.max(500, startY + blocks.length * (nodeHeight + gapY) + 50);

  return (
    <div className="w-full h-full overflow-auto bg-white rounded-lg border border-gray-200 shadow-inner p-4 flex justify-center">
      <svg width={canvasWidth} height={canvasHeight} className="min-w-[200px]">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
          </marker>
          <marker
            id="arrowhead-active"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#F97316" />
          </marker>
        </defs>

        {blocks.map((block, index) => {
          const x = canvasWidth / 2;
          const y = startY + index * (nodeHeight + gapY);
          const isActive = index === activeBlockIndex;
          const strokeColor = isActive ? "#F97316" : "#4B5563";
          const fillColor = isActive ? "#FFF7ED" : "#FFFFFF";
          const strokeWidth = isActive ? 3 : 2;

          let shape;
          if (block.type === BlockType.START_END) {
            shape = (
              <rect
                x={x - nodeWidth / 2}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx={30}
                ry={30}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
            );
          } else if (block.type === BlockType.DECISION) {
            shape = (
              <polygon
                points={`${x},${y} ${x + nodeWidth / 2},${y + nodeHeight / 2} ${x},${y + nodeHeight} ${x - nodeWidth / 2},${y + nodeHeight / 2}`}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
            );
          } else {
            shape = (
              <rect
                x={x - nodeWidth / 2}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
              />
            );
          }

          // Draw Arrow to next block
          let arrow = null;
          if (index < blocks.length - 1) {
             const nextY = startY + (index + 1) * (nodeHeight + gapY);
             arrow = (
               <line
                 x1={x}
                 y1={y + nodeHeight}
                 x2={x}
                 y2={nextY - 8}
                 stroke={isActive && index === activeBlockIndex ? "#F97316" : "#9CA3AF"}
                 strokeWidth="2"
                 markerEnd={`url(#${isActive && index === activeBlockIndex ? 'arrowhead-active' : 'arrowhead'})`}
               />
             );
          }
          
          // Special looping arrow for Decision (Visual only for this demo)
          let loopArrow = null;
          if (block.type === BlockType.DECISION) {
             loopArrow = (
                <g>
                    <text x={x + nodeWidth/2 + 5} y={y + nodeHeight/2} fontSize="10" fill="gray">No</text>
                    <path 
                        d={`M ${x + nodeWidth/2} ${y + nodeHeight/2} L ${x + nodeWidth/2 + 20} ${y + nodeHeight/2} L ${x + nodeWidth/2 + 20} ${y - gapY/2} L ${x} ${y - gapY/2}`}
                        fill="none"
                        stroke="#9CA3AF"
                        strokeDasharray="4"
                        markerEnd="url(#arrowhead)"
                    />
                     <text x={x} y={y + nodeHeight + 12} fontSize="10" textAnchor="middle" fill="gray">Yes</text>
                </g>
             )
          }


          return (
            <g key={block.id + index} className="transition-all duration-300">
              {shape}
              <text
                x={x}
                y={y + nodeHeight / 2}
                dy=".3em"
                textAnchor="middle"
                className={`text-xs font-medium select-none pointer-events-none ${isActive ? 'fill-orange-600' : 'fill-gray-700'}`}
                style={{fontSize: '13px'}}
              >
                {block.label}
              </text>
              {arrow}
              {loopArrow}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default FlowchartVisualizer;
