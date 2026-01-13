import React from 'react';
import { ShoppingBag, MessageCircle, BarChart2 } from 'lucide-react';

const Cases: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">실전 마케팅 성공 사례</h2>
        <p className="text-gray-500">군집화 분석이 실제 비즈니스를 어떻게 바꿨을까요?</p>
      </div>

      {/* Case 1 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">Case Study 1: 화장품 브랜드 P사</h3>
          </div>
        </div>
        <div className="p-8">
          <h4 className="font-bold text-gray-800 mb-2 text-lg">SNS 언급 빈도에 따른 브랜드 군집화</h4>
          <p className="text-gray-600 mb-6 leading-relaxed">
            연구진은 소셜 미디어 상에서 브랜드가 언급되는 횟수와 긍정/부정 감성 점수를 축으로 브랜드를 군집화했습니다.
            단순히 "비싼 브랜드" vs "저렴한 브랜드"가 아니라, 
            <strong>"대중적 관심은 높지만 호불호가 갈리는 그룹"</strong>과 
            <strong>"매니아층이 확실한 그룹"</strong> 등으로 시장을 재정의했습니다.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-500">
            <p className="text-sm text-gray-700 italic">
              "데이터를 통해 우리는 경쟁자가 누구인지 다시 정의할 수 있었습니다. 
              가격대가 비슷한 브랜드가 경쟁자가 아니라, 고객의 머릿속(인식)이 비슷한 브랜드가 진짜 경쟁자였던 것이죠."
              <br/><span className="text-xs text-gray-400 mt-1 block">- [cite: 57, 58] 관련 연구 인용</span>
            </p>
          </div>
        </div>
      </div>

      {/* Case 2 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">Case Study 2: 글로벌 SPA 브랜드 Z사</h3>
          </div>
        </div>
        <div className="p-8">
          <h4 className="font-bold text-gray-800 mb-2 text-lg">매장 별 재고 최적화</h4>
          <p className="text-gray-600 mb-6 leading-relaxed">
            전 세계 수천 개 매장을 관리하는 Z사는 매장을 지역이나 국가가 아닌 
            <strong>'판매되는 스타일 패턴'</strong>으로 군집화했습니다.
            A군집 매장(트렌디한 아이템 선호), B군집 매장(기본템 선호) 등으로 나누어
            신상품 배분 로직을 자동화하여 재고 회전율을 20% 이상 개선했습니다.
          </p>
        </div>
      </div>

       <div className="bg-indigo-50 p-6 rounded-xl text-center">
         <BarChart2 className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
         <p className="text-indigo-800 font-medium">
           여러분이 방금 시뮬레이션에서 한 '사이즈 군집화'도 실제 의류 업계에서
           '핏(Fit) 가이드'를 만들 때 사용하는 가장 기본적인 데이터 분석입니다.
         </p>
       </div>
    </div>
  );
};

export default Cases;
