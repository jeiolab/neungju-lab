import React, { useState, useEffect } from 'react';
import { SCENARIOS } from '../constants';
import { TaskNode, SimulationState } from '../types';
import { AlertCircle, CheckCircle, Trophy, RefreshCcw } from 'lucide-react';

interface TabSimulationProps {
  onComplete: () => void;
  updateXP: (amount: number) => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ onComplete, updateXP }) => {
  const [activeScenario, setActiveScenario] = useState<string>('video');
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'error' | 'success' | null }>({ msg: '', type: null });

  // Initialize Scenario
  useEffect(() => {
    initScenario(activeScenario);
  }, [activeScenario]);

  const initScenario = (key: string) => {
    const data = SCENARIOS[key];
    const initialPool = [...data.nodes].sort(() => Math.random() - 0.5); // Shuffle
    
    setSimState({
      rootNode: data.root,
      pool: initialPool,
      placedNodes: {}, // Start empty
      score: 0,
      completed: false
    });
    setFeedback({ msg: '', type: null });
  };

  const handleDragStart = (e: React.DragEvent, node: TaskNode) => {
    e.dataTransfer.setData('nodeId', node.id);
    e.dataTransfer.setData('source', 'pool');
  };

  const handleDrop = (e: React.DragEvent, targetParentId: string) => {
    e.preventDefault();
    if (!simState) return;

    const nodeId = e.dataTransfer.getData('nodeId');
    const source = e.dataTransfer.getData('source');
    
    // Find the node
    let draggedNode: TaskNode | undefined;
    if (source === 'pool') {
      draggedNode = simState.pool.find(n => n.id === nodeId);
    }

    if (!draggedNode) return;

    // Validation Logic
    if (draggedNode.parentId === targetParentId) {
      // Success: Correct Logic
      const newPool = simState.pool.filter(n => n.id !== nodeId);
      const currentChildren = simState.placedNodes[targetParentId] || [];
      const newPlaced = { ...simState.placedNodes, [targetParentId]: [...currentChildren, draggedNode] };
      
      const isComplete = newPool.length === 0;

      setSimState({
        ...simState,
        pool: newPool,
        placedNodes: newPlaced,
        score: simState.score + 10,
        completed: isComplete
      });

      setFeedback({ msg: '잘했습니다! 논리적으로 올바른 위치입니다.', type: 'success' });
      updateXP(10);
      
      if (isComplete) {
        onComplete();
      }

      // Clear feedback after 2s
      setTimeout(() => setFeedback({ msg: '', type: null }), 2000);

    } else {
      // Error: Logic Mismatch
      setFeedback({ msg: '비효율적인 계획입니다! 이 작업은 다른 카테고리에 속해야 합니다.', type: 'error' });
      // Clear feedback
      setTimeout(() => setFeedback({ msg: '', type: null }), 3000);
    }
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!simState) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2">
          {Object.keys(SCENARIOS).map(key => (
            <button
              key={key}
              onClick={() => setActiveScenario(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeScenario === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {SCENARIOS[key].root.text}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => initScenario(activeScenario)} className="p-2 text-gray-500 hover:text-indigo-600" title="Reset">
                <RefreshCcw size={20} />
            </button>
            <div className="font-bold text-indigo-900 bg-indigo-50 px-4 py-1 rounded-full">Score: {simState.score}</div>
        </div>
      </div>

      {feedback.msg && (
        <div className={`p-3 rounded-lg flex items-center gap-2 animate-bounce ${feedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {feedback.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
          {feedback.msg}
        </div>
      )}

      {simState.completed && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-600" />
            <span className="font-bold text-yellow-800">축하합니다! 완벽한 계획을 세웠습니다.</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
        {/* Workspace (Tree) */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">작업 분해 구조 (WBS)</h3>
          
          <div className="flex flex-col items-center gap-6">
            {/* Level 1: Root */}
            <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-md font-bold w-full max-w-md text-center">
              {simState.rootNode.text}
            </div>

            {/* Level 2 Area */}
            <div className="flex gap-4 w-full justify-center flex-wrap">
              {/* If Level 2 nodes are not yet placed, we need drop zones or logic. 
                  But in this simpler version, let's assume Level 2 nodes are placed by dragging to Root 
                  OR we pre-render empty slots? 
                  
                  Let's make it intuitive: The tree grows.
                  We need to find nodes that belong to root (Level 2) first.
              */}
               
               {/* 
                 Actually, to simplify the "Visual Tree" without a complex layout engine:
                 We will render specific Drop Zones for Level 2 if they exist in placedNodes,
                 otherwise render a generic "Level 2 Zone" connected to Root?
                 
                 Better approach for this specific game logic:
                 We only show the Root. Dropping a 'Category' type on Root attaches it.
                 Once a Category is attached, it becomes a drop zone for 'Tasks'.
               */}

               {/* Render Placed Level 2 Nodes (Categories) */}
               {simState.placedNodes[simState.rootNode.id]?.map(catNode => (
                 <div key={catNode.id} 
                      className="flex flex-col items-center gap-2 min-w-[150px]"
                      onDragOver={allowDrop}
                      onDrop={(e) => handleDrop(e, catNode.id)}
                 >
                    <div className="p-3 bg-blue-500 text-white rounded-lg shadow-md text-center w-full text-sm font-semibold">
                        {catNode.text}
                    </div>
                    {/* Vertical Line */}
                    <div className="h-4 w-0.5 bg-gray-300"></div>
                    
                    {/* Drop Zone for Tasks (Level 3) */}
                    <div className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[100px] p-2 flex flex-col gap-2 transition-colors hover:bg-gray-100 hover:border-blue-300">
                        {simState.placedNodes[catNode.id]?.map(taskNode => (
                            <div key={taskNode.id} className="p-2 bg-white border border-gray-200 rounded text-xs text-gray-700 shadow-sm">
                                {taskNode.text}
                            </div>
                        ))}
                        {(!simState.placedNodes[catNode.id] || simState.placedNodes[catNode.id].length === 0) && (
                            <div className="text-xs text-gray-400 text-center py-4">하위 태스크를<br/>여기로 드래그</div>
                        )}
                    </div>
                 </div>
               ))}

               {/* Hint for Level 2 Drop */}
               <div 
                 className={`p-4 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-sm min-w-[150px] min-h-[80px] bg-gray-50 transition-colors ${simState.pool.some(n => n.type === 'category') ? 'hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer' : 'opacity-50'}`}
                 onDragOver={allowDrop}
                 onDrop={(e) => handleDrop(e, simState.rootNode.id)}
               >
                 중간 단계(카테고리)를<br/>여기에 놓으세요
               </div>
            </div>
          </div>
        </div>

        {/* Task Pool */}
        <div className="w-full md:w-64 bg-gray-100 p-4 rounded-xl shadow-inner overflow-y-auto max-h-[600px]">
          <h3 className="font-bold text-gray-700 mb-4 flex justify-between">
            <span>미분류 카드</span>
            <span className="bg-gray-200 px-2 rounded text-sm">{simState.pool.length}</span>
          </h3>
          <div className="flex flex-col gap-3">
            {simState.pool.map(node => (
              <div
                key={node.id}
                draggable
                onDragStart={(e) => handleDragStart(e, node)}
                className={`p-3 rounded-lg shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                    node.type === 'category' ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">
                    {node.type === 'category' ? '중간 단계' : '실행 과제'}
                </div>
                {node.text}
              </div>
            ))}
            {simState.pool.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    모든 카드가 분류되었습니다!
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;