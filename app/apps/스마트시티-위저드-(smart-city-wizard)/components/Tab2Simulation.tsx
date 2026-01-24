import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface Props {
  onComplete: () => void;
}

export const Tab2Simulation: React.FC<Props> = ({ onComplete }) => {
  const [density, setDensity] = useState(30); // 1-100
  const [threshold, setThreshold] = useState(50); // 1-100
  const [data, setData] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");

  // Simple simulation logic
  useEffect(() => {
    // Detection Rate increases with density, decreases slightly if threshold is too high (missed events)
    // False Alarm increases if threshold is too low
    const trueDetection = Math.min(100, (density * 1.2) * (1 - (threshold - 20) / 200));
    const falseAlarm = Math.max(0, (100 - threshold) * (density / 50));
    
    // Normalize logic for demo
    const detectionRate = Math.min(100, Math.max(0, density + (50 - threshold)/2));
    const noise = Math.max(0, (100 - threshold) * 0.8 + (density * 0.2));

    const newData = [
      { name: '감지 성공률', value: Math.round(detectionRate), fill: '#4f46e5' },
      { name: '오작동(노이즈)', value: Math.round(noise), fill: '#ef4444' },
    ];
    setData(newData);

    // Feedback Logic
    if (detectionRate > 85 && noise < 20) {
      setFeedback("🎉 최적의 설정입니다! 센서도 충분하고 기준값도 적절해요. (+10 XP)");
      onComplete();
    } else if (detectionRate < 50) {
      setFeedback("⚠️ 감지율이 너무 낮습니다. 센서를 더 설치하거나(밀도↑) 기준값(임계값)을 낮춰보세요.");
    } else if (noise > 50) {
      setFeedback("⚠️ 오작동이 너무 많습니다. 알림이 너무 자주 울려요! 기준값(임계값)을 높여보세요.");
    } else {
      setFeedback("🤔 나쁘지 않지만, 조금 더 조정해보면 어떨까요?");
    }
  }, [density, threshold]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-indigo-800">2. IoT 센서 시뮬레이터</h2>
      <p className="text-slate-600 mb-8">
        화재 감지 센서를 설치한다고 상상해보세요. 센서의 개수(밀도)와 알림이 울리는 기준(임계값)을 조절하여 
        <span className="font-bold text-indigo-600"> 가장 효율적인 시스템</span>을 만들어보세요.
      </p>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Controls */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-xl shadow border border-slate-200 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              센서 밀도 (설치 개수): {density}개
            </label>
            <input 
              type="range" min="1" max="100" value={density} 
              onChange={(e) => setDensity(Number(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-1">센서가 많으면 감지는 잘 되지만 비용이 비싸져요.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              알림 임계값 (민감도): {threshold}
            </label>
            <input 
              type="range" min="1" max="100" value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
             <p className="text-xs text-slate-500 mt-1">
               낮으면 작은 변화에도 울리고(민감), 높으면 큰 변화에만 울려요(둔감).
             </p>
          </div>

          <div className={`p-4 rounded-lg font-medium text-sm border ${feedback.includes('🎉') ? 'bg-green-50 text-green-800 border-green-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {feedback}
          </div>
        </div>

        {/* Chart */}
        <div className="w-full md:w-2/3 h-80 bg-white p-6 rounded-xl shadow border border-slate-200 flex flex-col items-center justify-center">
            <h3 className="text-lg font-bold text-slate-800 mb-4">실험 결과</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="수치 (%)" barSize={40} radius={[0, 10, 10, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};