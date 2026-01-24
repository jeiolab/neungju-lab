import React from 'react';
import { Smartphone, Activity, Terminal } from 'lucide-react';

export const MoreInfoTab: React.FC = () => {
  return (
    <div className="pb-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">더 알아보기</h2>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
                <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-xl">
                    <Terminal className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="font-bold text-xl text-slate-800">Ping이 뭔가요?</h2>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                탁구(Ping-Pong)처럼 네트워크 신호를 보내고(Ping) 되돌아오는(Pong) 시간을 측정하는 도구입니다. 
                상대방 컴퓨터가 켜져 있는지, 인터넷 연결이 원활한지 확인할 때 주로 사용합니다.
                </p>
                <div className="bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-inner">
                <div className="flex gap-2 mb-2 border-b border-slate-700 pb-2">
                    <span className="text-red-400">●</span>
                    <span className="text-yellow-400">●</span>
                    <span className="text-green-400">●</span>
                </div>
                <p>$ ping google.com</p>
                <p className="opacity-70 mt-2">PING google.com (142.250.xxx.xxx): 56 data bytes</p>
                <p className="opacity-70">64 bytes from ...: icmp_seq=0 ttl=115 time=14.2 ms</p>
                <p className="opacity-70">64 bytes from ...: icmp_seq=1 ttl=115 time=15.1 ms</p>
                </div>
                <p className="mt-4 text-sm text-slate-500 font-medium flex items-center gap-2">
                <span className="text-red-500">⚠️</span> 학교나 공공기관 등 보안이 강한 곳에서는 Ping 응답을 막아놓기도 해요.
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 h-full">
                <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="font-bold text-xl text-slate-800">스마트폰 DHCP 설정</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">1</span>
                        <div>
                            <p className="font-bold text-slate-800">설정 앱 열기</p>
                            <p className="text-sm text-slate-500">스마트폰의 톱니바퀴 아이콘을 누르세요.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">2</span>
                        <div>
                            <p className="font-bold text-slate-800">Wi-Fi 메뉴 진입</p>
                            <p className="text-sm text-slate-500">연결된 와이파이 이름 옆 ⓘ (정보) 아이콘을 터치하세요.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">3</span>
                        <div>
                            <p className="font-bold text-slate-800">IP 구성 확인</p>
                            <p className="text-sm text-slate-500"><span className="font-bold text-indigo-600">'자동(DHCP)'</span>으로 되어 있는지 확인하세요.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800 border border-yellow-100">
                💡 '수동'으로 바꾸면 내가 직접 IP를 써야 해요. 전문가가 아니면 '자동' 추천!
                </div>
            </div>
        </div>
    </div>
  );
};