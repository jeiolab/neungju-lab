import React from 'react';
import { Lock, Shield, Smartphone, Eye, FileWarning, ExternalLink } from 'lucide-react';
import { SecurityTip } from '../types';

const tips: SecurityTip[] = [
  {
    title: "2단계 인증(2FA) 설정",
    content: "비밀번호가 털려도 안심! SMS나 인증 앱을 통한 2차 인증을 반드시 설정하세요. 네이버, 구글, 카카오 등 주요 계정에 필수입니다.",
    icon: "lock"
  },
  {
    title: "모바일 백신 실시간 감시",
    content: "V3, 알약 등 신뢰할 수 있는 모바일 백신을 설치하고 '실시간 감시' 기능을 켜두세요. 악성 앱 설치를 사전에 차단합니다.",
    icon: "shield"
  },
  {
    title: "출처 불명 앱 설치 차단",
    content: "설정 > 보안 > '출처를 알 수 없는 앱 설치'를 해제하세요. 문자 링크를 통해 다운로드되는 APK 파일은 99.9% 악성코드입니다.",
    icon: "smartphone"
  },
  {
    title: "스미싱 문자 식별법",
    content: "1. URL 주소 확인 (data-go.kr 등 미묘한 오타)\n2. 국제발신 표시\n3. 과도한 긴급성 조장 (즉시 확인 요망 등)",
    icon: "eye"
  }
];

const SecurityCenter: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-blue-400 mb-2">보안 센터 (Security Center)</h2>
        <p className="text-slate-400">화이트 해커가 전수하는 스마트폰 보안의 핵심 수칙입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-blue-500 transition shadow-lg group">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition">{tip.title}</h3>
              <div className="p-2 bg-slate-700 rounded-lg text-blue-400">
                {tip.icon === 'lock' && <Lock size={24} />}
                {tip.icon === 'shield' && <Shield size={24} />}
                {tip.icon === 'smartphone' && <Smartphone size={24} />}
                {tip.icon === 'eye' && <Eye size={24} />}
              </div>
            </div>
            <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">
              {tip.content}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-2xl mt-8">
        <div className="flex items-center gap-3 mb-4 text-red-400">
          <FileWarning size={28} />
          <h3 className="text-xl font-bold">최근 유행하는 스미싱 트렌드</h3>
        </div>
        <ul className="list-disc list-inside space-y-2 text-slate-300 ml-2">
            <li><strong className="text-red-300">부고 문자:</strong> "아버님께서 별세하셨기에 부고를 전합니다" + 악성 URL</li>
            <li><strong className="text-red-300">건강검진:</strong> "국민건강보험 본인부담금 환급금 신청하세요"</li>
            <li><strong className="text-red-300">쓰레기 무단투기:</strong> "폐기물 관리법 위반 과태료 고지서 발송"</li>
        </ul>
      </div>

      <div className="flex justify-center pt-8">
        <a 
          href="https://www.boho.or.kr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ExternalLink size={16} /> KISA 인터넷보호나라 바로가기
        </a>
      </div>
    </div>
  );
};

export default SecurityCenter;