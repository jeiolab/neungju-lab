import React, { useState } from 'react';
import { ShieldAlert, Activity, Cpu, ServerCrash, Save } from 'lucide-react';

export default function LearnMoreTab() {
  const [userExample, setUserExample] = useState('');
  const [savedExamples, setSavedExamples] = useState<string[]>([]);

  const handleSave = () => {
    if (userExample.trim()) {
      setSavedExamples([...savedExamples, userExample]);
      setUserExample('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">현실 세계의 이상치 탐지</h2>
        <p className="text-slate-400">우리가 게임에서 찾은 이상치, 현실에서는 이렇게 쓰입니다.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealWorldCard 
          icon={<ShieldAlert className="text-red-400" />}
          title="부정 결제 탐지"
          desc="평소 5천원씩 쓰던 카드로 갑자기 해외에서 100만원이 결제된다면? 은행은 이를 이상치로 감지하고 거래를 막습니다."
        />
        <RealWorldCard 
          icon={<Cpu className="text-blue-400" />}
          title="공장 센서 고장"
          desc="기계의 진동이나 온도가 평소 패턴과 다르면 고장 징후입니다. 미리 감지하여 큰 사고를 예방하죠."
        />
        <RealWorldCard 
          icon={<Activity className="text-green-400" />}
          title="의료 진단"
          desc="심전도나 MRI 데이터에서 정상 범위를 벗어난 신호는 질병의 단서가 될 수 있습니다."
        />
        <RealWorldCard 
          icon={<ServerCrash className="text-purple-400" />}
          title="서버 침입 탐지"
          desc="새벽 3시에 평소와 다른 대량의 데이터 요청이 들어온다면? 해킹 시도로 간주하고 차단합니다."
        />
      </div>

      {/* User Interaction Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">✍️</span>
          내가 발견한 이상치 사례
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          학교나 일상생활에서 "어? 이건 좀 튀는데?" 싶었던 경험이 있나요?
        </p>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={userExample}
            onChange={(e) => setUserExample(e.target.value)}
            placeholder="예: 급식 줄이 평소보다 3배 길었던 날 (메뉴가 스파게티라서?)" 
            className="flex-grow bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button 
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
          >
            <Save size={18} /> 저장
          </button>
        </div>

        {savedExamples.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase">내 기록장</h4>
            <div className="space-y-2">
              {savedExamples.map((ex, idx) => (
                <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-slate-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                  {ex}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const RealWorldCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:-translate-y-1 transition-transform duration-300">
    <div className="mb-3 bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center border border-slate-600">
        {icon}
    </div>
    <h3 className="font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
  </div>
);
