import React from 'react';
import { HeartPulse, Globe2, Leaf } from 'lucide-react';

export const TabSDGs: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">SDGs와 기계학습</h2>
        <p className="text-slate-600 mt-2">'미세먼지 예보관'이 어떻게 지구를 지키는지 알아보아요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Goal 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 bg-emerald-100 flex items-center justify-center">
            <HeartPulse size={48} className="text-emerald-600" />
          </div>
          <div className="p-6">
            <div className="uppercase tracking-wide text-sm text-emerald-600 font-bold mb-2">SDG 3번 목표</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">건강과 웰빙</h3>
            <p className="text-slate-600 text-sm">
              정확한 미세먼지 예보는 시민들이 나쁜 공기를 피하게 도와주며, 호흡기 질환을 예방하여 모두의 건강을 지킵니다.
            </p>
          </div>
        </div>

        {/* Goal 11 */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 bg-orange-100 flex items-center justify-center">
            <Globe2 size={48} className="text-orange-600" />
          </div>
          <div className="p-6">
            <div className="uppercase tracking-wide text-sm text-orange-600 font-bold mb-2">SDG 11번 목표</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">지속 가능한 도시</h3>
            <p className="text-slate-600 text-sm">
              데이터 기반의 교통량 조절(오염이 심할 때 차량 운행 제한 등)은 도시를 더 안전하고 쾌적하게 만듭니다.
            </p>
          </div>
        </div>

         {/* Goal 13 */}
         <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-32 bg-blue-100 flex items-center justify-center">
            <Leaf size={48} className="text-blue-600" />
          </div>
          <div className="p-6">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-bold mb-2">SDG 13번 목표</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">기후 변화 대응</h3>
            <p className="text-slate-600 text-sm">
              환경 데이터를 분석하면 기후 패턴을 이해하고, 탄소 배출을 줄이는 정책을 만드는 과학적 근거가 됩니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-xl mt-6">
        <h3 className="font-bold text-lg mb-2">왜 기계학습(Machine Learning)인가요?</h3>
        <p className="text-slate-300">
          전통적인 예보는 고정된 규칙에 의존합니다. 하지만 기계학습은 과거의 수많은 센서 데이터를 학습하여, 기후가 변하더라도 가장 정확한 예측 공식(가중치)을 스스로 찾아낼 수 있습니다.
        </p>
      </div>
    </div>
  );
};