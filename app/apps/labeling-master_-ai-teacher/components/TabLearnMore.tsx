import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

const data = [
  { name: '지도학습', value: 95, fill: '#4f46e5' },
  { name: '비지도학습', value: 60, fill: '#10b981' },
];

const TabLearnMore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex items-center space-x-2 text-indigo-600 mb-6">
        <Info className="w-6 h-6" />
        <h2 className="text-2xl font-bold">더 깊이 알아보기</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">지도학습 vs 비지도학습</h3>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">구분</th>
                  <th className="px-4 py-3">지도학습 (Supervised)</th>
                  <th className="px-4 py-3">비지도학습 (Unsupervised)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium bg-gray-50">정답(레이블)</td>
                  <td className="px-4 py-3 text-indigo-600 font-bold">있음 (O)</td>
                  <td className="px-4 py-3 text-gray-500">없음 (X)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium bg-gray-50">목적</td>
                  <td className="px-4 py-3">예측 및 분류</td>
                  <td className="px-4 py-3">데이터 구조/패턴 발견</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium bg-gray-50">예시</td>
                  <td className="px-4 py-3">스팸 필터, 환율 예측</td>
                  <td className="px-4 py-3">고객 군집화, 추천 시스템</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">정답 유무에 따른 정확도 차이 (예시)</h3>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60} label={{ position: 'top', fill: '#666' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            * 지도학습은 명확한 정답이 있어 특정 작업에서 높은 정확도를 보이기 쉽습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabLearnMore;