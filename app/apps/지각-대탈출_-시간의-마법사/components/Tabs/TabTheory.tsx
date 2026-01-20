import React from 'react';
import { Brain, Layers, Scissors, Clock } from 'lucide-react';

export const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">알고리즘의 마법</h2>
        <p className="text-gray-600">복잡한 문제를 해결하는 똑똑한 방법들을 알아봐요.</p>
      </div>

      {/* Concept 1: Divide and Conquer */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Scissors className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">분할 정복 (Divide and Conquer)</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              나폴레옹이 전쟁에서 사용했던 전술에서 유래했어요. 거대한 적군(큰 문제)을 한 번에 상대하지 않고, 
              군대를 나누어(Divide) 작은 적들을 하나씩 격파(Conquer)한 뒤 다시 합치는(Combine) 전략입니다.
            </p>
            <div className="mt-4 bg-gray-50 p-3 rounded-lg text-xs text-gray-500">
              💡 <strong>예시:</strong> 어지러운 방 청소하기
              <br/>
              1. 책상 정리 / 옷장 정리 / 바닥 쓸기로 나눈다.
              <br/>
              2. 각각 빠르게 해결한다.
              <br/>
              3. 깨끗해진 방 완성!
            </div>
          </div>
        </div>
      </div>

      {/* Concept 2: Parallel Processing */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-xl">
            <Layers className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">병렬 처리 (Parallel Processing)</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              여러 가지 일을 동시에 처리하는 것을 말해요. 컴퓨터의 CPU가 여러 개의 코어로 동시에 계산하듯, 
              우리도 '양치하면서 머리 감기' 처럼 시간을 단축할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Concept 3: Trade-off */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">트레이드오프 (Trade-off)</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              하나를 얻으면 다른 하나를 잃는 관계를 말해요. 밥을 빨리 먹으면(시간 단축) 체하거나 배가 고플 수 있죠(체력 감소).
              완벽한 정답은 없습니다. 상황에 맞는 최적의 균형을 찾는 것이 중요해요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};