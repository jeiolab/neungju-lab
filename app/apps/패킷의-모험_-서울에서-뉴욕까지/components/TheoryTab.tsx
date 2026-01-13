import React from 'react';
import { Package, Router, Network, Globe, Share2 } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const cards = [
    {
      title: "패킷 (Packet)",
      icon: <Package className="text-yellow-500" size={32} />,
      content: "인터넷으로 전송되는 데이터의 작은 조각입니다. 큰 파일도 작은 패킷으로 쪼개져서 전송된 후 목적지에서 다시 조립됩니다."
    },
    {
      title: "라우터 (Router)",
      icon: <Router className="text-blue-500" size={32} />,
      content: "패킷이 목적지까지 가는 최적의 경로를 찾아주는 '교통경찰'입니다. 여러 네트워크를 연결하는 관문 역할을 합니다."
    },
    {
      title: "DNS",
      icon: <Globe className="text-green-500" size={32} />,
      content: "Domain Name System. 사람이 읽기 쉬운 주소(google.com)를 컴퓨터가 이해하는 IP 주소(142.250.x.x)로 바꿔주는 전화번호부입니다."
    },
    {
      title: "스위치 (Switch)",
      icon: <Share2 className="text-purple-500" size={32} />,
      content: "같은 네트워크 안에서 기기들을 연결해주는 장비입니다. 데이터가 정확한 기기로 가도록 돕습니다."
    },
    {
      title: "광케이블",
      icon: <Network className="text-red-500" size={32} />,
      content: "빛의 신호로 데이터를 전송하는 케이블입니다. 바다 밑 해저 광케이블을 통해 대륙 간 인터넷이 연결됩니다."
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">네트워크 핵심 용어</h2>
        <p className="text-slate-500">데이터 배달부가 되기 위해 꼭 알아야 할 기본 지식입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all shadow-sm group">
            <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
        <h3 className="text-lg font-bold text-blue-600 mb-2">알고 계셨나요?</h3>
        <p className="text-slate-700 text-sm">
          우리가 보내는 카카오톡 메시지도 사실 수많은 '패킷'으로 쪼개져서 해저 광케이블을 타고 
          순식간에 지구 반대편 서버로 이동했다가 친구에게 도착하는 것이랍니다!
        </p>
      </div>
    </div>
  );
};

export default TheoryTab;