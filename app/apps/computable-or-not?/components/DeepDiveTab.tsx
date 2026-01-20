import React from 'react';
import { Filter, Layers, Zap } from 'lucide-react';

export const DeepDiveTab: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">더 깊이 알아보기</h2>
        <p className="text-slate-600 text-sm">컴퓨팅 사고의 핵심인 '추상화'와 실제 적용 사례를 살펴봅니다.</p>
      </div>

      {/* Abstraction Section */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="text-purple-600" />
          <h3 className="text-lg font-bold">추상화 (Abstraction)</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-sm leading-relaxed text-slate-700">
            <strong>"중요한 정보만 남기고 불필요한 세부 사항을 제거하는 것"</strong>
          </p>
          <div className="bg-slate-50 p-3 rounded text-xs text-slate-500">
            <p className="font-bold mb-1">지하철 노선도 예시</p>
            <ul className="list-disc list-inside space-y-1">
              <li>실제: 역 사이 거리, 터널의 곡률, 역의 깊이... (복잡함)</li>
              <li>추상화: 역(점)과 연결선(선)만 남김 (단순함)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Decomposition Section */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="text-blue-600" />
          <h3 className="text-lg font-bold">문제 분해 (Decomposition)</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <p className="text-sm leading-relaxed text-slate-700">
             큰 문제를 관리 가능한 작은 문제들로 나누는 과정입니다.
          </p>
          <div className="border-l-4 border-blue-400 pl-3">
             <h4 className="font-bold text-sm text-slate-800">라면 끓이기 알고리즘</h4>
             <ol className="text-xs text-slate-600 mt-1 list-decimal list-inside">
                 <li>물 끓이기</li>
                 <li>면과 스프 넣기</li>
                 <li>시간 측정하며 끓이기</li>
                 <li>그릇에 담기</li>
             </ol>
          </div>
        </div>
      </section>

      {/* Real World Case */}
      <section>
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="text-yellow-500" />
          <h3 className="text-lg font-bold">생활 속 적용 사례</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-md">
                <h4 className="font-bold mb-1">유튜브 추천 알고리즘</h4>
                <p className="text-xs opacity-90">
                    "재미있는 영상 보여줘" (모호함) <br/> 
                    → "최근 시청 시간, 좋아요 기록, 유사 사용자의 시청 패턴을 입력으로 받아 다음에 볼 확률이 높은 영상 출력" (컴퓨팅 가능)
                </p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl text-white shadow-md">
                <h4 className="font-bold mb-1">배달 앱 배차 시스템</h4>
                <p className="text-xs opacity-90">
                    "빨리 배달해줘" <br/>
                    → "라이더 위치(초기상태), 음식점 및 고객 위치(목표), 교통 체증(제약)을 고려하여 최단 시간 경로 계산"
                </p>
            </div>
        </div>
      </section>
    </div>
  );
};
