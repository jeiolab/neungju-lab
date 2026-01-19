import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProjectTheme } from '../types';

interface SimulationProps {
  theme: ProjectTheme;
}

const Simulation: React.FC<SimulationProps> = ({ theme }) => {
  // Parameter State: For clustering this is K (1-5), For Outlier this is Threshold (1-10)
  const [param, setParam] = useState<number>(3); 
  
  // Determine mode based on theme for simulation logic
  const mode = theme === ProjectTheme.ENV ? 'OUTLIER' : 'CLUSTERING';
  const paramLabel = mode === 'CLUSTERING' ? '군집 수 (K)' : '이상치 임계값 (Threshold)';
  const minVal = 1;
  const maxVal = mode === 'CLUSTERING' ? 5 : 10;

  // Generate mock data based on theme
  const data = useMemo(() => {
    const points = [];
    // Cluster 1 (Low, Low)
    for(let i=0; i<20; i++) points.push({ x: 10 + Math.random()*15, y: 10 + Math.random()*15, cluster: 1 });
    // Cluster 2 (High, High)
    for(let i=0; i<20; i++) points.push({ x: 60 + Math.random()*20, y: 60 + Math.random()*20, cluster: 2 });
    // Cluster 3 (Low, High)
    for(let i=0; i<20; i++) points.push({ x: 15 + Math.random()*15, y: 70 + Math.random()*15, cluster: 3 });
    
    // Add noise for outlier detection context
    if (mode === 'OUTLIER') {
        points.push({ x: 95, y: 5, cluster: 0 }); // Extreme Outlier
        points.push({ x: 5, y: 95, cluster: 0 }); // Extreme Outlier
        points.push({ x: 45, y: 45, cluster: 0 }); // Center noise
    }
    return points;
  }, [theme, mode]);

  // Visualize Logic
  const processedData = useMemo(() => {
    return data.map((pt, idx) => {
        let color = "#8884d8";
        
        if (mode === 'CLUSTERING') {
            // Fake K-Means logic for visualization
            // If K=1: All same
            // If K=2: Split roughly by diagonal
            // If K=3: Use original generated clusters (ideal)
            // If K>3: Arbitrarily split cluster 2
            if (param === 1) color = "#8884d8";
            else if (param === 2) color = (pt.x + pt.y > 80) ? "#82ca9d" : "#8884d8";
            else if (param === 3) {
                 if (pt.cluster === 1) color = "#8884d8";
                 else if (pt.cluster === 2) color = "#82ca9d";
                 else color = "#ffc658";
            } else {
                 // Overfitting simulation
                 if (pt.cluster === 1) color = "#8884d8";
                 else if (pt.cluster === 3) color = "#ffc658";
                 else color = (pt.x > 70) ? "#ff7300" : "#82ca9d"; // Split cluster 2
            }
        } else {
            // Outlier Logic
            // Calculate distance from center (50, 50) roughly
            const dist = Math.sqrt(Math.pow(pt.x - 50, 2) + Math.pow(pt.y - 50, 2));
            // Threshold slider: Lower value = Stricter (More outliers), Higher value = Loose
            // Let's invert for intuition: Slider High = Higher Sensitivity (More outliers detected)?
            // Actually prompt says "Threshold". Usually High Threshold = Less Outliers.
            // Let's say param is "Sensitivity". High param = More things are red.
            // If param is 1 (Low sensitivity), only extreme points (> 60 dist) are red.
            // If param is 10 (High sensitivity), points > 20 dist are red.
            
            const thresholdDist = 70 - (param * 5); 
            if (dist > thresholdDist) color = "#ff0000"; // Detected as outlier
            else color = "#82ca9d"; // Normal
        }

        return { ...pt, color };
    });
  }, [data, param, mode]);

  // Feedback Generation
  const feedback = useMemo(() => {
    if (mode === 'CLUSTERING') {
        if (param === 1) return {
            insight: "데이터가 너무 단순화되었습니다. (Underfitting)",
            desc: "모든 학생을 하나의 그룹으로 보면 개별 특성을 파악하기 어렵습니다. K를 늘려보세요."
        };
        if (param === 3) return {
            insight: "데이터의 패턴이 가장 명확하게 드러납니다. (Best Fit)",
            desc: "3개의 뚜렷한 그룹(예: 성실형, 벼락치기형, 꾸준형)으로 잘 나뉘었습니다. 해석하기 가장 좋습니다."
        };
        if (param > 3) return {
            insight: "그룹이 너무 잘게 쪼개졌습니다. (Overfitting)",
            desc: "비슷한 특성의 친구들까지 억지로 다른 그룹으로 나누고 있을 수 있습니다. 해석이 복잡해집니다."
        };
        return {
            insight: "그룹이 나뉘기 시작했지만, 아직 뭉쳐있는 데이터가 있습니다.",
            desc: "조금 더 세분화할 필요가 있어 보입니다."
        };
    } else {
        // Outlier
        if (param < 3) return {
            insight: "탐지 기준이 너무 느슨합니다.",
            desc: "진짜 이상치(센서 고장 등)를 놓치고 있을 수 있습니다. 민감도를 올려보세요."
        };
        if (param > 8) return {
            insight: "너무 많은 데이터가 이상치로 분류됩니다. (False Alarm)",
            desc: "정상적인 데이터까지 오류라고 판단하고 있습니다. 기준을 완화해야 합니다."
        };
        return {
            insight: "적절한 수준의 이상치 탐지입니다.",
            desc: "명확히 튀는 데이터(빨간점)들이 잘 포착되었습니다."
        };
    }
  }, [param, mode]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-1 bg-white p-4 rounded-xl shadow border border-slate-200 min-h-[400px]">
        <h3 className="text-lg font-bold mb-2 text-slate-700 text-center">
            {theme === ProjectTheme.STUDY ? '공부 시간 vs 수면 시간' : 
             theme === ProjectTheme.ENV ? '온도 vs 습도' : '대출 빈도 vs 체류 시간'}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Attribute A" unit="" domain={[0, 100]} hide />
            <YAxis type="number" dataKey="y" name="Attribute B" unit="" domain={[0, 100]} hide />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data Points" data={processedData}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="md:w-80 bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-6">
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {paramLabel}: <span className="text-indigo-600 text-lg">{param}</span>
            </label>
            <input 
                type="range" 
                min={minVal} 
                max={maxVal} 
                value={param} 
                onChange={(e) => setParam(Number(e.target.value))}
                className="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{minVal} (단순)</span>
                <span>{maxVal} (복잡)</span>
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
            <h4 className="font-bold text-indigo-900 mb-1">🔍 실험 결과</h4>
            <p className="font-semibold text-slate-800 text-sm mb-2">{feedback.insight}</p>
            <p className="text-slate-600 text-sm bg-slate-100 p-2 rounded">
                💡 {feedback.desc}
            </p>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
