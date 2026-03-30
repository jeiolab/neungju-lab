import React from 'react';
import { Minimize2, Map, LayoutGrid } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Minimize2 className="w-6 h-6 mr-2 text-blue-500" />
          추상화(Abstraction)란?
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          복잡한 현실 세계의 문제에서 <span className="bg-yellow-100 px-1 font-bold">불필요한 세부 사항을 제거</span>하고, 
          문제 해결에 필요한 <span className="bg-blue-100 px-1 font-bold">핵심 요소</span>만 남기는 과정을 말합니다.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="bg-gray-100 p-4 rounded text-center">
             <div className="text-4xl mb-2">🌳🏢🚗</div>
             <div className="font-bold text-gray-500">현실 (복잡함)</div>
             <p className="text-xs text-gray-400">나무, 건물 색깔, 도로의 재질 등 모든 정보가 있음</p>
           </div>
           <div className="bg-blue-50 p-4 rounded text-center border-2 border-blue-200">
             <div className="text-4xl mb-2">⚫ ── ⚫</div>
             <div className="font-bold text-blue-600">모델 (단순함)</div>
             <p className="text-xs text-blue-400">오직 '지점(Node)'과 '연결(Edge)'만 남음</p>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Map className="w-6 h-6 mr-2 text-green-500" />
            왜 지도를 단순하게 만들까?
        </h3>
        <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mt-1 mr-3">효율성</span>
                <p>복잡한 그림보다 점과 선으로 된 그래프가 컴퓨터가 계산하기 훨씬 빠릅니다. 내비게이션 앱은 이런 '그래프 모델'을 사용하여 0.1초 만에 길을 찾습니다.</p>
            </li>
            <li className="flex items-start">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded mt-1 mr-3">명확성</span>
                <p>지하철 노선도를 생각해보세요. 실제 지형과 거리는 왜곡되어 있지만, "몇 정거장 더 가야하는지"는 훨씬 더 알기 쉽습니다. 이것이 '위상 수학'의 원리입니다.</p>
            </li>
        </ul>
      </div>

      <div className="bg-purple-50 p-6 rounded-xl shadow-inner">
        <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center">
            <LayoutGrid className="w-5 h-5 mr-2" />
            쾨니히스베르크 다리 건너기 문제
        </h3>
        <p className="text-sm text-purple-800 mb-4">
            수학자 오일러는 복잡한 도시와 다리를 점 4개와 선 7개로 단순화하여, 
            모든 다리를 한 번씩만 건너서 돌아오는 것은 불가능하다는 것을 증명했습니다. 
            이것이 그래프 이론의 시작입니다.
        </p>
        <div className="flex justify-center">
             {/* Simple Euler Graph SVG */}
             <svg width="200" height="120" viewBox="0 0 200 120">
                <circle cx="100" cy="60" r="15" fill="#A855F7" />
                <circle cx="40" cy="60" r="10" fill="#A855F7" />
                <circle cx="160" cy="60" r="10" fill="#A855F7" />
                <circle cx="100" cy="10" r="10" fill="#A855F7" />
                
                <path d="M40,60 Q70,30 100,10" fill="none" stroke="#C084FC" strokeWidth="2" />
                <path d="M160,60 Q130,30 100,10" fill="none" stroke="#C084FC" strokeWidth="2" />
                <path d="M40,60 L100,60" fill="none" stroke="#C084FC" strokeWidth="2" />
                <path d="M100,60 L160,60" fill="none" stroke="#C084FC" strokeWidth="2" />
                <path d="M40,60 Q70,90 100,60" fill="none" stroke="#C084FC" strokeWidth="2" />
             </svg>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;