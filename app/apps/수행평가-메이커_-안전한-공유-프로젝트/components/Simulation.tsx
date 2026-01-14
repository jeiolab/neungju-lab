import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info, AlertTriangle, Users } from 'lucide-react';

export const Simulation: React.FC = () => {
  const [scope, setScope] = useState(50); // 0 to 100

  // Simulation logic
  // Collaboration goes up linearly with scope
  // Risk goes up exponentially with scope
  const data = [];
  for (let i = 0; i <= 100; i += 10) {
    data.push({
      name: i + '%',
      scope: i,
      collaboration: Math.min(100, i * 1.2), // Collaboration benefits saturate
      risk: Math.pow(i / 10, 2) // Risk increases quadratically
    });
  }

  // Current values based on slider
  const currentRisk = Math.pow(scope / 10, 2);
  const currentCollab = Math.min(100, scope * 1.2);

  let feedback = "";
  let feedbackColor = "";

  if (scope < 30) {
    feedback = "🔒 너무 폐쇄적입니다. 정보 보호는 완벽하지만, 협업을 통한 발전이 어렵습니다.";
    feedbackColor = "text-gray-600";
  } else if (scope > 80) {
    feedback = "🚨 위험합니다! 정보가 너무 널리 퍼져 개인정보 유출이나 악용 가능성이 매우 높습니다.";
    feedbackColor = "text-red-600";
  } else {
    feedback = "✨ 균형 잡힌 상태입니다! 적절한 공유로 가치를 높이면서도 위험을 관리하고 있습니다.";
    feedbackColor = "text-green-600";
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">공유 범위 시뮬레이션</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-md">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: '공유 범위', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[0, 120]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="collaboration" stroke="#3b82f6" name="협업 효율 & 가치" strokeWidth={3} />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" name="보안 사고 위험" strokeWidth={3} />
              <ReferenceLine x={scope + '%'} stroke="green" strokeDasharray="3 3" label="현재 설정" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Users className="mr-2 text-blue-600"/> 
              공유 범위 설정
            </h3>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={scope} 
              onChange={(e) => setScope(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>나만 보기</span>
              <span>반 친구들</span>
              <span>학교 전체</span>
              <span>전 세계(인터넷)</span>
            </div>
            
            <div className="mt-6 space-y-3">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">협업 가치:</span>
                 <div className="w-32 bg-gray-200 rounded-full h-2.5">
                   <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${currentCollab}%` }}></div>
                 </div>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">사고 위험:</span>
                 <div className="w-32 bg-gray-200 rounded-full h-2.5">
                   <div className={`h-2.5 rounded-full ${currentRisk > 80 ? 'bg-red-600' : 'bg-orange-400'}`} style={{ width: `${Math.min(100, currentRisk)}%` }}></div>
                 </div>
               </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-l-4 ${scope > 80 ? 'bg-red-50 border-red-500' : scope < 30 ? 'bg-gray-100 border-gray-500' : 'bg-green-50 border-green-500'}`}>
            <h4 className="font-bold mb-2 flex items-center">
              <Info className="mr-2" size={18}/>
              AI 피드백
            </h4>
            <p className={`text-sm font-medium ${feedbackColor}`}>
              {feedback}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};