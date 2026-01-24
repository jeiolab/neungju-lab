import React from 'react';
import { THEORY_CARDS } from '../constants';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">네트워크 기초 개념</h2>
        <p className="text-slate-600">유선과 무선의 차이를 카드로 확인해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEORY_CARDS.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-slate-50 rounded-lg">{card.icon}</div>
              <h3 className="text-lg font-bold text-slate-800">{card.title}</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">{card.description}</p>
            {card.traits && (
              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">이동성</span>
                  <span className={card.traits.mobility === '매우 높음' ? 'text-green-600 font-bold' : 'text-slate-700'}>{card.traits.mobility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">안정성</span>
                  <span className={card.traits.stability === '매우 높음' ? 'text-blue-600 font-bold' : 'text-slate-700'}>{card.traits.stability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">보안성</span>
                  <span className={card.traits.security === '높음' ? 'text-blue-600 font-bold' : 'text-orange-600 font-bold'}>{card.traits.security}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
        <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">한눈에 보는 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="text-xs text-slate-500 uppercase bg-blue-100">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">구분</th>
                <th className="px-4 py-3">유선 (Wired)</th>
                <th className="px-4 py-3 rounded-r-lg">무선 (Wireless)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-blue-50">
                <td className="px-4 py-3 font-bold">연결 매체</td>
                <td className="px-4 py-3">케이블 (LAN선, 광케이블)</td>
                <td className="px-4 py-3">전파 (Wi-Fi, LTE/5G)</td>
              </tr>
              <tr className="bg-white border-b border-blue-50">
                <td className="px-4 py-3 font-bold">이동성</td>
                <td className="px-4 py-3 text-red-500">낮음 (선 길이 제한)</td>
                <td className="px-4 py-3 text-green-600 font-bold">매우 높음</td>
              </tr>
              <tr className="bg-white border-b border-blue-50">
                <td className="px-4 py-3 font-bold">안정성</td>
                <td className="px-4 py-3 text-blue-600 font-bold">매우 안정적</td>
                <td className="px-4 py-3 text-orange-500">환경/거리에 따라 변동</td>
              </tr>
              <tr className="bg-white">
                <td className="px-4 py-3 font-bold">보안성</td>
                <td className="px-4 py-3 text-blue-600">물리적 접속 필요 (안전)</td>
                <td className="px-4 py-3 text-orange-500">공중 전파 (암호화 필수)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;
