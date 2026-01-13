import React, { useState, useMemo } from 'react';
import { IOT_FEATURES } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
// Added Shield to imports
import { AlertTriangle, Check, RotateCcw, Shield } from 'lucide-react';

interface TabSimulationProps {
  selectedFeatures: string[];
  setSelectedFeatures: (ids: string[]) => void;
  privacySensitivity: number;
  addBadge: (badge: string) => void;
}

const TabSimulation: React.FC<TabSimulationProps> = ({ selectedFeatures, setSelectedFeatures, privacySensitivity, addBadge }) => {
  const [showResult, setShowResult] = useState(false);

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(fId => fId !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const stats = useMemo(() => {
    let conv = 0;
    let safe = 0;
    let risk = 0;

    selectedFeatures.forEach(id => {
      const feature = IOT_FEATURES.find(f => f.id === id);
      if (feature) {
        conv += feature.scores.convenience;
        safe += feature.scores.safety;
        risk += feature.scores.privacyRisk;
      }
    });

    return { conv, safe, risk };
  }, [selectedFeatures]);

  const chartData = [
    { subject: '편의성', A: stats.conv, fullMark: 50 },
    { subject: '물리적 안전', A: stats.safe, fullMark: 50 },
    { subject: '프라이버시 위험', A: stats.risk, fullMark: 50 },
  ];

  const sensitivityFactor = privacySensitivity / 100;
  // 위험 점수가 높을수록 감점 폭이 커짐 (민감도에 따라)
  const balanceScore = Math.max(0, Math.round((stats.conv + stats.safe) * 2 - (stats.risk * (1 + sensitivityFactor) * 2)));

  const analyzeResult = () => {
    if (balanceScore > 80) {
      addBadge('균형의 달인');
      return { msg: "완벽한 균형입니다! 편의성과 안전을 챙기면서 위험도 잘 관리했네요.", color: "text-green-600" };
    }
    if (stats.risk > 30 && privacySensitivity > 70) {
      addBadge('위험 감지자');
      return { msg: "경고: 당신의 민감도에 비해 프라이버시 위험이 너무 높습니다. 카메라나 음성 기기를 줄여보세요.", color: "text-red-600" };
    }
    if (stats.conv < 10) {
      return { msg: "너무 보수적이네요. IoT의 혜택인 편의성을 조금 더 누려보세요.", color: "text-orange-600" };
    }
    return { msg: "나쁘지 않습니다. 하지만 '나의 원칙'을 세워 위험을 조금 더 줄일 수 있는지 고민해보세요.", color: "text-blue-600" };
  };

  const resultAnalysis = analyzeResult();

  // Principles Generator Logic
  const myPrinciples = useMemo(() => {
    const principles = [];
    if (stats.risk > 25) principles.push("불필요한 데이터 수집 거부하기");
    if (selectedFeatures.some(id => ['ai_speaker', 'indoor_cam', 'robot_cleaner'].includes(id))) principles.push("카메라/마이크 끄는 시간 정하기");
    if (stats.safe > 20) principles.push("보안 업데이트 자동화 켜기");
    if (principles.length === 0) principles.push("새로운 기기 도입 전 득실 따져보기");
    return principles;
  }, [selectedFeatures, stats]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 animate-fade-in">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">기기 선택하기</h2>
            <span className="text-sm text-slate-500">{selectedFeatures.length}개 선택됨</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {IOT_FEATURES.map((feature) => (
              <div
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  selectedFeatures.includes(feature.id)
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-slate-100 hover:border-indigo-200 bg-white'
                }`}
              >
                <div className={`mt-1 p-2 rounded-full ${selectedFeatures.includes(feature.id) ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{feature.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{feature.description}</p>
                  <div className="flex gap-2 mt-2 text-[10px] font-medium text-slate-400">
                    <span>편의 {feature.scores.convenience}</span>
                    <span>안전 {feature.scores.safety}</span>
                    <span className="text-red-400">위험 {feature.scores.privacyRisk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">트레이드오프 분석</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} />
                <Radar
                  name="내 선택"
                  dataKey="A"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="#818cf8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700">균형 점수</span>
                <span className="text-2xl font-black text-indigo-600">{balanceScore}점</span>
             </div>
             <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(balanceScore, 100)}%` }}></div>
             </div>
          </div>
          
          <div className="mt-4 text-center">
             <p className={`font-medium ${resultAnalysis.color}`}>{resultAnalysis.msg}</p>
          </div>
        </div>

        {selectedFeatures.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              나의 스마트홈 원칙 카드
            </h3>
            <ul className="space-y-2">
              {myPrinciples.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm bg-white/20 p-2 rounded-lg">
                   <Check className="w-4 h-4 text-green-300" /> {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSimulation;