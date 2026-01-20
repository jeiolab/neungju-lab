import React, { useState, useEffect } from 'react';
import { GraphData, FriendNode } from '../types';
import NetworkGraph from './NetworkGraph';
import { Play, RotateCcw, Info } from 'lucide-react';

interface SimulationTabProps {
  graphData: GraphData;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ graphData }) => {
  const [infectedNodes, setInfectedNodes] = useState<Set<string>>(new Set());
  const [startNode, setStartNode] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<string[]>([]); // Log of simulation

  // Reset simulation
  const handleReset = () => {
    setInfectedNodes(new Set());
    setStartNode(null);
    setIsRunning(false);
    setRound(0);
    setHistory([]);
  };

  const handleNodeClick = (node: FriendNode) => {
    if (isRunning) return;
    setStartNode(node.id);
    setInfectedNodes(new Set([node.id]));
    setHistory([`${node.name}님이 소문을 시작했습니다.`]);
    setRound(0);
  };

  const runStep = () => {
    if (!startNode) return;

    setInfectedNodes(prev => {
      const nextInfected = new Set(prev);
      const newlyInfected: string[] = [];
      const currentInfectedArray = Array.from(prev);

      // Find neighbors of currently infected nodes
      currentInfectedArray.forEach(sourceId => {
        graphData.links.forEach(link => {
          const sId = typeof link.source === 'object' ? (link.source as FriendNode).id : link.source as string;
          const tId = typeof link.target === 'object' ? (link.target as FriendNode).id : link.target as string;

          if (sId === sourceId && !prev.has(tId)) {
            nextInfected.add(tId);
            const targetNode = graphData.nodes.find(n => n.id === tId);
            if(targetNode && !newlyInfected.includes(targetNode.name)) newlyInfected.push(targetNode.name);
          } else if (tId === sourceId && !prev.has(sId)) {
            nextInfected.add(sId);
             const sourceNode = graphData.nodes.find(n => n.id === sId);
            if(sourceNode && !newlyInfected.includes(sourceNode.name)) newlyInfected.push(sourceNode.name);
          }
        });
      });

      if (newlyInfected.length > 0) {
        setHistory(h => [...h, `${round + 1}단계: ${newlyInfected.join(', ')}에게 전달됨`]);
        setRound(r => r + 1);
        return nextInfected;
      } else {
        setIsRunning(false); // Stop if no new infections
        if (prev.size < graphData.nodes.length) {
            setHistory(h => [...h, `전파 종료! (도달하지 못한 친구가 있습니다)`]);
        } else {
            setHistory(h => [...h, `전파 완료! 모든 친구가 알게 되었습니다.`]);
        }
        return prev;
      }
    });
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        runStep();
      }, 1500);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, graphData]); // runStep is omitted to avoid heavy deps, logic is self contained

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-500" />
              소문 퍼뜨리기 시뮬레이션
            </h2>
            <p className="text-sm text-slate-500">누구를 클릭해야 소문이 가장 빨리 퍼질까요?</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              disabled={!startNode || (infectedNodes.size === graphData.nodes.length && !isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
              }`}
            >
              <Play className="w-4 h-4" />
              {isRunning ? '일시정지' : '시작하기'}
            </button>
            <button 
              onClick={handleReset}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <NetworkGraph 
          data={graphData} 
          highlightNodes={infectedNodes}
          activeNodeId={startNode}
          onNodeClick={handleNodeClick}
          height={500}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
        <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">전파 기록</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
            {history.length === 0 && (
                <div className="text-center text-slate-400 py-10">
                    친구를 클릭하여<br/>소문을 시작해보세요!
                </div>
            )}
            {history.map((log, i) => (
                <div key={i} className="text-sm p-2 bg-slate-50 rounded border border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                    {log}
                </div>
            ))}
        </div>
        <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">전파 단계</span>
                <span className="font-bold text-slate-800">{round} 단계</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-slate-500">도달률</span>
                <span className="font-bold text-indigo-600">
                    {Math.round((infectedNodes.size / graphData.nodes.length) * 100)}%
                </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(infectedNodes.size / graphData.nodes.length) * 100}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;