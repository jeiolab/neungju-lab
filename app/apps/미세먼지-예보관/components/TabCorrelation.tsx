import React from 'react';
import { TrendingUp, Wind, Droplets, Car, Factory } from 'lucide-react';

export const TabCorrelation: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          데이터 상관관계 분석
        </h2>
        <p className="text-slate-600 mb-6">
          유능한 예보관이 되려면 변수들이 미세먼지 농도에 어떤 영향을 미치는지 이해해야 합니다.
          센서 데이터 분석 결과는 다음과 같습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Correlations */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📈</span> 미세먼지 증가 요인
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-red-600">
                  <Car size={20} />
                </div>
                <div>
                  <span className="font-bold block text-slate-800">교통량 (Traffic)</span>
                  <span className="text-sm text-slate-600">양의 상관관계. 자동차 배기가스는 미세먼지의 주범입니다.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-red-600">
                  <Factory size={20} />
                </div>
                <div>
                  <span className="font-bold block text-slate-800">공장 가동률 (Factory)</span>
                  <span className="text-sm text-slate-600">매우 강한 양의 상관관계. 산업 매연은 농도를 급격히 높입니다.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Negative Correlations */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📉</span> 미세먼지 감소 요인
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
                  <Wind size={20} />
                </div>
                <div>
                  <span className="font-bold block text-slate-800">풍속 (Wind Speed)</span>
                  <span className="text-sm text-slate-600">음의 상관관계. 바람이 강하게 불면 오염물질이 흩어집니다.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                  <Droplets size={20} />
                </div>
                <div>
                  <span className="font-bold block text-slate-800">습도 (Humidity)</span>
                  <span className="text-sm text-slate-600">약한 음의 상관관계. 공기 중 수분이 먼지를 가라앉히는 효과가 있습니다.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">💡 예보관의 노트</h3>
        <p className="text-blue-800 text-sm">
          이러한 관계를 바탕으로 <strong>선형 회귀 모델(Linear Regression)</strong>을 만들 수 있습니다.<br/>
          우리가 사용할 예측 공식은 다음과 같습니다: <br/>
          <code className="bg-white px-2 py-1 rounded text-blue-700 font-mono mt-2 block w-fit">
            미세먼지 = (교통량 × 0.5) + (공장 × 0.8) - (풍속 × 2) - (습도 × 0.3)
          </code>
        </p>
      </div>
    </div>
  );
};