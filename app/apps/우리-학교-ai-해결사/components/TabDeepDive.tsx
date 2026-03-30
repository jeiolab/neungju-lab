import React from 'react';
import { Tv, Cpu, Car } from 'lucide-react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
       <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">실생활 속 AI 파헤치기</h2>
        <p className="text-slate-600 mt-2">우리가 매일 쓰는 서비스 뒤에는 어떤 기계학습이 숨어 있을까요?</p>
      </div>

      <div className="space-y-6">
        {/* Netflix */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
            <div className="bg-red-600 p-6 flex items-center justify-center md:w-48 text-white">
                <Tv size={48} />
            </div>
            <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">넷플릭스 영화 추천</h3>
                <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">비지도학습 & 지도학습 혼합</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                    넷플릭스는 여러분이 어떤 영화를 끝까지 봤는지, 중간에 껐는지 데이터를 모읍니다. 
                    나와 비슷한 시청 패턴을 가진 사용자들을 그룹으로 묶고(군집화), 
                    그 그룹이 좋아했던 다른 영화를 나에게 추천해줍니다.
                </p>
            </div>
        </div>

        {/* AlphaGo */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
            <div className="bg-slate-800 p-6 flex items-center justify-center md:w-48 text-white">
                <Cpu size={48} />
            </div>
            <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">알파고 (바둑 AI)</h3>
                <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">강화학습</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                    알파고는 처음에는 사람들의 기보를 보고 배웠지만(지도학습), 
                    나중에는 자기 자신과 수백만 번 바둑을 두면서 승리(보상)하는 방법을 스스로 깨우쳤습니다(강화학습).
                    이것이 인간을 뛰어넘은 비결입니다.
                </p>
            </div>
        </div>

        {/* Self Driving */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
            <div className="bg-blue-600 p-6 flex items-center justify-center md:w-48 text-white">
                <Car size={48} />
            </div>
            <div className="p-6 flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">자율주행 자동차</h3>
                <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">모든 유형 사용</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                    카메라로 신호등과 사람을 구별할 때는 <strong>지도학습</strong>을, 
                    복잡한 도로 상황을 파악할 때는 <strong>비지도학습</strong>을, 
                    안전하게 차선을 변경하거나 주차할 때는 <strong>강화학습</strong>을 모두 사용합니다.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TabDeepDive;