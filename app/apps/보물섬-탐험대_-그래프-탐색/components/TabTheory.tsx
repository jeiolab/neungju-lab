import React, { useState } from 'react';
import { fetchMazeInsight } from '../services/geminiService';
import { Lightbulb, Share2, Search, ArrowRight } from 'lucide-react';

const TabTheory: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getInsight = async (topic: string) => {
    setLoading(true);
    const text = await fetchMazeInsight(topic);
    setAiInsight(text);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-ocean">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Share2 className="text-ocean" /> 그래프(Graph)란?
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          그래프는 점(노드, Node)과 그 점들을 잇는 선(간선, Edge)으로 이루어진 자료구조입니다.
          보물지도의 <strong>장소</strong>가 노드이고, 장소 사이의 <strong>길</strong>이 간선입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-t-8 border-sand relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <div className="w-16 h-16 rounded-full bg-sand"></div>
           </div>
           <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
             <Search className="text-orange-500" /> BFS (너비 우선 탐색)
           </h3>
           <p className="text-gray-600 mb-4">
             <strong>"문어발 식 탐색"</strong><br/>
             시작점에서 가까운 곳부터 모두 방문하고, 그 다음 단계로 넘어갑니다.
             동심원이 퍼져나가는 것과 비슷합니다.
           </p>
           <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 bg-orange-50 p-3 rounded-lg">
             <li>사용 도구: 큐 (Queue)</li>
             <li>특징: 최단 경로 찾기에 유리함</li>
           </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-t-8 border-wood relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <div className="w-16 h-16 rounded-full bg-wood"></div>
           </div>
           <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
             <ArrowRight className="text-purple-500" /> DFS (깊이 우선 탐색)
           </h3>
           <p className="text-gray-600 mb-4">
             <strong>"한 우물만 판다"</strong><br/>
             한 방향으로 갈 수 있을 때까지 깊게 들어갔다가, 막히면 돌아옵니다(백트래킹).
           </p>
           <ul className="list-disc list-inside text-sm text-gray-500 space-y-1 bg-purple-50 p-3 rounded-lg">
             <li>사용 도구: 스택 (Stack) 또는 재귀</li>
             <li>특징: 미로 전체 구조 파악에 유리함</li>
           </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Lightbulb className="text-yellow-300" /> AI 선생님에게 물어봐!
        </h3>
        <p className="mb-4 text-indigo-100">
          이해가 잘 안 되나요? 아래 버튼을 눌러보세요.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => getInsight("BFS vs DFS 차이")}
            disabled={loading}
            className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            두 방식의 차이점 알려줘
          </button>
          <button
            onClick={() => getInsight("최단 경로와 BFS")}
            disabled={loading}
            className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            왜 BFS가 최단 거리야?
          </button>
        </div>
        {loading && <p className="mt-4 animate-pulse">AI가 열심히 설명 작성 중...</p>}
        {aiInsight && (
          <div className="mt-4 bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30">
            <p className="leading-relaxed whitespace-pre-line">{aiInsight}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabTheory;