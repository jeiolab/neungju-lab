import React from 'react';
import { UserStats } from '../types';
import TreeVisualizer from './TreeVisualizer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cloud, Zap, Leaf } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Cloud className="text-blue-500" />
          상황실
        </h2>
        <p className="text-gray-600">나의 디지털 탄소 배출량과 숲의 성장을 확인하세요.</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Cloud size={24} />
            </div>
            <span className="text-gray-500 font-medium">정리한 데이터</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalSavedMB >= 1000 
              ? `${(stats.totalSavedMB / 1000).toFixed(2)} GB` 
              : `${stats.totalSavedMB.toFixed(0)} MB`}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Leaf size={24} />
            </div>
            <span className="text-gray-500 font-medium">탄소 절감량</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
             {stats.co2SavedGrams >= 1000
              ? `${(stats.co2SavedGrams / 1000).toFixed(2)} kg`
              : `${stats.co2SavedGrams.toFixed(0)} g`}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Zap size={24} />
            </div>
            <span className="text-gray-500 font-medium">지구 지킴이 포인트</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.points}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tree Visualization */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">나의 가상 숲</h3>
          <TreeVisualizer level={stats.treeLevel} co2Saved={stats.co2SavedGrams} />
          <p className="mt-4 text-sm text-center text-gray-500">
            데이터를 정리해서 나무를 키워주세요! <br/>
            다음 레벨까지 {500 - (stats.co2SavedGrams % 500)}g의 CO2 감축이 필요합니다.
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">주간 절약 통계 (MB)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="savedMB" radius={[4, 4, 0, 0]}>
                  {stats.weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === stats.weeklyData.length - 1 ? '#22c55e' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">매일 삭제하거나 압축한 데이터(MB)의 양을 보여줍니다.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;