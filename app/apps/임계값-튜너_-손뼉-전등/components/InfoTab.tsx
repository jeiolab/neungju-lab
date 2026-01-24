import React from 'react';
import { ShieldCheck, MapPin, Settings } from 'lucide-react';

const InfoTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">현실 세계의 소음과 센서</h2>
        <p className="leading-relaxed opacity-90">
          우리가 시뮬레이션에서 다루는 값(0~255)은 실제 아두이노나 마이크로비트 같은 장치에서
          아날로그 신호를 디지털로 변환한 값입니다. <br/>
          실제 환경은 훨씬 복잡합니다. 교실에서 친구들이 떠드는 소리, 복도를 지나가는 발소리, 
          심지어 에어컨 바람 소리도 센서에게는 '신호'가 될 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
               <MapPin size={24} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">장소별 추천 설정</h3>
          </div>
          <ul className="space-y-4">
             <li className="flex flex-col">
                <span className="font-bold text-slate-700">📚 조용한 도서관</span>
                <span className="text-sm text-slate-500">임계값: 낮음 (80~100) / 디바운스: 보통 (0.5초)</span>
                <span className="text-xs text-slate-400">작은 소리에도 반응해야 하지만, 책 넘기는 소리는 무시해야 함.</span>
             </li>
             <li className="flex flex-col border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-700">🏫 쉬는 시간 교실</span>
                <span className="text-sm text-slate-500">임계값: 매우 높음 (150+) / 디바운스: 길게 (1.0초)</span>
                <span className="text-xs text-slate-400">기본 소음이 크기 때문에 정말 큰 손뼉에만 반응하도록 설정.</span>
             </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-green-100 rounded-lg text-green-600">
               <ShieldCheck size={24} />
             </div>
             <h3 className="text-lg font-bold text-slate-800">오작동 방지 꿀팁</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-2">
                <span className="text-green-500 font-bold">1.</span>
                <span>이중 체크 로직: "0.2초 간격으로 두 번 연속 임계값을 넘을 때만 켜기" (더블 클릭 원리)</span>
             </li>
             <li className="flex gap-2">
                <span className="text-green-500 font-bold">2.</span>
                <span>이동 평균 필터: 순간적인 튀는 값(Spike)을 무시하기 위해 최근 5개 값의 평균을 사용하기.</span>
             </li>
             <li className="flex gap-2">
                <span className="text-green-500 font-bold">3.</span>
                <span>하드웨어 필터: 마이크 센서 앞에 스펀지를 씌워 바람 소리(Wind Noise) 줄이기.</span>
             </li>
          </ul>
        </div>
      </div>

       <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
           <h3 className="flex items-center gap-2 font-bold text-indigo-800 mb-2">
               <Settings size={20} /> 왜 '테스트-조정'을 반복할까요?
           </h3>
           <p className="text-indigo-700 text-sm leading-relaxed">
               완벽한 임계값은 없습니다. 환경은 매번 변하기 때문입니다. 
               엔지니어는 <span className="font-bold underline">Trade-off(트레이드 오프)</span> 관계를 이해해야 합니다.
               민감도를 높이면 오작동이 늘어나고, 민감도를 낮추면 반응하지 않을 위험이 커집니다.
               이 균형을 찾는 과정이 바로 시스템 설계의 핵심입니다.
           </p>
       </div>
    </div>
  );
};

export default InfoTab;