import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const EfficiencyTab: React.FC = () => {
  const data = [
    { name: '최선 (중간값 피벗)', steps: 15, complexity: 'O(n log n)', color: '#10b981' },
    { name: '평균', steps: 22, complexity: 'O(n log n)', color: '#3b82f6' },
    { name: '최악 (최소/최대 피벗)', steps: 50, complexity: 'O(n²)', color: '#ef4444' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">왜 피벗 선택이 중요할까요?</h2>
        <p className="text-slate-600 mb-8">
            퀵 정렬에서 "단계 수"(비교 및 교환 횟수)는 파티션이 얼마나 균형 있게 나뉘는지에 따라 크게 달라집니다.
            배열을 매번 절반 정도로 나누는 피벗을 고르면 트리 깊이가 얕아져 빠르지만, 가장 작거나 큰 수를 고르면 한 번에 하나씩만 처리하게 되어 매우 느려집니다!
        </p>

        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={180} tick={{fontSize: 12, fill: '#475569'}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="steps" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="font-bold text-green-900 text-lg mb-2">균형 잡힌 분할 (최선)</h3>
            <div className="flex justify-center py-4">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-8 bg-slate-300 rounded flex justify-center items-center text-xs">8개 항목</div>
                    <div className="flex gap-2">
                        <div className="w-16 h-8 bg-green-200 rounded flex justify-center items-center text-xs">4</div>
                        <div className="w-16 h-8 bg-green-200 rounded flex justify-center items-center text-xs">4</div>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-7 h-8 bg-green-300 rounded"></div><div className="w-7 h-8 bg-green-300 rounded"></div>
                        <div className="w-7 h-8 bg-green-300 rounded"></div><div className="w-7 h-8 bg-green-300 rounded"></div>
                    </div>
                </div>
            </div>
            <p className="text-sm text-green-800">
                깊이가 얕습니다 ($\log n$). 전체 작업량은 $O(n \log n)$입니다.
            </p>
        </div>

        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-900 text-lg mb-2">불균형 분할 (최악)</h3>
            <div className="flex justify-center py-4">
                <div className="flex flex-col items-end gap-1">
                    <div className="w-32 h-6 bg-slate-300 rounded"></div>
                    <div className="w-28 h-6 bg-red-200 rounded"></div>
                    <div className="w-24 h-6 bg-red-300 rounded"></div>
                    <div className="w-20 h-6 bg-red-400 rounded"></div>
                    <div className="w-16 h-6 bg-red-500 rounded"></div>
                </div>
            </div>
            <p className="text-sm text-red-800">
                깊이가 깊어집니다 ($n$). 전체 작업량은 $O(n^2)$이 됩니다. 이미 정렬된 배열에서 첫 번째 요소를 피벗으로 잡을 때 발생합니다!
            </p>
        </div>
      </div>
    </div>
  );
};