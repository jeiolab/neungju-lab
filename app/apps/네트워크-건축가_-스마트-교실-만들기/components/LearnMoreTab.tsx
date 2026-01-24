import React from 'react';
import { Radio, ShieldCheck, Zap } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn p-4">
      <section className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">네트워크의 미래</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          네트워크 기술은 빠르게 발전합니다. 어제의 빠른 속도가 오늘은 느리게 느껴질 수 있죠. 미래를 이끌 기술들을 살펴봅시다.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg transform transition hover:scale-[1.02]">
          <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
             <Radio className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-4">5G와 WiFi 6</h3>
          <ul className="space-y-3 text-indigo-50">
            <li className="flex items-start">
                <span className="mr-2">•</span> 
                <span><strong>5G:</strong> 넓은 커버리지와 이동성을 위해 설계된 셀룰러 기술입니다. 스마트폰, 자율주행차, 실외 IoT에 적합합니다.</span>
            </li>
            <li className="flex items-start">
                <span className="mr-2">•</span> 
                <span><strong>WiFi 6 (802.11ax):</strong> 경기장이나 사무실처럼 기기가 밀집된 실내 환경에 최적화되어 있습니다. 한 번에 많은 기기를 효율적으로 처리합니다.</span>
            </li>
            <li className="mt-4 pt-4 border-t border-white/20 font-medium">
                서로 보완적입니다: 실외는 5G, 실내는 WiFi 6!
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-6 text-emerald-600">
             <Zap className="w-6 h-6" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">LiFi (라이파이)</h3>
           <p className="text-slate-600 mb-4">
            전구에서 인터넷이 나온다고 상상해보세요! LiFi는 전파 대신 빛을 이용해 데이터를 전송하는 기술입니다.
           </p>
           <div className="space-y-2 text-sm text-slate-500">
               <div className="flex justify-between border-b pb-2">
                   <span>속도</span>
                   <span className="font-bold text-slate-700">WiFi보다 100배 빠름</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                   <span>보안</span>
                   <span className="font-bold text-slate-700">빛은 벽을 통과할 수 없어 보안성 우수</span>
               </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-slate-300 relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center mb-6 text-emerald-400">
                <ShieldCheck className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold text-white">네트워크 보안 기초</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div>
                    <strong className="block text-white mb-2">방화벽 (Firewall)</strong>
                    <p className="text-sm">신뢰할 수 있는 내부 네트워크와 외부 네트워크 사이의 장벽 역할을 합니다.</p>
                </div>
                <div>
                    <strong className="block text-white mb-2">VPN</strong>
                    <p className="text-sm">가상 사설망. 데이터 터널을 암호화하여 해커가 내용을 볼 수 없게 합니다.</p>
                </div>
                <div>
                    <strong className="block text-white mb-2">WPA3</strong>
                    <p className="text-sm">최신 와이파이 보안 표준입니다. 비밀번호를 추측하기 훨씬 어렵게 만듭니다.</p>
                </div>
            </div>
        </div>
        {/* Abstract decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16"></div>
      </div>
    </div>
  );
};

export default LearnMoreTab;