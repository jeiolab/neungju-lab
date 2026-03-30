import React, { useState } from 'react';
import { BookOpen, Repeat, ShieldCheck, DoorOpen } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  icon: React.ReactNode;
  frontDesc: string;
  backDesc: string;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ title, icon, frontDesc, backDesc }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-64 w-full cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-white shadow-lg p-6 flex flex-col items-center justify-center backface-hidden border-2 border-blue-100 hover:border-blue-300">
          <div className="mb-4 text-blue-600">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-sm text-slate-500 text-center">{frontDesc}</p>
          <div className="mt-4 text-xs text-blue-400 font-medium">클릭해서 뒤집기 ↻</div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-blue-600 shadow-lg p-6 flex flex-col items-center justify-center rotate-y-180 backface-hidden">
          <h3 className="text-xl font-bold text-white mb-4">{title} 상세 설명</h3>
          <p className="text-white text-center leading-relaxed font-medium">
            {backDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TabConcepts: React.FC = () => {
  const concepts = [
    {
      title: "IP 주소",
      icon: <span className="text-4xl font-mono font-bold">IP</span>,
      frontDesc: "인터넷 세상의 우리 집 주소",
      backDesc: "컴퓨터가 서로 통신하기 위해 갖는 고유한 번호입니다. (예: 192.168.0.1) 우편물을 받을 때 주소가 필요한 것과 같아요."
    },
    {
      title: "서브넷 마스크",
      icon: <ShieldCheck size={48} />,
      frontDesc: "우리 동네의 범위를 정하는 칸막이",
      backDesc: "IP 주소에서 어디까지가 '네트워크(동네)'이고, 어디부터가 '내 컴퓨터(집)'인지 구분해주는 역할을 합니다. (보통 255.255.255.0)"
    },
    {
      title: "게이트웨이",
      icon: <DoorOpen size={48} />,
      frontDesc: "인터넷 세상으로 나가는 대문",
      backDesc: "우리 집 네트워크(LAN)에서 외부 인터넷(WAN)으로 나갈 때 거쳐야 하는 라우터(공유기)의 주소입니다."
    },
    {
      title: "DHCP",
      icon: <Repeat size={48} />,
      frontDesc: "주소를 자동으로 할당해주는 도우미",
      backDesc: "사용자가 일일이 IP를 입력하지 않아도, 자동으로 비어있는 IP를 찾아 할당해주는 편리한 프로토콜입니다."
    }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">네트워크 기초 개념 익히기</h2>
        <p className="text-slate-600 mt-2">카드를 클릭하여 핵심 용어를 학습해보세요.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {concepts.map((concept, idx) => (
          <ConceptCard key={idx} {...concept} />
        ))}
      </div>
    </div>
  );
};