import React from 'react';
import { THEORY_CARDS } from '../constants';
import { Radio, Cpu, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Radio, Cpu, AlertTriangle
};

const Theory: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">트레이드오프(Trade-off)란?</h2>
        <p className="text-indigo-100 text-lg leading-relaxed">
            두 개의 목표를 동시에 달성할 수 없을 때, 한 쪽의 이득을 위해 다른 쪽을 희생해야 하는 결정을 의미합니다.
            스마트 조명 설계에서는 <strong>에너지 절약</strong>, <strong>사용자 편의성</strong>, 그리고 <strong>프라이버시</strong>가 서로 충돌할 수 있습니다.
            완벽한 정답은 없습니다. 상황에 맞는 최선의 균형(Balance)을 찾는 것이 공학자의 역할입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {THEORY_CARDS.map((card, idx) => {
          const Icon = iconMap[card.icon] || BookOpen;
          return (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">심화 학습: 센서 윤리와 사생활</h3>
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">1</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-700">데이터 수집의 최소화</h4>
                    <p className="text-sm text-slate-500">정말 필요한 정보만 수집해야 합니다. 단순히 불을 켜는 용도라면, 카메라(Camera)보다는 움직임만 감지하는 PIR 센서가 프라이버시 침해 위험이 훨씬 적습니다.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">2</span>
                </div>
                <div>
                    <h4 className="font-bold text-slate-700">고지 및 동의</h4>
                    <p className="text-sm text-slate-500">센서가 작동 중인 공간(특히 화장실, 탈의실 등) 앞에는 반드시 "자동 센서 작동 중"이라는 안내문을 부착하여 사용자가 인지할 수 있게 해야 합니다.</p>
                </div>
            </div>
        </div>
      </div>
      
      <div className="bg-slate-100 p-6 rounded-xl">
         <h3 className="text-lg font-bold text-slate-800 mb-2">생해볼 문제</h3>
         <ul className="list-disc list-inside text-slate-700 space-y-2">
            <li>만약 화장실에서 움직임이 없어서 불이 꺼진다면(False Negative), 사용자는 어떤 감정을 느낄까요? 이를 막기 위해 어떤 보조 센서를 쓸 수 있을까요?</li>
            <li>우리 학교 복도에는 몇 개의 센서가 필요할까요? 실제 학교 평면도를 보고 배치해봅시다.</li>
         </ul>
      </div>
    </div>
  );
};

export default Theory;
