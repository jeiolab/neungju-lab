import React, { useState, useEffect, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceDot } from 'recharts';
import { Snack, DistanceType, KMeansResult, Centroid } from '../types';
import { runKMeans } from '../services/kMeans';
import { RefreshCw, Plus, Play } from 'lucide-react';

interface SimulationTabProps {
  snacks: Snack[];
  onAddSnack: (snack: Snack) => void;
  onRunExperiment: (k: number, dist: DistanceType) => void;
}

const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];

const SimulationTab: React.FC<SimulationTabProps> = ({ snacks, onAddSnack, onRunExperiment }) => {
  const [k, setK] = useState(3);
  const [distanceType, setDistanceType] = useState<DistanceType>('euclidean');
  const [result, setResult] = useState<KMeansResult | null>(null);
  const [seed, setSeed] = useState<string>("");

  // Input State
  const [newName, setNewName] = useState('');
  const [newServing, setNewServing] = useState('');
  const [newKcal, setNewKcal] = useState('');

  useEffect(() => {
    // Generate daily seed
    setSeed(new Date().toISOString().slice(0, 10));
  }, []);

  const handleRun = () => {
    const res = runKMeans(snacks, k, distanceType, seed);
    setResult(res);
    onRunExperiment(k, distanceType);
  };

  const handleAddData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newServing || !newKcal) return;

    const snack: Snack = {
      id: `u-${Date.now()}`,
      name: newName,
      servingSize: Number(newServing),
      kcal: Number(newKcal),
      isUserAdded: true
    };
    onAddSnack(snack);
    setNewName('');
    setNewServing('');
    setNewKcal('');
    // Auto re-run if already ran
    if (result) {
        // Small delay to let state update first
        setTimeout(() => handleRun(), 100);
    }
  };

  const chartData = useMemo(() => {
    if (!result) return snacks.map(s => ({ ...s, clusterId: -1 }));
    return result.clusters;
  }, [result, snacks]);

  const Feedback = () => {
    if (!result) return null;
    return (
      <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg mt-4 animate-fade-in">
        <h3 className="font-bold text-lg mb-2 flex items-center">📢 실험 결과 분석</h3>
        <ul className="space-y-2 text-sm text-gray-200">
          <li className="flex items-start">
            <span className="mr-2">🔹</span>
            <span>
              <strong>지금 K={k}에서는:</strong> {result.clusters.filter(c => c.clusterId === 0).length}개, 
              {result.clusters.filter(c => c.clusterId === 1).length}개... 식으로 그룹이 나뉘었어.
              같은 색깔 점들이 비슷한 영양 성분을 가진 간식들이야.
            </span>
          </li>
          <li className="flex items-start">
             <span className="mr-2">🔹</span>
             <span>
               <strong>왜 묶였을까?</strong> {distanceType === 'euclidean' ? '직선 거리' : '맨해튼 거리'}가 
               가장 가까운 중심점(X) 주변으로 모였기 때문이야.
             </span>
          </li>
          <li className="flex items-start">
             <span className="mr-2">🔹</span>
             <span>
               <strong>팁:</strong> K를 늘리면 더 세밀하게 나뉘지만, 너무 많으면(K=6) "이게 무슨 그룹이지?" 하고 해석하기 어려워질 수 있어(과적합).
             </span>
          </li>
        </ul>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded text-xs">
          <p className="font-bold">{data.name}</p>
          <p>제공량: {data.servingSize}g</p>
          <p>칼로리: {data.kcal}kcal</p>
          {data.clusterId !== -1 && <p style={{ color: COLORS[data.clusterId] }}>그룹: {data.clusterId + 1}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-20 space-y-6">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">군집 개수 (K): {k}</label>
                <input 
                    type="range" min="2" max="6" value={k} 
                    onChange={(e) => setK(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2</span><span>6</span>
                </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setDistanceType('euclidean')}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${distanceType === 'euclidean' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                    유클리디안
                </button>
                <button 
                    onClick={() => setDistanceType('manhattan')}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all ${distanceType === 'manhattan' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                    맨해튼
                </button>
            </div>
            <button 
                onClick={handleRun}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center shadow-md transition-transform active:scale-95"
            >
                <Play size={18} className="mr-2" />
                실험 실행
            </button>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="servingSize" name="제공량" unit="g" label={{ value: '제공량(g)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis type="number" dataKey="kcal" name="칼로리" unit="kcal" label={{ value: '칼로리', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Snacks" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.clusterId === -1 ? '#9CA3AF' : COLORS[entry.clusterId % COLORS.length]} />
              ))}
            </Scatter>
            {/* Centroids */}
            {result && result.centroids.map((c, i) => (
                <ReferenceDot key={`c-${i}`} x={c.x} y={c.y} r={6} fill="transparent" stroke="black" strokeWidth={2} shape={(props: any) => (
                    <g transform={`translate(${props.cx},${props.cy})`}>
                         <line x1="-6" y1="-6" x2="6" y2="6" stroke="black" strokeWidth="3" />
                         <line x1="-6" y1="6" x2="6" y2="-6" stroke="black" strokeWidth="3" />
                    </g>
                )} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        {!result && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px] rounded-xl">
                <p className="text-gray-500 font-medium">실험 실행 버튼을 눌러보세요!</p>
            </div>
        )}
      </div>

      {/* Feedback */}
      <Feedback />

      {/* Add Data */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <Plus className="mr-2 text-indigo-600" size={20} />
            내 간식 데이터 추가하기
        </h3>
        <p className="text-xs text-red-500 mb-3">* 개인정보(실명 등)는 절대 입력하지 마세요. 별명만 사용!</p>
        <form onSubmit={handleAddData} className="flex flex-col sm:flex-row gap-2">
            <input 
                type="text" placeholder="간식 별명 (예: 초코바)" 
                value={newName} onChange={e => setNewName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                required
            />
            <input 
                type="number" placeholder="제공량(g)" 
                value={newServing} onChange={e => setNewServing(e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
                required
            />
            <input 
                type="number" placeholder="kcal" 
                value={newKcal} onChange={e => setNewKcal(e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
                required
            />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap">
                추가 (+5점)
            </button>
        </form>
      </div>
    </div>
  );
};

export default SimulationTab;