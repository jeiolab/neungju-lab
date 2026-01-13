import React, { useState, useEffect, useCallback } from 'react';
import { Dataset, GameItem, TreeNodeData, Attribute } from '../types';
import { RotateCcw, Play, Lock, CheckCircle2, AlertTriangle, ChevronRight, Trophy } from 'lucide-react';

// --- Datasets ---
const animalsDataset: Dataset = {
  id: 'animals',
  name: '동물 왕국 분류하기',
  description: '동물들을 특징에 따라 포유류, 조류, 파충류 등으로 분류해보세요.',
  questions: [
    { key: 'hasWings', label: '날개가 있는가?' },
    { key: 'laysEggs', label: '알을 낳는가?' },
    { key: 'livesInWater', label: '물에 사는가?' },
    { key: 'hasFur', label: '털이 있는가?' },
    { key: 'isCarnivore', label: '육식인가?' },
  ],
  items: [
    { id: '1', name: '독수리', emoji: '🦅', type: '조류', attributes: { hasWings: true, laysEggs: true, livesInWater: false, hasFur: false, isCarnivore: true } },
    { id: '2', name: '펭귄', emoji: '🐧', type: '조류', attributes: { hasWings: true, laysEggs: true, livesInWater: true, hasFur: false, isCarnivore: true } },
    { id: '3', name: '사자', emoji: '🦁', type: '포유류', attributes: { hasWings: false, laysEggs: false, livesInWater: false, hasFur: true, isCarnivore: true } },
    { id: '4', name: '고래', emoji: '🐳', type: '포유류', attributes: { hasWings: false, laysEggs: false, livesInWater: true, hasFur: false, isCarnivore: true } },
    { id: '5', name: '거북이', emoji: '🐢', type: '파충류', attributes: { hasWings: false, laysEggs: true, livesInWater: true, hasFur: false, isCarnivore: false } },
    { id: '6', name: '박쥐', emoji: '🦇', type: '포유류', attributes: { hasWings: true, laysEggs: false, livesInWater: false, hasFur: true, isCarnivore: false } },
  ]
};

const fakeNotesDataset: Dataset = {
  id: 'notes',
  name: '위조 지폐 감별사 (잠금)',
  description: '진짜 지폐와 위조 지폐를 구별하는 보안 알고리즘을 만드세요.',
  questions: [
    { key: 'hasWatermark', label: '워터마크가 있는가?' },
    { key: 'correctSize', label: '규격이 정확한가?' },
    { key: 'hologramChanges', label: '홀로그램이 변하는가?' },
    { key: 'textureRough', label: '질감이 거친가?' },
  ],
  items: [
    { id: 'n1', name: '진짜 천원', emoji: '💵', type: '진짜', attributes: { hasWatermark: true, correctSize: true, hologramChanges: true, textureRough: true } },
    { id: 'n2', name: '진짜 만원', emoji: '💴', type: '진짜', attributes: { hasWatermark: true, correctSize: true, hologramChanges: true, textureRough: true } },
    { id: 'f1', name: '조잡한 위조', emoji: '📄', type: '가짜', attributes: { hasWatermark: false, correctSize: true, hologramChanges: false, textureRough: false } },
    { id: 'f2', name: '정교한 위조', emoji: '🖨️', type: '가짜', attributes: { hasWatermark: true, correctSize: true, hologramChanges: false, textureRough: false } },
    { id: 'f3', name: '불량 지폐', emoji: '📉', type: '가짜', attributes: { hasWatermark: true, correctSize: false, hologramChanges: true, textureRough: true } },
  ]
};

// --- Components ---

const ItemBadge: React.FC<{ item: GameItem }> = ({ item }) => (
  <div className="flex items-center bg-white border border-slate-200 rounded-full px-2 py-1 text-xs shadow-sm" title={`${item.name} (${item.type})`}>
    <span className="mr-1">{item.emoji}</span>
    <span className="truncate max-w-[50px]">{item.name}</span>
  </div>
);

interface NodeProps {
  node: TreeNodeData;
  dataset: Dataset;
  onSplit: (nodeId: string, attributeKey: string) => void;
  depth: number;
}

const TreeNodeView: React.FC<NodeProps> = ({ node, dataset, onSplit, depth }) => {
  const [showSelector, setShowSelector] = useState(false);

  // Calculate purity
  const types = new Set(node.items.map(i => i.type));
  const isPure = types.size <= 1;
  const isLeaf = !node.filterAttribute;
  
  // Available questions (exclude ones already used in this path - simplistic check)
  // In a real generic tree, we'd traverse up. Here we just show all and let logic handle it, 
  // or simple filtering could be added. For this simplified version, allow re-selection but it splits empty.
  
  if (node.items.length === 0) return null;

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      {/* Node Visual */}
      <div 
        className={`
          relative flex flex-col items-center p-3 rounded-xl border-2 min-w-[140px] transition-all
          ${isLeaf ? 'bg-white' : 'bg-slate-50'}
          ${isPure ? 'border-green-400 shadow-green-100' : 'border-slate-300 shadow-sm'}
          shadow-lg
        `}
      >
        {/* Purity Indicator */}
        {isPure && node.items.length > 0 && (
          <div className="absolute -top-3 right-[-10px] bg-green-500 text-white rounded-full p-1 shadow-sm">
            <CheckCircle2 size={14} />
          </div>
        )}

        {/* Content */}
        <div className="mb-2 text-center">
            {node.filterAttribute ? (
                 <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold mb-2">
                    {dataset.questions.find(q => q.key === node.filterAttribute)?.label}
                 </div>
            ) : (
                <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">
                    {isPure ? "분류 완료!" : "질문을 선택하세요"}
                </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-1 max-w-[180px]">
                {node.items.map(item => (
                    <ItemBadge key={item.id} item={item} />
                ))}
            </div>
        </div>

        {/* Split Action */}
        {isLeaf && !isPure && (
            <div className="mt-2 w-full">
                {!showSelector ? (
                    <button 
                        onClick={() => setShowSelector(true)}
                        className="w-full py-1 px-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                    >
                        질문 추가하기 +
                    </button>
                ) : (
                    <div className="flex flex-col gap-1 bg-slate-100 p-2 rounded-lg absolute top-full left-0 right-0 z-10 shadow-xl border border-slate-200 mt-2">
                        {dataset.questions.map(q => (
                            <button
                                key={q.key}
                                onClick={() => {
                                    onSplit(node.id, q.key);
                                    setShowSelector(false);
                                }}
                                className="text-left text-xs p-1.5 hover:bg-blue-100 rounded text-slate-700 font-medium"
                            >
                                {q.label}
                            </button>
                        ))}
                        <button 
                            onClick={() => setShowSelector(false)}
                            className="text-xs text-slate-400 mt-1 hover:text-slate-600"
                        >
                            취소
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Children Branches */}
      {!isLeaf && node.yesChild && node.noChild && (
        <div className="flex flex-col items-center">
            <div className="h-6 w-0.5 bg-slate-300"></div> {/* Vertical connector */}
            <div className="flex items-start gap-8 relative">
                {/* Horizontal Bar Connector */}
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-300 -translate-y-0.5"></div>

                {/* YES Branch */}
                <div className="flex flex-col items-center">
                    <div className="h-4 w-0.5 bg-slate-300 relative">
                         <span className="absolute top-[-8px] -left-8 bg-green-100 text-green-700 text-[10px] px-1.5 rounded border border-green-200">Yes</span>
                    </div>
                    <TreeNodeView node={node.yesChild} dataset={dataset} onSplit={onSplit} depth={depth + 1} />
                </div>

                {/* NO Branch */}
                <div className="flex flex-col items-center">
                     <div className="h-4 w-0.5 bg-slate-300 relative">
                        <span className="absolute top-[-8px] -right-7 bg-red-100 text-red-700 text-[10px] px-1.5 rounded border border-red-200">No</span>
                     </div>
                    <TreeNodeView node={node.noChild} dataset={dataset} onSplit={onSplit} depth={depth + 1} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Main Simulation Component ---

const SimulationTab: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<Dataset>(animalsDataset);
  const [levelUnlocked, setLevelUnlocked] = useState(false);
  const [rootNode, setRootNode] = useState<TreeNodeData | null>(null);
  const [message, setMessage] = useState<string>("");

  // Initialize Game
  const initGame = useCallback((dataset: Dataset) => {
    const root: TreeNodeData = {
      id: 'root',
      items: dataset.items,
      isPure: false,
    };
    setRootNode(root);
    setMessage("시작! 첫 번째 질문을 선택해서 동물들을 분류해보세요.");
  }, []);

  useEffect(() => {
    initGame(activeDataset);
  }, [activeDataset, initGame]);

  // Recursively find and split the node
  const handleSplit = (nodeId: string, attributeKey: string) => {
    const updateTree = (node: TreeNodeData): TreeNodeData => {
      if (node.id === nodeId) {
        // Perform split logic
        const yesItems = node.items.filter(item => item.attributes[attributeKey]);
        const noItems = node.items.filter(item => !item.attributes[attributeKey]);

        // Check if this split actually does anything
        if (yesItems.length === 0 || noItems.length === 0) {
            setMessage("그 질문으로는 아무것도 분류되지 않아요! 다른 질문을 골라보세요.");
            return node;
        }

        const isYesPure = new Set(yesItems.map(i => i.type)).size <= 1;
        const isNoPure = new Set(noItems.map(i => i.type)).size <= 1;

        return {
          ...node,
          filterAttribute: attributeKey,
          yesChild: {
            id: `${nodeId}-yes`,
            items: yesItems,
            parentId: nodeId,
            isPure: isYesPure
          },
          noChild: {
            id: `${nodeId}-no`,
            items: noItems,
            parentId: nodeId,
            isPure: isNoPure
          },
          isPure: false // Parent is now a question node, so strictly it's not a pure leaf
        };
      }

      // Recurse down
      if (node.yesChild && node.noChild) {
        return {
          ...node,
          yesChild: updateTree(node.yesChild),
          noChild: updateTree(node.noChild),
        };
      }

      return node;
    };

    if (rootNode) {
      const newRoot = updateTree(rootNode);
      setRootNode(newRoot);
      setMessage(""); // Clear error messages
      
      // Check Win Condition
      checkWinCondition(newRoot);
    }
  };

  const checkWinCondition = (node: TreeNodeData) => {
    // Collect all leaf nodes
    const leaves: TreeNodeData[] = [];
    const traverse = (n: TreeNodeData) => {
      if (!n.yesChild && !n.noChild) {
        leaves.push(n);
      } else {
        if (n.yesChild) traverse(n.yesChild);
        if (n.noChild) traverse(n.noChild);
      }
    };
    traverse(node);

    const allPure = leaves.every(l => l.isPure);
    if (allPure) {
        setMessage("축하합니다! 모든 데이터를 완벽하게 분류했습니다! 🎉");
        if (activeDataset.id === 'animals' && !levelUnlocked) {
            setLevelUnlocked(true);
            setTimeout(() => alert("레벨 2가 잠금 해제되었습니다!"), 500);
        }
    }
  };

  const switchLevel = (dataset: Dataset) => {
    if (dataset.id === 'notes' && !levelUnlocked) return;
    setActiveDataset(dataset);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header / Level Select */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Play className="text-blue-500 fill-blue-500" size={20} />
                {activeDataset.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{activeDataset.description}</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
            <button 
                onClick={() => switchLevel(animalsDataset)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeDataset.id === 'animals' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                레벨 1: 동물
            </button>
            <button 
                onClick={() => switchLevel(fakeNotesDataset)}
                disabled={!levelUnlocked}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                    activeDataset.id === 'notes' 
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' 
                    : !levelUnlocked 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
                {!levelUnlocked && <Lock size={14} />}
                레벨 2: 위조지폐
            </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 overflow-auto bg-slate-100 rounded-xl p-8 border border-slate-200 min-h-[500px] flex flex-col items-center relative">
         {/* Feedback Message */}
         {message && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-slate-800 font-medium text-sm flex items-center gap-2 z-20">
                 {message.includes("축하") ? <Trophy className="text-yellow-500" size={16}/> : <AlertTriangle className="text-amber-500" size={16} />}
                 {message}
             </div>
         )}
         
         <div className="w-full flex justify-center pb-20">
            {rootNode && (
                <TreeNodeView 
                    node={rootNode} 
                    dataset={activeDataset} 
                    onSplit={handleSplit}
                    depth={0} 
                />
            )}
         </div>
      </div>

      {/* Footer Controls */}
      <div className="mt-4 flex justify-center">
        <button 
            onClick={() => initGame(activeDataset)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-300 shadow-sm rounded-full text-slate-600 hover:bg-slate-50 transition-colors font-medium"
        >
            <RotateCcw size={16} />
            다시 시작하기
        </button>
      </div>
    </div>
  );
};

export default SimulationTab;