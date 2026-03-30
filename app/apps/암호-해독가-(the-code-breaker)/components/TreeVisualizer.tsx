import React from 'react';
import { HuffmanNode } from '../types';

interface Props {
  node: HuffmanNode;
  depth?: number;
  x?: number;
  y?: number;
  layerScale?: number;
}

// Simple recursive component to draw the tree using SVG
export const TreeVisualizer: React.FC<Props> = ({ node }) => {
  // We need to calculate layout positions. 
  // For a perfect binary tree visualization in a quick responsive way, 
  // we can use a recursive functional component that renders SVG groups.
  // However, calculating exact X/Y for dynamic trees is tricky without a layout algo (like Reingold-Tilford).
  // Given constraints, we will build a simplified CSS-based tree or a calculated SVG tree.
  
  // Let's go with a pure CSS flexbox approach for reliability and responsiveness.
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center relative z-10">
         <div className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center
            ${node.char ? 'bg-blue-100 border-blue-500' : 'bg-slate-100 border-slate-400'}
            shadow-sm
         `}>
            <div className="text-center leading-none">
                <div className="text-xs text-slate-600">{node.char ? `'${node.char}'` : ''}</div>
                <div className="font-bold text-slate-800">{node.freq}</div>
            </div>
         </div>
         {/* Connector Lines Logic is hard in pure CSS flex. Let's add simple visual arrows if children exist */}
      </div>

      {(node.left || node.right) && (
        <div className="flex items-start mt-4 gap-4 relative">
            {/* Pseudo-element lines could go here, but let's keep it clean */}
            {node.left && (
                <div className="flex flex-col items-center">
                     <div className="h-4 w-px bg-indigo-500 mb-1 relative">
                        <span className="absolute top-1 -left-3 text-[10px] text-indigo-600 font-bold">0</span>
                     </div>
                     <div className="border-t border-slate-300 w-full"></div> {/* rudimentary branch connector */}
                     <TreeVisualizer node={node.left} />
                </div>
            )}
            {node.right && (
                <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-indigo-500 mb-1 relative">
                         <span className="absolute top-1 -right-3 text-[10px] text-indigo-600 font-bold">1</span>
                    </div>
                     <TreeVisualizer node={node.right} />
                </div>
            )}
        </div>
      )}
    </div>
  );
};
