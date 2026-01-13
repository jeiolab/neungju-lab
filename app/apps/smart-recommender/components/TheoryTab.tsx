import React from 'react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">추천 시스템의 비밀: 연관 규칙</h2>
        <p className="mt-3 text-lg text-slate-600">
          "이 상품을 산 사람들은 저 상품도 샀어요!"
        </p>
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-start gap-6">
          <div className="bg-indigo-100 p-4 rounded-xl text-4xl">💡</div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">연관 규칙(Association Rules)이란?</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              데이터 안에서 항목들 간의 <strong>'만약 ~라면(If), ~이다(Then)'</strong>라는 관계를 찾아내는 기법입니다.
              편의점 영수증 데이터를 분석해서 <strong>"라면을 사면(Condition) 김치도 산다(Result)"</strong>는 규칙을 찾아내는 것이죠.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-semibold text-sm text-slate-700 mb-2">핵심 지표: 지지도 (Support)</h4>
                <p className="text-sm text-slate-600">
                    전체 거래 중 두 품목(A와 B)이 동시에 포함된 비율입니다. <br/>
                    <code>지지도 = (A와 B가 함께 있는 영수증 수) ÷ (전체 영수증 수)</code>
                </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <span className="mr-2 text-2xl">🛒</span> 마트 진열의 비밀
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            미국의 한 마트에서 금요일 저녁에 <strong>맥주와 기저귀</strong>가 함께 팔린다는 사실을 발견했습니다.
            아내의 심부름으로 기저귀를 사러 온 아빠들이 맥주도 같이 샀던 거죠!
            마트는 두 상품을 가까이 진열해 매출을 올렸습니다.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <span className="mr-2 text-2xl">🎬</span> 넷플릭스와 유튜브
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            "당신이 좋아할 만한 콘텐츠"는 여러분의 시청 기록을 분석해 만들어집니다.
            <strong>'어벤져스'를 본 80%의 사람이 '스파이더맨'을 봤다면</strong>,
            시스템은 여러분에게 스파이더맨을 추천하게 됩니다.
          </p>
        </section>
      </div>
      
      <section className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
         <h3 className="text-2xl font-bold mb-2">직접 체험해보세요!</h3>
         <p className="mb-0 text-indigo-100">상단 탭의 '시뮬레이션'으로 이동해서 직접 규칙을 찾아보세요.</p>
      </section>
    </div>
  );
};