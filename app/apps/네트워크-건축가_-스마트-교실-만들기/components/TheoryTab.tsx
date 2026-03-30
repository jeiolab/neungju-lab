import React from 'react';
import { Network, Globe, Wifi, Cpu } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">네트워크 기초 이론</h2>
        <p className="text-slate-600">설계하기 전에 청사진을 이해해 봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4 text-indigo-600">
            <Network className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">LAN vs WAN</h3>
          </div>
          <p className="text-slate-600 mb-4">
            <strong>LAN (근거리 통신망):</strong> 집, 학교, 사무실 등 한정된 공간 내에서 기기들을 연결하는 네트워크입니다.
          </p>
          <p className="text-slate-600">
            <strong>WAN (광역 통신망):</strong> 넓은 지리적 영역을 연결하는 통신망입니다. 인터넷은 세상에서 가장 큰 WAN입니다!
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4 text-emerald-600">
            <Wifi className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">라우터 vs 스위치</h3>
          </div>
          <p className="text-slate-600 mb-4">
            <strong>라우터(Router):</strong> 서로 다른 네트워크를 연결합니다(예: 우리 집 LAN과 인터넷 WAN). 데이터의 경로를 지정하는 교통경찰 역할을 합니다.
          </p>
          <p className="text-slate-600">
            <strong>스위치(Switch):</strong> 같은 네트워크 <em>안에서</em> 기기들을 연결합니다. 기기들이 서로 효율적으로 대화할 수 있게 해줍니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4 text-blue-500">
            <Globe className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">인터넷 연결 원리</h3>
          </div>
          <ol className="list-decimal list-inside text-slate-600 space-y-2">
            <li><strong>ISP (통신사)</strong>가 광케이블 등을 통해 건물까지 신호를 보냅니다.</li>
            <li><strong>모뎀</strong>은 이 신호를 우리 기기가 이해할 수 있는 디지털 데이터로 변환합니다.</li>
            <li><strong>라우터(공유기)</strong>는 이 데이터를 와이파이나 케이블을 통해 여러 기기에 분배합니다.</li>
          </ol>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center mb-4 text-purple-600">
            <Cpu className="w-8 h-8 mr-3" />
            <h3 className="text-xl font-bold">IoT (사물인터넷)</h3>
          </div>
          <p className="text-slate-600">
            전구, 냉장고, 자동차 등 일상 사물에 칩이 내장되어 인터넷에 연결됩니다. 편리한 "스마트" 환경을 만들지만, 수많은 연결을 처리할 수 있는 튼튼한 네트워크가 필요합니다!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;