import React from 'react';
import { AlertTriangle, TrendingDown, EyeOff } from 'lucide-react';
import { CaseStudy } from '../types';

const CASES: CaseStudy[] = [
  {
    id: 'amazon',
    title: '아마존 채용 AI 폐기 사건',
    industry: '채용 (HR)',
    problem: '과거 10년치 이력서를 학습했는데, 남성 지원자가 압도적으로 많았음.',
    consequence: "'여성', '여대' 단어가 들어가면 감점하는 편향 발생. 결국 프로젝트 폐기.',",
    lesson: '데이터 불균형(Data Imbalance)이 편향을 만듭니다. 과거의 데이터는 과거의 차별을 담고 있을 수 있습니다.'
  },
  {
    id: 'zillow',
    title: '질로우(Zillow) 부동산 매입 AI 실패',
    industry: '부동산/금융',
    problem: '집값을 예측해 자동으로 집을 사들이는 AI 모델의 예측력 저하.',
    consequence: '시장 변동성을 반영 못해 비싸게 사고 싸게 팔아 5억 달러 손실. 직원 25% 감원.',
    lesson: 'AI 모델은 만능이 아닙니다. 외부 환경 변화(Covariate Shift)에 취약할 수 있으므로 인간의 검수가 필수적입니다.'
  },
  {
    id: 'gorillas',
    title: '구글 포토 고릴라 분류 사건',
    industry: '이미지 인식',
    problem: '흑인 사용자의 사진을 고릴라로 태깅함.',
    consequence: '심각한 인종차별 논란 발생. 특정 단어 태깅을 막는 미봉책으로 대응.',
    lesson: '학습 데이터의 다양성(Diversity) 부족이 치명적인 윤리적, 사회적 문제를 야기합니다.'
  }
];

const icons = {
    amazon: <TrendingDown className="text-red-500" />,
    zillow: <AlertTriangle className="text-orange-500" />,
    gorillas: <EyeOff className="text-slate-700" />
}

const TabCases: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">실제 AI 실패 사례와 교훈</h2>
      <div className="grid gap-6">
        {CASES.map(study => (
          <div key={study.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                    {icons[study.id as keyof typeof icons]}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{study.title}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{study.industry}</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-500">문제 원인</p>
                    <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm">{study.problem}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-500">결과</p>
                    <p className="text-slate-700 bg-red-50 p-3 rounded-lg text-sm">{study.consequence}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                    💡 교훈: {study.lesson}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabCases;