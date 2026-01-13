import React from 'react';
import { Card } from './ui/UIComponents';
import { CheckSquare, Info } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">더 알아보기: 전문가 체크리스트</h2>
        <p className="text-slate-600">의사결정을 내릴 때 꼭 확인해야 할 핵심 기준들입니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="👍 정보 공유의 장점 (Pros)" className="border-l-4 border-blue-500">
            <ul className="space-y-3">
                {[
                    "공공 안전 확보 (재난, 범죄 예방)",
                    "생활 편의성 증대 (맞춤형 추천, 빠른 서비스)",
                    "사회적 투명성 강화 (행정 감시, 알 권리)",
                    "기술 및 연구 발전 (AI 학습, 의료 연구)"
                ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-slate-700 text-sm">
                        <span className="text-blue-500 font-bold">{i+1}.</span> {item}
                    </li>
                ))}
            </ul>
        </Card>

        <Card title="🛡️ 정보 보호의 필요성 (Cons if ignored)" className="border-l-4 border-red-500">
             <ul className="space-y-3">
                {[
                    "프라이버시 침해 및 감시 사회 우려",
                    "개인정보 유출로 인한 2차 피해 (보이스피싱)",
                    "사회적 낙인 효과 (특정인 식별)",
                    "데이터 독점으로 인한 불평등 심화"
                ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-slate-700 text-sm">
                        <span className="text-red-500 font-bold">{i+1}.</span> {item}
                    </li>
                ))}
            </ul>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-none">
        <div className="flex items-start gap-4">
            <CheckSquare className="w-8 h-8 text-green-400 shrink-0" />
            <div>
                <h3 className="text-xl font-bold mb-4">✅ 의사결정 체크리스트 (PIA: Privacy Impact Assessment 간소화)</h3>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-300">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
                        수집 목적이 명확하고 정당한가?
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
                        필요한 최소한의 정보만 수집하는가?
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
                        정보 주체의 동의를 구했는가?
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
                        익명화/가명화 조치를 취했는가?
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded accent-green-500" />
                        유출 시 피해 복구 방안이 있는가?
                    </label>
                </div>
            </div>
        </div>
      </Card>

       <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 text-sm">
            <Info className="w-5 h-5 shrink-0" />
            <p>
                <strong>팁:</strong> 현실에서는 "모 아니면 도"가 없습니다. 
                대부분의 경우 <strong>'조건부 공유'</strong>(특정인에게만, 특정 기간동안만, 비식별화해서)가 정답에 가깝습니다.
            </p>
        </div>
    </div>
  );
};

export default DeepDiveTab;
