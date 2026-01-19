import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ToggleLeft, ToggleRight, HelpCircle, Target } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [showLabels, setShowLabels] = useState(false);
  const [data, setData] = useState<{ x: number; y: number; cluster: number }[]>([]);

  useEffect(() => {
    // Generate random clustered data
    const generateCluster = (centerX: number, centerY: number, clusterId: number, count: number) => {
      return Array.from({ length: count }).map(() => ({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        cluster: clusterId,
      }));
    };

    const c1 = generateCluster(30, 70, 0, 20); // Cluster A
    const c2 = generateCluster(70, 30, 1, 20); // Cluster B
    const c3 = generateCluster(70, 80, 2, 15); // Cluster C
    
    // Add some noise/anomalies
    const noise = generateCluster(50, 50, 3, 5);

    setData([...c1, ...c2, ...c3, ...noise]);
  }, []);

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#64748b']; // Indigo, Pink, Emerald, Slate

  return (
    <div className="flex flex-col h-full space-y-4 p-2">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          마이크로 실험실: 라벨의 유무
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-slate-50 rounded-lg p-4 border border-slate-100 min-h-[300px]">
             <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis type="number" dataKey="x" name="특성 1" hide />
                <YAxis type="number" dataKey="y" name="특성 2" hide />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Data Points" data={data}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={showLabels ? COLORS[entry.cluster] : '#94a3b8'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="text-center text-sm text-slate-500 mt-2">
              {showLabels ? "색상 = 정답(Label)" : "모든 데이터가 동일해 보임"}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center justify-between bg-indigo-50 p-4 rounded-lg">
              <span className="font-semibold text-indigo-900">레이블(정답) 표시</span>
              <button 
                onClick={() => setShowLabels(!showLabels)}
                className="focus:outline-none transition-transform active:scale-95"
              >
                {showLabels ? (
                  <ToggleRight className="w-10 h-10 text-indigo-600" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-slate-400" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border transition-all duration-300 ${!showLabels ? 'bg-white border-indigo-200 shadow-md transform scale-105' : 'bg-slate-50 border-transparent opacity-50'}`}>
                <h3 className="font-bold text-lg text-slate-800 mb-1">비지도 학습 (Unsupervised)</h3>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-indigo-600">목표:</span> 데이터끼리 가까운 것들을 묶어보자 (군집화).
                </p>
                <p className="text-xs text-slate-500 mt-1">"이 데이터들은 3개의 그룹으로 나뉘는 것 같아."</p>
              </div>

              <div className={`p-4 rounded-lg border transition-all duration-300 ${showLabels ? 'bg-white border-pink-200 shadow-md transform scale-105' : 'bg-slate-50 border-transparent opacity-50'}`}>
                <h3 className="font-bold text-lg text-slate-800 mb-1">지도 학습 (Supervised)</h3>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-pink-600">목표:</span> 파란색과 분홍색을 나누는 선을 긋자 (분류).
                </p>
                <p className="text-xs text-slate-500 mt-1">"새로운 점이 오면 무슨 색일지 맞혀보자."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-slate-100 p-4 rounded-lg flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-bold">튜터의 팁:</span> 라벨을 끄면(OFF), 우리는 "정답을 맞히는 것"을 포기해야 합니다. 대신 "데이터가 어떻게 생겼는지" 구조를 파악하게 되죠. 이것이 바로 비지도학습의 본질입니다!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;