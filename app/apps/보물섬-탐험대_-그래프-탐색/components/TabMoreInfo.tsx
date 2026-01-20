import React from 'react';
import { Navigation, Network, Share2 } from 'lucide-react';

const TabMoreInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-display">그래프 탐색, 어디에 쓰일까?</h2>
        <p className="text-gray-600">보물섬 뿐만 아니라 우리 일상 곳곳에 그래프 기술이 숨어있어요.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-blue-500 hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Navigation size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">길 찾기 앱</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            네이버지도나 카카오맵은 교차로를 '노드', 도로를 '간선'으로 봅니다.
            BFS를 응용한 <strong>다익스트라 알고리즘</strong>을 사용하여 가장 빠른 길을 계산합니다.
          </p>
        </div>

        {/* Social Network */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-pink-500 hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-600">
            <Share2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">친구 추천</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            SNS에서 "함께 아는 친구"를 추천할 때 사용됩니다.
            나와 연결된 친구(1촌)의 친구(2촌)를 BFS로 탐색하여 가장 가까운 관계를 찾아냅니다.
          </p>
        </div>

        {/* Network Routing */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-green-500 hover:-translate-y-2 transition-transform">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Network size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">인터넷 통신</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            데이터 패킷이 목적지까지 가는 경로를 찾을 때도 그래프 탐색이 사용됩니다.
            전 세계에 연결된 수많은 라우터들을 거쳐 가장 효율적인 길을 찾습니다.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 mt-8">
         <h3 className="text-xl font-bold text-amber-800 mb-2">🤔 생각해볼 문제</h3>
         <p className="text-amber-900 mb-4">
           "복잡한 미로에서 출구를 찾을 때, 만약 출구가 아주 멀리 있다면 BFS와 DFS 중 무엇이 더 유리할까요?"
         </p>
         <details className="cursor-pointer bg-white p-4 rounded-lg shadow-sm group">
            <summary className="font-bold text-gray-700 list-none flex justify-between items-center">
               <span>정답 보기</span>
               <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 text-sm">
               정답은 상황에 따라 다르지만, <strong>최단 거리</strong>를 보장해야 한다면 <strong>BFS</strong>가 유리합니다.
               하지만 메모리 공간이 부족하다면 DFS가 유리할 수도 있습니다. BFS는 방문 예정인 곳들을 기억(Queue)해야 해서 메모리를 많이 쓰거든요!
            </p>
         </details>
      </div>
    </div>
  );
};

export default TabMoreInfo;