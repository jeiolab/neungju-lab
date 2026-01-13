import React from 'react';
import { Globe, Lock, ShoppingCart, MessageSquare } from 'lucide-react';

const RealWorldTab: React.FC = () => {
  const examples = [
    {
      title: "HTTPS (웹 브라우징)",
      icon: Globe,
      desc: "우리가 매일 쓰는 인터넷 보안입니다.",
      mechanism: "접속할 때(Handshake)는 비대칭키로 안전하게 길을 트고, 실제 데이터 전송은 빠른 대칭키를 사용합니다. (하이브리드)",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "은행 로그인 / 공인인증서",
      icon: Lock,
      desc: "내가 나임을 증명해야 합니다.",
      mechanism: "개인키로 전자서명을 해서 보냅니다. 은행은 등록된 공개키로 서명을 확인하여 '본인임'을 인증합니다. (부인 방지)",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "비트코인 지갑",
      icon: ShoppingCart,
      desc: "내 돈을 남이 쓸 수 없어야 합니다.",
      mechanism: "지갑 주소는 '공개키'의 해시값이고, 송금 서명은 '개인키'로 합니다. 누구나 거래 내역의 무결성을 해시로 검증합니다.",
      color: "bg-amber-50 text-amber-600"
    },
    {
      title: "텔레그램 비밀대화",
      icon: MessageSquare,
      desc: "서버도 내용을 몰라야 합니다.",
      mechanism: "End-to-End 암호화(종단간 암호화). 대화 참여자 기기에서만 대칭키가 생성/저장되어 서버를 거쳐도 내용을 볼 수 없습니다.",
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <div className="space-y-6 pb-20">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-2">🌍 현실 적용 사례</h2>
        <p className="text-slate-600">교과서 이론이 실제 세상에선 이렇게 섞여서 쓰입니다.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {examples.map((ex, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`p-4 flex items-center gap-3 ${ex.color}`}>
              <ex.icon size={24} />
              <h3 className="font-bold text-lg">{ex.title}</h3>
            </div>
            <div className="p-5">
              <p className="font-medium text-slate-800 mb-2">{ex.desc}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{ex.mechanism}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealWorldTab;