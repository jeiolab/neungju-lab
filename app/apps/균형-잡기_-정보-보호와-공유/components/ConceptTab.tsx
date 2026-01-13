import React from 'react';
import { Card } from './ui/UIComponents';
import { Shield, Share2, Scale } from 'lucide-react';

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">정보 보호와 공유, 왜 중요할까?</h2>
        <p className="text-slate-600">현대 사회의 딜레마를 이해하고 균형 잡힌 시각을 길러봅시다.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-blue-500">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto text-blue-600">
            <Share2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-center mb-3">정보 공유 (Sharing)</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            데이터를 활용하여 <strong>공익</strong>을 증진하고 생활의 <strong>편의</strong>를 높입니다.
          </p>
          <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
            <li>재난 상황 신속 전파</li>
            <li>맞춤형 서비스 제공</li>
            <li>공공 정책 투명성 확보</li>
          </ul>
        </Card>

        <Card className="border-t-4 border-red-500">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto text-red-600">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-center mb-3">정보 보호 (Protection)</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            개인의 <strong>사생활(Privacy)</strong>을 지키고 부당한 침해를 막습니다.
          </p>
          <ul className="text-sm text-slate-500 list-disc list-inside space-y-1">
            <li>개인정보 유출 방지</li>
            <li>사생활 감시 예방</li>
            <li>잊혀질 권리 보장</li>
          </ul>
        </Card>

        <Card className="border-t-4 border-purple-500">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto text-purple-600">
            <Scale size={24} />
          </div>
          <h3 className="text-xl font-bold text-center mb-3">트레이드오프 (Trade-off)</h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            하나를 얻으면 하나를 잃을 수 있습니다. 우리는 <strong>최적의 균형점</strong>을 찾아야 합니다.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
            <p className="font-semibold mb-1">💡 예시: CCTV 설치</p>
            <p>범죄 예방(공익) ▲ vs 사생활 노출(보호) ▼</p>
          </div>
        </Card>
      </div>

      <Card title="⚠️ 흔한 오해 교정 (Misconceptions)">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">X</div>
            <div>
              <p className="font-bold text-slate-800">"내 정보는 별거 아니니까 다 공개해도 돼."</p>
              <p className="text-sm text-slate-600">사소한 정보들이 모여 심각한 프로파일링 데이터가 될 수 있습니다.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">X</div>
            <div>
              <p className="font-bold text-slate-800">"공익을 위해서는 개인의 희생이 당연해."</p>
              <p className="text-sm text-slate-600">공익 목적이라도 '최소 수집 원칙'과 '적법한 절차'를 지켜야 합니다.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConceptTab;
