import React, { useState } from 'react';
import { Users, Shuffle } from 'lucide-react';

const ROLES = [
  { name: 'PM (기획자)', desc: '문제 정의 및 전체 일정 관리' },
  { name: '데이터 수집가', desc: '데이터 소스 확보 및 라벨링' },
  { name: '데이터 분석가', desc: '전처리 및 데이터 탐색(EDA)' },
  { name: 'AI 엔지니어', desc: '모델 선정, 학습 및 튜닝' },
  { name: '테스터/발표자', desc: '모델 평가 및 최종 결과 발표' },
];

export const RoleRandomizer: React.FC = () => {
  const [assignedRoles, setAssignedRoles] = useState<{name: string, desc: string}[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const shuffleRoles = () => {
    setIsAnimating(true);
    setAssignedRoles([]);
    
    setTimeout(() => {
        const shuffled = [...ROLES].sort(() => Math.random() - 0.5);
        setAssignedRoles(shuffled);
        setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 p-6 rounded-2xl text-white shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Users className="w-5 h-5" /> 팀 역할 배정
        </h3>
        <button 
          onClick={shuffleRoles}
          disabled={isAnimating}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"
        >
          <Shuffle className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-3">
        {assignedRoles.length === 0 ? (
          <p className="text-white/80 text-sm text-center py-4">버튼을 눌러 역할을 배정하세요!</p>
        ) : (
          assignedRoles.map((role, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/10 animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
              <div className="font-bold text-sm text-yellow-300">팀원 {idx + 1}</div>
              <div className="font-semibold">{role.name}</div>
              <div className="text-xs text-white/70">{role.desc}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
