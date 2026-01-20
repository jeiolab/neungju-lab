import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { n: 10, linear: 10, binary: 4 },
  { n: 20, linear: 20, binary: 5 },
  { n: 40, linear: 40, binary: 6 },
  { n: 60, linear: 60, binary: 6 },
  { n: 80, linear: 80, binary: 7 },
  { n: 100, linear: 100, binary: 7 },
];

const LearnMore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
       <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">알고리즘 효율성: Big O</h2>
        <p className="text-slate-600">선형 탐색 $O(n)$ vs 이진 탐색 $O(\log n)$ 비교</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[400px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="n" label={{ value: '입력 크기 (n)', position: 'insideBottomRight', offset: -10 }} />
            <YAxis label={{ value: '연산 횟수 (Steps)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line type="monotone" dataKey="linear" name="선형 탐색 O(n)" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="binary" name="이진 탐색 O(log n)" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-800 mb-2">O(n) - 선형 시간</h4>
            <p className="text-sm text-red-600">입력 크기에 비례하여 시간이 늘어납니다. 데이터가 2배가 되면 시간도 2배가 걸립니다.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2">O(log n) - 로그 시간</h4>
            <p className="text-sm text-blue-600">시간이 매우 천천히 늘어납니다. 데이터가 2배가 되어도 연산은 단 1번만 늘어납니다!</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="font-bold text-green-800 mb-2">O(1) - 상수 시간</h4>
            <p className="text-sm text-green-600">즉시 처리됩니다. 데이터 양과 상관없이 항상 일정한 시간이 걸립니다 (예: 배열 인덱스 접근).</p>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;