'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HistoryPoint } from '../types';

interface Props {
  data: HistoryPoint[];
}

const StockChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-6">기업 성과 지표</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" label={{ value: '주차', position: 'insideBottomRight', offset: -10 }} />
            <YAxis yAxisId="left" stroke="#64748b" />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} 
              itemStyle={{ color: '#0f172a' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="value" stroke="#8884d8" name="기업 가치 ($)" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="security" stroke="#3b82f6" name="보안 점수" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-slate-600">
        <p>기업 가치는 활성 유저 수와 현재 자금을 바탕으로 계산됩니다. 보안 점수는 위험 리스크에 영향을 줍니다.</p>
      </div>
    </div>
  );
};

export default StockChart;