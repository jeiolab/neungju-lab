import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Search, AlertTriangle, PlayCircle } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [dataSize, setDataSize] = useState<number>(100);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [target, setTarget] = useState<number>(50);
  const [result, setResult] = useState<{ linear: number; binary: number | null; feedback: string } | null>(null);
  
  // Generate data for visualization
  const chartData = [
    { name: '순차 탐색', comparisons: result ? result.linear : 0, color: '#8884d8' },
    { name: '이진 탐색', comparisons: result ? (result.binary || 0) : 0, color: '#82ca9d' }
  ];

  const handleSimulate = () => {
    // Math Logic
    const linearAvg = Math.ceil(dataSize / 2); // Average case
    const linearWorst = dataSize;
    
    let binaryWorst = null;
    let feedback = "";

    if (isSorted) {
      binaryWorst = Math.ceil(Math.log2(dataSize));
      if (dataSize < 20) {
        feedback = "데이터가 적을 땐(20개 미만) 순차 탐색도 충분히 빠릅니다. 차이가 거의 없죠?";
      } else {
        feedback = `데이터가 ${dataSize}개일 때, 이진 탐색은 약 ${binaryWorst}번 만에 찾습니다. 순차 탐색(${linearAvg}번)보다 훨씬 효율적이죠!`;
      }
    } else {
      feedback = "⚠️ 주의: 데이터가 정렬되지 않았습니다! 이진 탐색을 사용할 수 없습니다. 순차 탐색만 가능합니다.";
    }

    setResult({
      linear: linearAvg,
      binary: binaryWorst,
      feedback
    });
  };

  useEffect(() => {
    setResult(null);
  }, [dataSize, isSorted]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Search className="w-6 h-6 mr-2 text-indigo-600" />
        알고리즘 실험실
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              데이터 크기 (N): {dataSize}개
            </label>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10" 
              value={dataSize} 
              onChange={(e) => setDataSize(parseInt(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mb-6"
            />

            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-gray-700">정렬 상태</span>
              <button 
                onClick={() => setIsSorted(!isSorted)}
                className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
                  isSorted 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-gray-200 text-gray-500 border border-gray-300'
                }`}
              >
                {isSorted ? '✅ 정렬됨 (Sorted)' : '🎲 무작위 (Unsorted)'}
              </button>
            </div>

            <button 
              onClick={handleSimulate}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-transform transform active:scale-95 flex items-center justify-center"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              비교 시작
            </button>
          </div>

          {/* Feedback */}
          {result && (
            <div className={`p-4 rounded-lg border ${!isSorted ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
              <h3 className="font-bold mb-2 flex items-center">
                {!isSorted && <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />}
                실험 결과 분석
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {result.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Visualization */}
        <div className="h-64 md:h-auto bg-white border border-gray-100 rounded-lg p-4 flex flex-col">
           <h3 className="text-sm font-bold text-gray-500 text-center mb-4">평균 비교 횟수</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
               <XAxis dataKey="name" />
               <YAxis />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                formatter={(value: number | undefined) => {
                  const numValue = value ?? 0;
                  return [numValue > 0 ? `약 ${numValue}회` : '불가', '비교 횟수'];
                }}
              />
               <Bar dataKey="comparisons" radius={[4, 4, 0, 0]}>
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.comparisons === 0 ? '#e5e7eb' : entry.color} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
           {!result && (
             <p className="text-center text-gray-400 text-sm mt-2">조건을 설정하고 '비교 시작'을 누르세요</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
