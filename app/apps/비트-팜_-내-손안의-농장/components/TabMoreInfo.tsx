import React from 'react';
import { Plane, Cpu, Network } from 'lucide-react';

const InfoCard = ({ icon: Icon, title, content, image }: { icon: any, title: string, content: string, image: string }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col md:flex-row">
    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
    </div>
    <div className="p-6 md:w-2/3">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="text-green-600" size={24} />
        <h3 className="text-xl font-bold text-stone-800">{title}</h3>
      </div>
      <p className="text-stone-600 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  </div>
);

export const TabMoreInfo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-4">
       <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">미래 농업 기술</h2>
        <p className="text-stone-600">스마트 팜은 앞으로 어떻게 발전할까요?</p>
      </div>

      <InfoCard 
        icon={Plane}
        title="농업용 드론 (Drone)"
        image="https://picsum.photos/id/202/400/300"
        content={`드론은 하늘을 날아다니며 넓은 농장을 관리합니다.
        
        1. 모니터링: 고성능 카메라로 식물의 건강 상태를 한눈에 파악해요.
        2. 방제 작업: 농약이나 비료를 필요한 곳에만 정확하게 뿌려요.
        3. 파종: 씨앗을 공중에서 뿌려 심는 기술도 개발되고 있답니다.`}
      />

      <InfoCard 
        icon={Cpu}
        title="AI 수확 로봇"
        image="https://picsum.photos/id/96/400/300"
        content={`잘 익은 과일만 골라서 따는 것은 아주 어려운 일이에요.
        하지만 인공지능 로봇은 카메라 눈으로 과일의 색깔과 크기를 분석해서, '지금 따야 할 과일'을 정확히 찾아냅니다.
        사람처럼 부드러운 로봇 손으로 과일을 상처 없이 수확할 수 있어요.`}
      />

      <InfoCard 
        icon={Network}
        title="초연결 농장 (Hyper-connected Farm)"
        image="https://picsum.photos/id/60/400/300"
        content={`전 세계의 농장이 네트워크로 연결된다면 어떨까요?
        
        한국의 스마트 팜 데이터를 분석해 아프리카의 농업을 도울 수도 있습니다. 모든 센서와 기계가 5G 통신으로 실시간 연결되어, 농장 주인이 지구 반대편에 있어도 농장을 완벽하게 관리할 수 있는 세상이 오고 있어요.`}
      />
    </div>
  );
};
