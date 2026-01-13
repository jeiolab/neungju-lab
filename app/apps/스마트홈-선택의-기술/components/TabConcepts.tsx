import React from 'react';
import { Shield, Smartphone, Lock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

interface TabConceptsProps {
  privacySensitivity: number;
  setPrivacySensitivity: (val: number) => void;
  markCompleted: () => void;
}

const TabConcepts: React.FC<TabConceptsProps> = ({ privacySensitivity, setPrivacySensitivity, markCompleted }) => {
  
  React.useEffect(() => {
    markCompleted();
  }, [markCompleted]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <Smartphone className="text-blue-500" />
          IoT가 가져온 변화
        </h2>
        <p className="text-slate-600 mb-6">
          사물인터넷(IoT)은 우리 삶을 혁신적으로 편리하게 만들지만, 동시에 새로운 위험도 가져왔습니다.
          이 두 가지 측면을 모두 이해해야 현명한 사용자가 될 수 있습니다.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center gap-2">
              <CheckCircle size={20} />
              빛 (혜택)
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> <strong>편의성:</strong> 원격 제어, 자동화로 가사 노동 감소</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> <strong>안전:</strong> 가스 차단, 침입 감지로 물리적 위험 예방</li>
              <li className="flex gap-2 items-start"><span className="text-blue-500">•</span> <strong>효율:</strong> 에너지 절약 및 건강 데이터 관리</li>
            </ul>
          </div>

          <div className="bg-red-50 p-5 rounded-xl border border-red-100">
            <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={20} />
              그림자 (위험)
            </h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex gap-2 items-start"><span className="text-red-500">•</span> <strong>프라이버시:</strong> 사생활 영상/음성 유출 가능성</li>
              <li className="flex gap-2 items-start"><span className="text-red-500">•</span> <strong>보안 취약:</strong> 해킹 시 도어락 무단 개방 등 위험</li>
              <li className="flex gap-2 items-start"><span className="text-red-500">•</span> <strong>의존성:</strong> 인터넷 장애 시 기능 마비</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <Eye className="text-purple-500" />
          나의 프라이버시 기준 설정
        </h2>
        <p className="text-slate-600 mb-6">
          당신은 개인정보 보호에 대해 얼마나 민감한가요? 이 설정은 다음 단계(시뮬레이션)의 경고 기준이 됩니다.
        </p>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm font-medium text-slate-500">
            <span>편리하면 OK (둔감)</span>
            <span>매우 중요 (민감)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={privacySensitivity}
            onChange={(e) => setPrivacySensitivity(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="text-center font-bold text-purple-700 text-lg">
            민감도: {privacySensitivity}%
          </div>
          <div className="bg-slate-100 p-4 rounded-lg text-sm text-slate-600">
            {privacySensitivity < 30 && "편의성을 위해 데이터를 기꺼이 제공하는 타입이군요."}
            {privacySensitivity >= 30 && privacySensitivity < 70 && "편리함과 안전 사이의 균형을 중요하게 생각하시네요."}
            {privacySensitivity >= 70 && "나의 데이터는 내가 지킨다! 보안을 최우선으로 고려하는 타입입니다."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabConcepts;