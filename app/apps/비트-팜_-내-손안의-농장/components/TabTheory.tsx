import React from 'react';
import { Cpu, Radio, Thermometer, Wind } from 'lucide-react';

const TheoryCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
  <div className={`p-6 rounded-xl border-2 ${color} bg-white shadow-sm hover:shadow-md transition-shadow`}>
    <div className="flex items-center gap-4 mb-3">
      <div className={`p-3 rounded-full bg-opacity-20 ${color.replace('border-', 'bg-')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-').replace('-200', '-600')}`} />
      </div>
      <h3 className="font-bold text-lg text-stone-800">{title}</h3>
    </div>
    <p className="text-stone-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

export const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in p-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2">스마트 팜 기초 이론</h2>
        <p className="text-stone-600">식물을 똑똑하게 키우기 위한 3가지 핵심 요소와 통신 기술을 알아봐요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <TheoryCard 
          icon={Thermometer} 
          title="1. 센서 (입력장치)" 
          desc="사람의 눈, 코, 피부와 같아요. 농장의 온도, 습도, 빛의 세기 등 환경 정보를 읽어들여서 전기 신호로 바꿔줍니다. (예: 토양 수분 센서, 온도 센서)"
          color="border-blue-200"
        />
        <TheoryCard 
          icon={Cpu} 
          title="2. 프로세서 (두뇌)" 
          desc="센서가 보낸 정보를 받아서 판단을 내려요. '물이 부족하네? 펌프를 켜자!'라고 명령을 내리는 역할을 합니다. 마이크로비트가 바로 이 역할을 해요."
          color="border-yellow-200"
        />
        <TheoryCard 
          icon={Wind} 
          title="3. 액추에이터 (출력장치)" 
          desc="프로세서의 명령을 받아 실제로 일을 하는 장치예요. 물을 주는 펌프, 바람을 일으키는 팬, 빛을 내는 LED 등이 있습니다."
          color="border-red-200"
        />
        <TheoryCard 
          icon={Radio} 
          title="라디오 통신 (무선 연결)" 
          desc="넓은 농장에서는 선을 연결하기 힘들어요. 마이크로비트의 라디오 기능을 쓰면 무선으로 데이터를 주고받을 수 있어요. 단, '그룹 ID'가 같아야 서로 대화할 수 있답니다!"
          color="border-purple-200"
        />
      </div>

      <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-6">
        <h3 className="font-bold text-green-800 mb-3 text-lg">💡 스마트 팜의 작동 원리</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-medium text-stone-700">
          <div className="bg-white p-3 rounded shadow text-center flex-1 w-full">환경 변화<br/>(흙이 마름)</div>
          <div className="text-green-500">➜</div>
          <div className="bg-white p-3 rounded shadow text-center flex-1 w-full">센서 감지<br/>(수분 값 감소)</div>
          <div className="text-green-500">➜</div>
          <div className="bg-white p-3 rounded shadow text-center flex-1 w-full">프로세서 판단<br/>(물주기 명령)</div>
          <div className="text-green-500">➜</div>
          <div className="bg-white p-3 rounded shadow text-center flex-1 w-full">액추에이터 작동<br/>(펌프 ON)</div>
        </div>
      </div>
    </div>
  );
};
