import React, { useState, useEffect } from 'react';
import { SimulationState } from '../types';
import { Ambulance, Flame, Siren, XCircle, Send, ShieldAlert, RefreshCw } from 'lucide-react';

export const SimulationPreview: React.FC = () => {
  const [simState, setSimState] = useState<SimulationState>({
    status: 'idle',
    activeService: 'NONE',
    activeGroup: null,
    message: '신고 대기 중...',
    location: 'ZONE-??'
  });

  const generateLocation = () => {
    const zones = ['A1', 'B2', 'C3', 'Gym', 'Lab'];
    return `ZONE-${zones[Math.floor(Math.random() * zones.length)]}`;
  };

  const handlePress = (type: 'A' | 'B' | 'AB') => {
    if (simState.status === 'sending') return;

    let service: SimulationState['activeService'] = 'NONE';
    let group = 0;
    let msg = '';

    switch(type) {
      case 'A':
        service = 'AMBULANCE';
        group = 10;
        msg = '의료 긴급신호 전송됨';
        break;
      case 'B':
        service = 'FIRE';
        group = 20;
        msg = '화재 긴급신호 전송됨';
        break;
      case 'AB':
        service = 'POLICE';
        group = 30;
        msg = '경찰 긴급신호 전송됨 (무음)';
        break;
    }

    setSimState({
      status: 'sending',
      activeService: service,
      activeGroup: group,
      message: '신호 송출 중...',
      location: generateLocation()
    });

    // Simulate Network Delay
    setTimeout(() => {
      setSimState(prev => ({
        ...prev,
        status: 'active',
        message: msg
      }));
    }, 1500);
  };

  const resetSim = () => {
    setSimState({
      status: 'idle',
      activeService: 'NONE',
      activeGroup: null,
      message: '신고 대기 중...',
      location: 'ZONE-??'
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-gray-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* The Device UI */}
        <div className="bg-black border-4 border-gray-700 rounded-3xl p-6 shadow-inner flex flex-col items-center gap-6 max-w-sm mx-auto w-full">
          <div className="w-full bg-gray-800 h-24 rounded-lg flex items-center justify-center p-4 border border-gray-600 shadow-inner">
             {simState.status === 'idle' ? (
               <span className="text-green-400 font-mono animate-pulse text-sm">시스템 정상 (READY)</span>
             ) : (
               <div className="text-center">
                 <div className="text-xs text-gray-400">전송 그룹 (GROUP) {simState.activeGroup}</div>
                 <div className={`font-bold font-mono text-xl ${
                    simState.activeService === 'FIRE' ? 'text-red-500' :
                    simState.activeService === 'POLICE' ? 'text-blue-500' : 'text-green-500'
                 }`}>
                   {simState.status === 'sending' ? '연결 중...' : simState.location}
                 </div>
               </div>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
             <button 
               onClick={() => handlePress('A')}
               className="bg-gray-800 active:bg-green-700 hover:bg-gray-700 border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 transition-all h-24 rounded-xl flex flex-col items-center justify-center gap-2"
             >
               <span className="text-2xl font-black text-gray-400">A</span>
             </button>
             <button 
               onClick={() => handlePress('B')}
               className="bg-gray-800 active:bg-red-700 hover:bg-gray-700 border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 transition-all h-24 rounded-xl flex flex-col items-center justify-center gap-2"
             >
               <span className="text-2xl font-black text-gray-400">B</span>
             </button>
          </div>

          <button 
             onClick={() => handlePress('AB')}
             className="w-full bg-blue-900/50 hover:bg-blue-800 border border-blue-700 text-blue-200 py-3 rounded-lg font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
           >
             <ShieldAlert className="w-4 h-4" /> A+B 시뮬레이션 (경찰)
           </button>
        </div>

        {/* Dashboard Feedback */}
        <div className="space-y-6">
          <h3 className="text-2xl font-light">관제 센터 (Simulation)</h3>
          
          <div className="space-y-4">
            <StatusRow 
              active={simState.activeService === 'AMBULANCE'} 
              color="green" 
              icon={<Ambulance />} 
              label="의료 구급대 (Medical)" 
              group="10"
            />
            <StatusRow 
              active={simState.activeService === 'FIRE'} 
              color="red" 
              icon={<Flame />} 
              label="소방서 (Fire)" 
              group="20"
            />
            <StatusRow 
              active={simState.activeService === 'POLICE'} 
              color="blue" 
              icon={<Siren />} 
              label="경찰청 (Police)" 
              group="30"
            />
          </div>

          {simState.status !== 'idle' && (
             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 animate-fade-in">
               <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">로그 출력 (Log)</div>
               <div className="font-mono text-sm text-yellow-400">
                 {`> 신호 감지: 버튼_${simState.activeService === 'POLICE' ? 'A+B' : simState.activeService === 'FIRE' ? 'B' : 'A'}`}
                 <br/>
                 {`> 그룹: ${simState.activeGroup}`}
                 <br/>
                 {`> 위치 ID: ${simState.location}`}
                 <br/>
                 {simState.status === 'active' && <span className="text-green-400">{`> 출동 접수 완료`}</span>}
               </div>
             </div>
          )}
          
          <button 
            onClick={resetSim}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> 시뮬레이션 초기화
          </button>
        </div>
      </div>
    </div>
  );
};

const StatusRow: React.FC<{active: boolean, color: string, icon: React.ReactNode, label: string, group: string}> = ({active, color, icon, label, group}) => (
  <div className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-500 ${
    active ? `bg-${color}-900/40 border-${color}-500 shadow-[0_0_15px_rgba(0,0,0,0.5)]` : 'bg-gray-800/50 border-gray-700 opacity-50'
  }`}>
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${active ? `bg-${color}-500 text-white` : 'bg-gray-700 text-gray-500'}`}>
        {icon}
      </div>
      <div>
        <div className={`font-bold ${active ? 'text-white' : 'text-gray-400'}`}>{label}</div>
        <div className="text-xs text-gray-500">라디오 그룹 {group}</div>
      </div>
    </div>
    {active && <Send className={`w-5 h-5 text-${color}-400 animate-ping`} />}
  </div>
);
