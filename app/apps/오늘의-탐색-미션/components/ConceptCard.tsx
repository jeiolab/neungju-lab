import React from 'react';
import { AlgoType } from '../types';

const ConceptCard: React.FC<{ algo: AlgoType }> = ({ algo }) => {
  return (
    <div className={`p-6 rounded-2xl border ${algo === AlgoType.DFS ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-emerald-950/30 border-emerald-500/30'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {algo === AlgoType.DFS ? '🧠 DFS (깊이 우선 탐색)' : '🌊 BFS (너비 우선 탐색)'}
        </h3>
        <span className="text-2xl">{algo === AlgoType.DFS ? '🔦' : '📡'}</span>
      </div>
      
      <p className="text-slate-300 mb-4 leading-relaxed">
        {algo === AlgoType.DFS 
          ? "미로를 풀 때 막다른 길을 만날 때까지 한 방향으로 계속 가다가, 막히면 되돌아오는 방식과 같습니다. 스택(Stack, LIFO)을 사용합니다."
          : "호수에 돌을 던졌을 때 물결이 모든 방향으로 퍼져나가는 것과 같습니다. 가중치가 없는 그래프에서 최단 경로를 찾는 데 유용합니다. 큐(Queue, FIFO)를 사용합니다."
        }
      </p>

      <div className="bg-slate-900/50 p-4 rounded-lg text-sm space-y-2">
        <div className="flex gap-2">
           <span className="font-bold text-slate-400 min-w-[80px]">핵심 모토:</span>
           <span className="text-slate-200">"{algo === AlgoType.DFS ? "깊게 가고, 막히면 되돌아오기" : "가까운 이웃부터 확인하기"}"</span>
        </div>
        <div className="flex gap-2">
           <span className="font-bold text-slate-400 min-w-[80px]">활용 예시:</span>
           <span className="text-slate-200">{algo === AlgoType.DFS ? "미로 찾기, 경로 존재 여부, 사이클 탐지" : "최단 경로, GPS 네비게이션, 네트워크 분석"}</span>
        </div>
      </div>
    </div>
  );
};

export default ConceptCard;