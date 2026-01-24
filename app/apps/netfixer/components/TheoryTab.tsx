import React from 'react';
import { Wifi, ShieldAlert, Activity, ArrowRightLeft } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const cards = [
    {
      title: "신호 감쇄 (Signal Attenuation)",
      icon: <Wifi className="text-blue-500" size={32} />,
      content: "와이파이 신호는 장애물을 통과할 때 약해집니다. 콘크리트 벽이나 어항(물)은 신호를 크게 흡수합니다. 5GHz는 속도가 빠르지만, 2.4GHz에 비해 도달 거리가 짧고 벽 투과율이 낮습니다.",
      tips: ["공유기는 집 중앙 개방된 곳에 설치", "구석이나 TV 뒤는 피할 것", "먼 방에서는 2.4GHz 사용"]
    },
    {
      title: "주파수 간섭 (Interference)",
      icon: <Activity className="text-red-500" size={32} />,
      content: "2.4GHz 대역은 전자레인지, 블루투스, 이웃집 와이파이 등으로 붐빕니다. 간섭이 생기면 속도가 저하되고 끊김이 발생합니다. 5GHz는 채널이 많고 간섭이 적습니다.",
      tips: ["와이파이 채널 변경", "가능하면 5GHz 사용", "전자레인지 근처 피하기"]
    },
    {
      title: "대역폭 vs 지연 시간 (Bandwidth vs Latency)",
      icon: <ArrowRightLeft className="text-green-500" size={32} />,
      content: "대역폭은 도로의 넓이(데이터 양)이고, 지연 시간은 이동 시간(반응 속도)입니다. 스트리밍은 대역폭이 중요하고, 게임은 낮은 지연 시간(Ping)이 중요합니다.",
      tips: ["QoS 설정으로 중요 트래픽 우선순위 지정", "게임은 유선 LAN 권장", "업로드 속도 확인"]
    },
    {
      title: "네트워크 보안 (Security)",
      icon: <ShieldAlert className="text-orange-500" size={32} />,
      content: "개방형 와이파이는 해커가 데이터를 훔쳐보기 쉽습니다(패킷 스니핑). WPA2/WPA3 암호화 방식을 사용해야 안전합니다. 공유기 초기 비밀번호는 보안에 취약합니다.",
      tips: ["강력한 WPA2/3 비밀번호 설정", "WPS 기능 끄기", "공유기 펌웨어 주기적 업데이트"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">네트워크 지식 창고</h2>
        <p className="text-slate-500 mt-2">최고의 네트워크 해결사가 되기 위한 기초 지식을 습득하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{card.title}</h3>
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed break-keep">
              {card.content}
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">전문가 팁</h4>
              <ul className="list-disc list-inside text-sm text-blue-900 space-y-1">
                {card.tips.map((tip, tIdx) => (
                  <li key={tIdx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheoryTab;