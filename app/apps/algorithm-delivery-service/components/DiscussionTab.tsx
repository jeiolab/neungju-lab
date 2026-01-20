import React from 'react';
import { Coffee, ShoppingCart, HelpCircle } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-10">
        <h2 className="text-2xl font-bold text-slate-800">생각해볼 문제</h2>
        <p className="text-slate-500">일상 생활 속 알고리즘을 찾아봅시다.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 text-slate-100">
          <ShoppingCart size={150} />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <Coffee className="mr-2 text-amber-700" /> 편의점 음료수 진열대
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            편의점 냉장고에 음료수가 진열되어 있습니다. <br/>
            보통 종류별(우유, 커피, 탄산)로는 묶여 있지만, <br/>
            같은 종류 안에서 <strong>가격순</strong>이나 <strong>이름순</strong>으로 칼같이 정렬되어 있지는 않습니다.
          </p>

          <div className="bg-slate-50 p-6 rounded-xl mb-6">
            <h4 className="font-bold text-slate-800 mb-2 flex items-center">
              <HelpCircle size={18} className="mr-2 text-blue-500" /> 
              왜 편의점 알바생은 음료수를 '이름순'으로 정렬하지 않을까요?
            </h4>
            <p className="text-sm text-slate-500 italic mb-4">
              힌트: 정렬 비용(알바생의 노동력) vs 검색 비용(손님의 불편함)
            </p>
            <div className="space-y-2 text-sm text-slate-700">
              <p>1. 새로운 물건이 들어올 때마다 이름순으로 끼워 넣으려면 시간이 매우 오래 걸립니다 (Insertion Cost).</p>
              <p>2. 손님들은 보통 자신이 마시고 싶은 게 대략 '어디쯤(커피 칸)'에 있는지 알고 있습니다 (Heuristic).</p>
              <p>3. 손님이 찾는 물건이 1000개가 아니라 기껏해야 20~30개 중 하나입니다. 눈으로 훑어도(Linear Search) 3초면 찾습니다.</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-900 font-medium">
              결론: 데이터 양이 적을 때는 정렬 유지 비용이 검색 이득보다 큽니다. <br/>
              그래서 우리는 편의점에서 '순차 탐색'을 하며 살아갑니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;