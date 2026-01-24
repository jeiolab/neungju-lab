import React from 'react';
import { Package, Map, FileText, Globe } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const concepts = [
    {
      title: "패킷 (Packet)",
      icon: <Package className="w-8 h-8 text-blue-500" />,
      desc: "큰 데이터를 전송하기 쉽게 작게 쪼갠 조각입니다. 마치 이삿짐을 여러 개의 박스에 나누어 담는 것과 같습니다.",
      detail: "각 패킷에는 데이터 조각뿐만 아니라 출발지, 도착지, 순서 번호(Sequence Number)가 적힌 '운송장'이 붙어 있습니다."
    },
    {
      title: "프로토콜 (Protocol)",
      icon: <FileText className="w-8 h-8 text-green-500" />,
      desc: "데이터를 주고받기 위한 약속이나 규칙입니다. 택배 회사마다 송장 양식과 배송 절차가 있는 것과 비슷합니다.",
      detail: "TCP/IP는 인터넷에서 가장 널리 쓰이는 프로토콜로, '배송 보증(TCP)'과 '주소 체계(IP)'를 담당합니다."
    },
    {
      title: "IP 주소 (IP Address)",
      icon: <Map className="w-8 h-8 text-purple-500" />,
      desc: "인터넷 상의 컴퓨터 위치를 나타내는 고유한 주소입니다. 집 주소(예: 서울시 강남구...)와 같은 역할을 합니다.",
      detail: "패킷은 이 주소를 보고 복잡한 인터넷 망 속에서 정확한 목적지를 찾아갑니다."
    },
    {
      title: "라우팅 (Routing)",
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      desc: "목적지까지 가는 최적의 경로를 찾는 과정입니다. 내비게이션이 막히는 길을 피해 빠른 길을 알려주는 것과 같습니다.",
      detail: "라우터(Router)라는 장비가 이 역할을 수행하며, 네트워크 혼잡 상황에 따라 경로를 실시간으로 변경하기도 합니다."
    }
  ];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">데이터 물류 시스템 기초</h2>
        <p className="text-slate-600">서울에서 하버드까지, 여러분의 데이터는 어떻게 이동할까요?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-full">
                {concept.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{concept.title}</h3>
            </div>
            <p className="text-slate-700 font-medium mb-2">{concept.desc}</p>
            <p className="text-sm text-slate-500 leading-relaxed">{concept.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-8">
        <h3 className="text-lg font-bold text-blue-800 mb-2">💡 교과서 예시: 서울 -> 하버드</h3>
        <p className="text-blue-700">
          여러분이 서울에서 찍은 사진을 미국 하버드 대학에 있는 친구에게 보낸다고 상상해 보세요.
          사진 한 장(큰 데이터)은 수백 개의 패킷(작은 상자)으로 쪼개집니다. 
          어떤 패킷은 태평양 해저 케이블을 타고, 어떤 패킷은 위성을 통할 수도 있습니다. 
          각각 다른 길로 가더라도, 도착지(하버드)에서는 순서대로 다시 조립되어 온전한 사진이 됩니다.
        </p>
      </div>
    </div>
  );
};

export default TheoryTab;
