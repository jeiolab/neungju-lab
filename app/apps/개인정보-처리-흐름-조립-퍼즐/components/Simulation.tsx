import React, { useState, useEffect } from 'react';
import { SimulationState } from '../types';
import { Shield, ShieldAlert, Clock, Unlock, Lock } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const Simulation: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    retentionPeriod: '1month',
    hasEncryption: false,
    hasAccessControl: false,
    isPseudonymized: false
  });

  const [metrics, setMetrics] = useState([
    { name: '유출 위험', value: 20, color: '#ef4444' },
    { name: '업무 편의', value: 50, color: '#3b82f6' },
  ]);

  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    calculateMetrics();
  }, [state]);

  const calculateMetrics = () => {
    let risk = 30; // base risk
    let convenience = 50; // base convenience

    // Retention Impact
    if (state.retentionPeriod === '1month') {
      risk -= 10;
      convenience -= 20; // Data might be gone when needed
    } else if (state.retentionPeriod === '1year') {
      risk += 10;
      convenience += 20;
    } else if (state.retentionPeriod === 'indefinite') {
      risk += 50; // High risk
      convenience += 30; // Always available
    }

    // Security Measures Impact
    if (state.hasEncryption) risk -= 20;
    else risk += 10;

    if (state.hasAccessControl) {
      risk -= 15;
      convenience -= 10; // Extra steps to access
    }

    if (state.isPseudonymized) {
      risk -= 25; // Significant risk reduction
      convenience -= 5; // Slightly harder to identify directly
    }

    // Clamp values 0-100
    risk = Math.max(0, Math.min(100, risk));
    convenience = Math.max(0, Math.min(100, convenience));

    setMetrics([
      { name: '유출 위험도', value: risk, color: risk > 70 ? '#ef4444' : risk > 40 ? '#f59e0b' : '#22c55e' },
      { name: '활용 편의성', value: convenience, color: '#3b82f6' }
    ]);

    generateFeedback(risk, convenience);
  };

  const generateFeedback = (risk: number, convenience: number) => {
    if (risk > 70) {
      setFeedback("위험 경고! 보유기간이 너무 길거나 보호 조치가 부족합니다. 해킹 시 대규모 피해가 우려됩니다.");
    } else if (risk < 30 && convenience < 40) {
      setFeedback("보안은 강력하지만, 데이터가 너무 빨리 사라지거나 접근이 어려워 업무 효율이 떨어질 수 있습니다.");
    } else if (risk < 40 && convenience > 60) {
      setFeedback("훌륭합니다! 안전하면서도 데이터를 효과적으로 활용할 수 있는 균형 잡힌 상태입니다.");
    } else {
      setFeedback("적절한 보호 조치를 추가하거나 불필요한 보관을 줄여보세요.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="text-blue-500" size={20} /> 보유 기간 설정
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(['1month', '1year', 'indefinite'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setState(prev => ({ ...prev, retentionPeriod: period }))}
                className={`py-3 px-2 rounded-lg text-sm font-medium border-2 transition-all
                  ${state.retentionPeriod === period 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                  }`}
              >
                {period === '1month' && '1개월 (단기)'}
                {period === '1year' && '1년 (일반)'}
                {period === 'indefinite' && '무기한 (위험)'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Shield className="text-indigo-500" size={20} /> 보호 조치 적용
          </h3>
          <div className="space-y-3">
            <Toggle 
              label="암호화 저장" 
              desc="DB 유출 시 내용을 볼 수 없게 만듦"
              checked={state.hasEncryption} 
              onChange={() => setState(p => ({ ...p, hasEncryption: !p.hasEncryption }))} 
            />
            <Toggle 
              label="접근 통제 시스템" 
              desc="인가된 직원만 정보에 접근 가능"
              checked={state.hasAccessControl} 
              onChange={() => setState(p => ({ ...p, hasAccessControl: !p.hasAccessControl }))} 
            />
            <Toggle 
              label="가명 처리" 
              desc="통계/연구 목적 활용 시 식별성 제거"
              checked={state.isPseudonymized} 
              onChange={() => setState(p => ({ ...p, isPseudonymized: !p.isPseudonymized }))} 
            />
          </div>
        </div>
      </div>

      {/* Output / Dashboard */}
      <div className="flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-grow">
          <h3 className="text-lg font-bold text-slate-800 mb-6">시뮬레이션 결과</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {metrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg border-l-4 flex gap-3 ${
            feedback.includes('위험') ? 'bg-red-50 border-red-500 text-red-800' :
            feedback.includes('훌륭') ? 'bg-green-50 border-green-500 text-green-800' :
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
             {feedback.includes('위험') ? <ShieldAlert className="flex-shrink-0" /> : <Shield className="flex-shrink-0" />}
             <p className="text-sm font-medium">{feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, desc, checked, onChange }: { label: string, desc: string, checked: boolean, onChange: () => void }) => (
  <div 
    onClick={onChange}
    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${checked ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${checked ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
        {checked ? <Lock size={16} /> : <Unlock size={16} />}
      </div>
      <div>
        <div className={`font-bold text-sm ${checked ? 'text-indigo-900' : 'text-slate-700'}`}>{label}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </div>
    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-indigo-500' : 'bg-slate-300'}`}>
      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </div>
  </div>
);

export default Simulation;