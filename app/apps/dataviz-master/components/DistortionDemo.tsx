import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DISTORTION_DATA = [
  { name: 'A사 제품', value: 98 },
  { name: 'B사 제품', value: 100 },
];

const DistortionDemo: React.FC = () => {
  const [isDistorted, setIsDistorted] = useState(false);

  return (
    <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
          ⚠️ 미디어 리터러시: 축의 비밀
        </h3>
        <button
          onClick={() => setIsDistorted(!isDistorted)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isDistorted 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isDistorted ? '정상 그래프로 보기' : '왜곡된 그래프 보기'}
        </button>
      </div>

      <p className="mb-4 text-sm text-amber-800">
        두 제품의 점수 차이는 단 2점입니다. 하지만 Y축의 시작점을 조작하면 어떻게 보일까요?
      </p>

      <div className="h-64 bg-white rounded-lg p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DISTORTION_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              domain={isDistorted ? [90, 102] : [0, 'auto']} 
              hide={false}
            />
            <Tooltip />
            <Bar dataKey="value" fill={isDistorted ? '#ef4444' : '#3b82f6'} barSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="mt-4 text-xs text-center text-slate-500">
        {isDistorted 
          ? "축을 90부터 시작하니 B사가 압도적으로 좋아 보입니다. (과장됨)" 
          : "축을 0부터 시작하니 두 제품 간에 큰 차이가 없어 보입니다. (객관적)"}
      </p>
    </div>
  );
};

export default DistortionDemo;
