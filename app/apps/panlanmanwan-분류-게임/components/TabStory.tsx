import React from 'react';
import { Smartphone, Router, Server, Globe } from 'lucide-react';

const TabStory: React.FC = () => {
  return (
    <div className="pb-20 max-w-4xl mx-auto">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl">
                <Globe size={32} className="text-indigo-600" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-800">서울에서 뉴욕으로 사진 보내기</h3>
                <p className="text-slate-500">데이터가 여행하는 경로를 따라가보세요.</p>
            </div>
        </div>
        
        <p className="text-slate-600 mb-10 leading-relaxed bg-slate-50 p-6 rounded-2xl">
          내 방에서 찍은 사진이 친구에게 닿기까지, 데이터는 어떤 여행을 할까요?<br/>
          <strong>PAN → LAN → MAN → WAN</strong>으로 확장되는 과정을 아래 타임라인에서 확인해보세요.
        </p>

        <div className="relative border-l-4 border-indigo-100 ml-6 md:ml-10 space-y-12 pl-10 md:pl-16 py-4">
          {/* Step 1: PAN */}
          <div className="relative group">
            <div className="absolute -left-[54px] md:-left-[78px] bg-white p-3 rounded-full border-4 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors">
              <Smartphone size={24} className="text-indigo-600" />
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:bg-indigo-50 transition-colors border border-slate-100 hover:border-indigo-100">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">PAN</span>
              <h4 className="font-bold text-xl text-slate-800 mb-2">내 스마트폰</h4>
              <p className="text-slate-600">사진을 찍고 '전송' 버튼을 누릅니다. 기기 내부에서 처리가 일어납니다.</p>
            </div>
          </div>

          {/* Step 2: LAN */}
          <div className="relative group">
            <div className="absolute -left-[54px] md:-left-[78px] bg-white p-3 rounded-full border-4 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors">
              <Router size={24} className="text-indigo-600" />
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:bg-indigo-50 transition-colors border border-slate-100 hover:border-indigo-100">
              <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mb-3">LAN</span>
              <h4 className="font-bold text-xl text-slate-800 mb-2">집 Wi-Fi 공유기</h4>
              <p className="text-slate-600">스마트폰이 무선 신호를 통해 집에 있는 공유기(LAN)에 접속하여 데이터를 보냅니다.</p>
            </div>
          </div>

          {/* Step 3: MAN */}
          <div className="relative group">
            <div className="absolute -left-[54px] md:-left-[78px] bg-white p-3 rounded-full border-4 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors">
              <Server size={24} className="text-indigo-600" />
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:bg-indigo-50 transition-colors border border-slate-100 hover:border-indigo-100">
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-3">MAN</span>
              <h4 className="font-bold text-xl text-slate-800 mb-2">지역 인터넷 센터</h4>
              <p className="text-slate-600">집 밖을 나간 신호는 서울시 내의 인터넷 통신망(MAN)을 타고 지역 거점 센터로 이동합니다.</p>
            </div>
          </div>

           {/* Step 4: WAN */}
           <div className="relative group">
            <div className="absolute -left-[54px] md:-left-[78px] bg-white p-3 rounded-full border-4 border-indigo-50 shadow-sm group-hover:border-indigo-200 transition-colors">
              <Globe size={24} className="text-indigo-600" />
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl hover:bg-indigo-50 transition-colors border border-slate-100 hover:border-indigo-100">
              <span className="inline-block bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full mb-3">WAN</span>
              <h4 className="font-bold text-xl text-slate-800 mb-2">해저 광케이블</h4>
              <p className="text-slate-600">태평양을 건너는 해저 케이블(WAN)을 통해 미국 통신망으로 전달되어 친구에게 도착합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-slate-200 p-8 rounded-2xl text-base mt-8 shadow-xl">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
          <Globe size={20} />
          알고 있었나요?
        </h4>
        <p className="leading-relaxed opacity-90">
          우리가 흔히 말하는 "인터넷에 접속한다"는 것은, 나의 작은 네트워크(PAN/LAN)를 통해 전 세계의 거대한 네트워크(WAN)의 일원이 된다는 뜻입니다. 지금 이 순간에도 여러분의 데이터는 전 세계를 여행하고 있습니다!
        </p>
      </div>
    </div>
  );
};

export default TabStory;