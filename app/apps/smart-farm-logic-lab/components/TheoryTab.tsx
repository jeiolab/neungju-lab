import React from 'react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-emerald-600 p-4 text-white">
          <h2 className="text-xl font-bold">1. 조건문(Conditionals)이란?</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            스마트팜의 뇌와 같은 역할을 합니다. <br/>
            <strong>"만약(If) ~라면, ...을 해라"</strong>라는 구조를 가집니다.
          </p>
          <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-emerald-500 font-mono text-sm">
            <span className="text-purple-600">if</span> (온도 {'>'} 30) {'{'} <br/>
            &nbsp;&nbsp; 팬을_켠다(); <br/>
            {'}'} <span className="text-purple-600">else</span> {'{'} <br/>
            &nbsp;&nbsp; 팬을_끈다(); <br/>
            {'}'}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold">2. 센서(Sensor)와 입력</h2>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <p className="text-gray-700 leading-relaxed">
              센서는 농장의 상태를 숫자로 바꾸어 컴퓨터에게 전달합니다. <br/>
              조건문은 이 <strong>숫자(데이터)</strong>를 기준으로 판단을 내립니다.
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-600 space-y-2">
              <li>온도 센서 → 현재 온도(°C)</li>
              <li>습도 센서 → 현재 습도(%)</li>
              <li>토양 수분 센서 → 흙의 수분량</li>
            </ul>
          </div>
          <div className="flex-shrink-0 w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-200">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-4 text-white">
          <h2 className="text-xl font-bold">3. 반복문(Loop)과 모니터링</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            스마트팜은 한 번만 체크하고 끝나는 것이 아닙니다. <br/>
            <strong>"계속해서(While)"</strong> 센서 값을 확인하고 상태를 유지해야 합니다.
          </p>
           <div className="mt-4 bg-slate-100 p-4 rounded-lg border-l-4 border-orange-400 font-mono text-sm">
            <span className="text-purple-600">while</span> (시스템_가동중) {'{'} <br/>
            &nbsp;&nbsp; 온도_체크(); <br/>
            &nbsp;&nbsp; 습도_체크(); <br/>
            &nbsp;&nbsp; <span className="text-gray-500">// 1초마다 반복</span> <br/>
            {'}'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;