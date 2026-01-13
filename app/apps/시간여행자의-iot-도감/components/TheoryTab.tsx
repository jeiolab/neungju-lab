import React from 'react';
import { Network, Cpu, Wifi, Link } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-cyan-600 mb-4 flex items-center">
          <Network className="mr-2" /> IoT(사물 인터넷)란?
        </h2>
        <p className="text-lg leading-relaxed text-slate-700">
          Internet of Things의 약자로, 세상의 모든 사물이 <span className="text-cyan-600 font-bold">인터넷</span>으로 연결되어 서로 대화(데이터 통신)하는 기술을 말합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <Link size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">1. 연결성 (Connectivity)</h3>
          <p className="text-sm text-slate-600">
            단순히 전기가 통하는 것이 아니라, 와이파이/LTE/블루투스 등으로 <strong>네트워크</strong>에 연결되어야 합니다.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <Cpu size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">2. 센싱 (Sensing)</h3>
          <p className="text-sm text-slate-600">
            주변의 온도, 소리, 위치 등을 감지할 수 있는 <strong>센서</strong>가 있어 정보를 수집합니다.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
            <Wifi size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-slate-800">3. 서비스 (Service)</h3>
          <p className="text-sm text-slate-600">
            수집된 정보를 바탕으로 스스로 판단하거나, 스마트폰 앱 등을 통해 <strong>유용한 기능</strong>을 제공합니다.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
        <h3 className="text-lg font-bold text-yellow-700 mb-2">⚠️ 오개념 주의!</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li>리모컨으로 켜는 TV는 IoT가 아닙니다. (단순 적외선 통신)</li>
          <li>센서로 열리는 자동문은 IoT가 아닙니다. (데이터 전송 없음)</li>
          <li><strong>핵심은 "인터넷에 연결되어 데이터를 주고받는가?" 입니다.</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default TheoryTab;