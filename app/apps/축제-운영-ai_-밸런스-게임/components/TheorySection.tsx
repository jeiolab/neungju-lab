import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-800 mb-2">지능 에이전트의 3대 특성</h2>
        <p className="text-gray-600">축제 운영 봇을 만들기 위해 꼭 알아야 할 핵심 개념입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Autonomy Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-blue-500">
          <div className="p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">자율성 (Autonomy)</h3>
            <p className="text-gray-600 text-sm mb-4">
              외부의 직접적인 개입 없이 스스로 판단하고 행동을 제어하는 능력입니다.
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <strong>학교 예시:</strong><br/>
              운영 봇이 바닥에 떨어진 쓰레기를 발견했을 때, 선생님의 지시를 기다리지 않고 스스로 줍는 것.
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t text-xs text-gray-500">
            ❌ 오개념: 자율성은 제멋대로 행동하는 것이 아닙니다. 주어진 범위 내에서의 판단입니다.
          </div>
        </div>

        {/* Cooperation Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-green-500">
          <div className="p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">협력성 (Cooperation)</h3>
            <p className="text-gray-600 text-sm mb-4">
              다른 에이전트나 사람과 통신하며 정보를 교환하고 공동의 목표를 위해 돕는 능력입니다.
            </p>
            <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800">
              <strong>학교 예시:</strong><br/>
              A구역 봇이 "사람이 너무 많아!"라고 신호를 보내면, B구역 봇이 방문객을 다른 곳으로 안내하는 것.
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t text-xs text-gray-500">
            ❌ 오개념: 무조건 남을 따르는 것이 아니라, 정보를 주고받으며 '조율'하는 것입니다.
          </div>
        </div>

        {/* Goal-Orientation Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-t-4 border-red-500">
          <div className="p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">목표 지향성 (Goal-Oriented)</h3>
            <p className="text-gray-600 text-sm mb-4">
              단순 반응을 넘어, 설정된 목표를 달성하기 위해 계획을 세우고 행동하는 특성입니다.
            </p>
            <div className="bg-red-50 p-3 rounded-lg text-sm text-red-800">
              <strong>학교 예시:</strong><br/>
              "오후 2시까지 강당 청소 완료"라는 목표를 위해, 지금 103호보다 강당을 먼저 가는 판단.
            </div>
          </div>
          <div className="bg-gray-50 p-4 border-t text-xs text-gray-500">
            ❌ 오개념: 목표만 쫓다가 안전 규정을 어기면 좋은 에이전트가 아닙니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheorySection;