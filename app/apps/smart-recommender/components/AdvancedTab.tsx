import React from 'react';

export const AdvancedTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">추천 시스템의 두 가지 기둥</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Content Based */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl text-orange-500">📑</span>
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-orange-600 mb-2">콘텐츠 기반 필터링</h3>
                <h4 className="text-sm text-slate-400 mb-4 font-mono">Content-Based Filtering</h4>
                
                <p className="text-slate-600 text-sm mb-4 min-h-[60px]">
                    "당신이 '아이언맨'을 좋아하니까, 같은 장르(액션)이자 같은 주연 배우가 나오는 '셜록 홈즈'를 추천해요."
                </p>

                <div className="bg-orange-50 rounded-lg p-3 text-xs text-orange-800">
                    <strong>원리:</strong> 아이템 자체의 속성(장르, 감독, 키워드)을 분석
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        장점: 내 취향이 확고할 때 정확함
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                        단점: 새로운 분야를 추천받기 어려움
                    </div>
                </div>
            </div>
        </div>

        {/* Collaborative Filtering */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-9xl text-blue-500">🤝</span>
            </div>
             <div className="relative z-10">
                <h3 className="text-xl font-bold text-blue-600 mb-2">협업 필터링</h3>
                <h4 className="text-sm text-slate-400 mb-4 font-mono">Collaborative Filtering</h4>
                
                <p className="text-slate-600 text-sm mb-4 min-h-[60px]">
                    "당신과 비슷한 취향을 가진 A님이 '기생충'을 재밌게 봤대요. 당신에게도 추천할게요."
                </p>

                <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
                    <strong>원리:</strong> 나와 비슷한 구매/평가 패턴을 가진 다른 유저들의 데이터를 활용
                </div>
                 <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                        장점: 의외의 발견(Serendipity) 가능
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                        <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                        단점: 초기 데이터가 없으면 추천 불가(Cold Start)
                    </div>
                </div>
            </div>
        </div>
      </div>

       <div className="mt-8 p-6 bg-slate-800 rounded-xl text-white">
            <h3 className="font-bold text-lg mb-2">하이브리드 시스템</h3>
            <p className="text-slate-300 text-sm">
                현대의 넷플릭스, 유튜브, 아마존 등은 이 두 가지 방식을 섞어서 사용합니다. 
                여기에 우리가 오늘 배운 <strong>연관 규칙(Association Rule)</strong>도 중요한 보조 지표로 사용된답니다!
            </p>
       </div>
    </div>
  );
};