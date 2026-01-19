import React from 'react';
import { Stethoscope, DollarSign, GraduationCap, Truck } from 'lucide-react';

export const LearnMoreTab: React.FC = () => {
  const cases = [
    {
      field: "의료 (Healthcare)",
      icon: <Stethoscope className="w-6 h-6 text-pink-500" />,
      title: "AI 의사 '왓슨'",
      desc: "환자의 증상과 MRI 데이터를 분석하여 질병을 진단하고 최적의 치료법을 제안합니다.",
      tags: ["이미지 인식", "빅데이터", "진단 보조"]
    },
    {
      field: "금융 (Finance)",
      icon: <DollarSign className="w-6 h-6 text-yellow-500" />,
      title: "로보 어드바이저",
      desc: "주식 시장의 변동 데이터를 실시간으로 감지하고, 알고리즘을 통해 자산을 자동으로 매매합니다.",
      tags: ["시계열 분석", "자동 매매", "리스크 관리"]
    },
    {
      field: "교육 (Education)",
      icon: <GraduationCap className="w-6 h-6 text-blue-500" />,
      title: "AI 튜터",
      desc: "학생의 문제 풀이 습관을 학습하여, 부족한 부분을 콕 집어주는 맞춤형 문제를 제공합니다.",
      tags: ["개인화 학습", "패턴 분석", "성취도 예측"]
    },
    {
      field: "물류 (Logistics)",
      icon: <Truck className="w-6 h-6 text-green-500" />,
      title: "키바 (Kiva) 로봇",
      desc: "아마존 물류 창고에서 물건의 위치를 파악하고, 최단 경로로 이동하여 작업자에게 전달합니다.",
      tags: ["경로 탐색", "군집 제어", "자율 주행"]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="md:col-span-2 text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">생활 속의 지능 에이전트</h2>
        <p className="text-slate-500">다양한 분야에서 활약하는 에이전트들을 만나보세요.</p>
      </div>
      
      {cases.map((item, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-slate-50 rounded-lg mr-3">{item.icon}</div>
            <h3 className="text-lg font-bold text-slate-800">{item.field}</h3>
          </div>
          <h4 className="text-xl font-bold text-blue-600 mb-2">{item.title}</h4>
          <p className="text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};