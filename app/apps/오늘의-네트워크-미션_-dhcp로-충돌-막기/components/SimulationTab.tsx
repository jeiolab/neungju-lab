import React, { useState } from 'react';
import { Wifi, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const SimulationTab: React.FC = () => {
  const [dhcpEnabled, setDhcpEnabled] = useState<boolean>(true);
  const [deviceCount, setDeviceCount] = useState<number>(5);

  const getRiskLevel = () => {
    if (dhcpEnabled) return { level: '낮음', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, desc: 'DHCP가 IP를 자동 관리하여 충돌이 거의 없습니다.' };
    
    if (deviceCount < 10) return { level: '주의', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, desc: '수동 설정입니다. 기기가 적어 관리가 가능하지만 실수가 발생할 수 있습니다.' };
    if (deviceCount <= 20) return { level: '위험', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle, desc: '기기가 많아집니다. 누군가 192.168.0.10을 중복 사용할 확률이 높습니다!' };
    return { level: '매우 위험', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, desc: 'IP 대란 발생! 충돌로 인해 인터넷이 끊기는 기기가 속출합니다.' };
  };

  const risk = getRiskLevel();
  const RiskIcon = risk.icon;

  return (
    <div className="grid lg:grid-cols-2 gap-6 pb-20">
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Wifi className="w-6 h-6 text-indigo-600"/>
                </div>
                마이크로 실험실
            </h2>

            {/* Controls */}
            <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                    <span className="block font-bold text-slate-800 mb-1">DHCP 서버 상태</span>
                    <span className="text-xs text-slate-500">자동 IP 할당 기능</span>
                </div>
                <button
                onClick={() => setDhcpEnabled(!dhcpEnabled)}
                className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 shadow-sm ${
                    dhcpEnabled ? 'bg-indigo-600 text-white ring-2 ring-indigo-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}
                >
                {dhcpEnabled ? 'ON (켜짐)' : 'OFF (꺼짐)'}
                </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between mb-4">
                    <div>
                        <span className="block font-bold text-slate-800">접속 기기 수</span>
                        <span className="text-xs text-slate-500">네트워크에 연결된 클라이언트</span>
                    </div>
                    <span className="font-bold text-2xl text-indigo-600">{deviceCount} <span className="text-sm font-normal text-slate-500">대</span></span>
                </div>
                <input
                type="range"
                min="1"
                max="30"
                value={deviceCount}
                onChange={(e) => setDeviceCount(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-colors"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>1대 (가정)</span>
                <span>15대 (소규모)</span>
                <span>30대 (교실)</span>
                </div>
            </div>
            </div>
        </div>
      </div>

      <div className="space-y-6 flex flex-col">
        {/* Result Card */}
        <div className={`p-8 rounded-2xl border-2 ${risk.bg} ${risk.border} transition-all duration-500 flex-grow flex flex-col justify-center items-center text-center relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-2 ${risk.color.replace('text', 'bg')}`}></div>
            <RiskIcon className={`w-20 h-20 mb-4 ${risk.color} opacity-20 absolute -top-4 -right-4`} />
            <RiskIcon className={`w-16 h-16 mb-6 ${risk.color}`} />
            
            <div className="mb-2">
                <div className={`text-sm font-bold uppercase tracking-wider mb-1 opacity-70 ${risk.color}`}>Risk Level</div>
                <div className={`text-4xl font-black ${risk.color} mb-4`}>{risk.level}</div>
            </div>
            <p className={`text-lg font-medium ${risk.color} opacity-90 max-w-sm`}>
            {risk.desc}
            </p>
        </div>

        <div className="bg-slate-800 text-slate-300 p-6 rounded-2xl text-sm shadow-lg flex gap-4">
            <Info className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
                <p className="font-bold text-white mb-2 text-base">💡 실험 가이드</p>
                <ul className="list-disc list-inside space-y-1 marker:text-indigo-400">
                <li>DHCP를 끄고 기기를 10대, 20대, 30대로 늘려보며 위험도 변화를 관찰하세요.</li>
                <li>기기가 30대일 때 DHCP를 켜면 위험도가 어떻게 변하나요? 이것이 DHCP를 사용하는 이유입니다.</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};