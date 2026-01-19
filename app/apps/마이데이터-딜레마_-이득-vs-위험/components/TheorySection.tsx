import React from 'react';
import { THEORY_CARDS } from '../constants';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">데이터 경제의 기본 개념</h2>
        <p className="text-slate-600">시뮬레이션을 시작하기 전에 꼭 알아야 할 내용들이에요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {THEORY_CARDS.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow">
              <div className={`p-4 ${card.color} flex items-center justify-center`}>
                <Icon size={32} />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-3">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="font-bold text-indigo-800 text-lg mb-2">💡 더 알아보기: 데이터 결합의 양면성</h3>
        <p className="text-slate-700 text-sm mb-4">
          서로 다른 곳에 있던 내 정보(예: 통신사 위치 정보 + 카드사 소비 정보)가 결합되면, 
          나도 몰랐던 나의 행동 패턴이 드러날 수 있습니다. 
          이는 <strong>초개인화 서비스</strong>를 가능하게 하지만, 
          <strong>사생활 침해</strong>의 위험도 동시에 높입니다.
        </p>
      </div>
    </div>
  );
};

export default TheorySection;