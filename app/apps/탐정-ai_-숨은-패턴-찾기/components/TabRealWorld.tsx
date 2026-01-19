import React from 'react';
import { ShoppingCart, Film, Database } from 'lucide-react';

export const TabRealWorld: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">우리 일상 속의 비지도 학습</h2>
        <p className="text-slate-600">탐정이 발견한 패턴은 실제로 이렇게 쓰이고 있습니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recommendation System */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-red-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <Film size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">넷플릭스 & 유튜브 추천</h3>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            "당신이 좋아할 만한 동영상"은 어떻게 알까요? 
            나와 <strong>시청 패턴이 비슷한 유저들을 군집화</strong>합니다. 
            나와 같은 그룹에 속한 다른 사람이 본 영상을 나에게도 추천해주는 것이죠.
          </p>
          <div className="bg-slate-100 p-3 rounded text-xs text-slate-500 font-mono">
            User A: [영화1, 영화2, ?] <br/>
            User B: [영화1, 영화2, 영화3] <br/>
            Result: A에게 '영화3' 추천
          </div>
        </div>

        {/* Market Basket */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-yellow-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">장바구니 분석</h3>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            "맥주를 사는 사람은 기저귀도 같이 산다?" 
            대형 마트의 구매 영수증 데이터를 분석하여 <strong>함께 구매되는 상품의 규칙</strong>을 찾아냅니다. 
            이를 '연관 규칙 학습'이라고 합니다.
          </p>
           <div className="bg-slate-100 p-3 rounded text-xs text-slate-500 font-mono">
            Rule: {`{빵, 우유} -> {버터}`} <br/>
            Confidence: 80%
          </div>
        </div>

        {/* Anomaly Detection */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Database size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">이상치 탐지 (보안)</h3>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            신용카드 회사는 도난 카드를 어떻게 알까요?
            평소 나의 소비 패턴(군집)에서 <strong>벗어난 동떨어진 데이터</strong>(갑자기 해외에서 고액 결제)가 발생하면 
            AI 탐정이 경고를 보냅니다.
          </p>
        </div>
      </div>
    </div>
  );
};