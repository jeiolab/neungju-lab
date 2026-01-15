import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CaseRequest: React.FC = () => {
  const demoData = [
    { x: 10, y: 30 }, { x: 30, y: 200 }, { x: 45, y: 100 },
    { x: 50, y: 400 }, { x: 70, y: 150 }, { x: 100, y: 250 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-lg border-l-4 border-amber-500 shadow-lg">
        <h2 className="text-2xl font-bold text-amber-500 mb-2">사건 파일: #XY-001</h2>
        <p className="text-slate-300 leading-relaxed">
          탐정님, 비상 상황입니다. 데이터는 산더미처럼 쌓여있지만 뒤죽박죽이라 아무것도 알 수 없습니다.
          당신의 임무는 <strong className="text-white">좌표계(Coordinate System)</strong>를 사용하여 숨겨진 범인(패턴)을 찾아내는 것입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">수사 도구: 산점도 (Scatter Plot)</h3>
          <p className="text-sm text-slate-400 mb-4">
            산점도는 두 가지 숫자 변수의 값을 점으로 나타냅니다.
            가로축과 세로축에 찍힌 점의 위치는 각 데이터의 고유한 값을 보여줍니다.
          </p>
          <div className="h-64 w-full bg-slate-900 rounded p-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="X" stroke="#94a3b8" />
                <YAxis type="number" dataKey="y" name="Y" stroke="#94a3b8" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                <Scatter name="단서" data={demoData} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">그림 A. 기초 산점도 증거물</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">🔎 단서 해석법</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><span className="text-amber-400 font-bold">X축:</span> 수평 바닥 (왼쪽에서 오른쪽).</li>
              <li><span className="text-amber-400 font-bold">Y축:</span> 수직 높이 (바닥에서 위쪽).</li>
              <li><span className="text-amber-400 font-bold">군집 (Cluster):</span> 점들이 뭉쳐 있는 곳. 보통 이들은 비밀(같은 종류)을 공유합니다.</li>
              <li><span className="text-amber-400 font-bold">이상치 (Outlier):</span> 홀로 떨어져 있는 점. 아주 수상합니다!</li>
            </ul>
          </div>
          
          <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-500/30">
             <h4 className="font-bold text-amber-500 mb-1">탐정의 팁</h4>
             <p className="text-sm text-amber-200">
               "숫자 하나만 보지 마세요. 용의자가 X축에서는 평범해 보일지 몰라도 Y축에서는 매우 수상할 수 있습니다! 두 가지를 동시에 봐야 진실이 보입니다."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseRequest;
