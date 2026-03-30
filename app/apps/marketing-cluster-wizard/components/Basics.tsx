import React from 'react';
import { Target, Users, TrendingUp } from 'lucide-react';

const Basics: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          군집화(Clustering)란 무엇인가요?
        </h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          군집화는 성격이 비슷한 데이터끼리 그룹으로 묶는 데이터 분석 기법입니다.
          마케팅에서는 이를 <strong>시장 세분화(Market Segmentation)</strong>라고 부릅니다.
          전체 고객을 하나의 덩어리로 보지 않고, 비슷한 특성을 가진 그룹으로 나누어
          각 그룹에 맞는 맞춤형 전략을 세우는 것이 핵심입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">타겟팅 명확화</h3>
          <p className="text-sm text-gray-600">
            "모든 사람을 만족시키려 하면 아무도 만족시킬 수 없다." <br/>
            핵심 고객층을 정확히 조준할 수 있습니다.
          </p>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">고객 이해도 상승</h3>
          <p className="text-sm text-gray-600">
            고객들이 어떤 패턴을 가지고 있는지, 어떤 니즈가 겹치는지 데이터로 확인할 수 있습니다.
          </p>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">효율성 극대화</h3>
          <p className="text-sm text-gray-600">
            마케팅 예산과 자원을 가장 효과가 좋을 것으로 예상되는 그룹에 집중할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-3">💡 사수(Mentor)의 한마디</h3>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
          "신입 때 가장 많이 하는 실수가 그냥 '20대 여자' 처럼 인구통계학적으로만 나누는 거예요. 
          진짜 고수들은 '행동 데이터'(구매 빈도, 사이트 체류 시간 등)로 군집화를 한답니다. 
          오늘 우리가 해볼 '키/몸무게' 군집화는 의류 제품 개발의 가장 기초이자 핵심이에요!"
        </blockquote>
      </div>
    </div>
  );
};

export default Basics;
