import React from 'react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">심화 학습: 복합 제어 (Nested Logic)</h2>
        <p className="text-slate-600 mt-2">단순한 조건 하나로는 완벽한 농장을 만들 수 없습니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
          <h3 className="text-xl font-bold mb-4">AND 연산 (&&)</h3>
          <p className="text-gray-700 mb-4">
            두 가지 조건이 <span className="text-indigo-600 font-bold">모두</span> 참일 때만 실행합니다.
          </p>
          <div className="bg-slate-100 p-4 rounded-md font-mono text-sm">
            <p className="text-gray-500">// 비가 오고 창문이 열려있으면 닫는다</p>
            <span className="text-purple-600">if</span> (비가_옴 <span className="text-red-500">&&</span> 창문_열림) {'{'}<br/>
            &nbsp;&nbsp; 창문_닫기();<br/>
            {'}'}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            * 실수: 비가 오는데 창문이 이미 닫혀있다면? 굳이 닫기 명령을 보낼 필요가 없겠죠?
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500">
          <h3 className="text-xl font-bold mb-4">OR 연산 (||)</h3>
          <p className="text-gray-700 mb-4">
            둘 중 <span className="text-pink-600 font-bold">하나라도</span> 참이면 실행합니다.
          </p>
          <div className="bg-slate-100 p-4 rounded-md font-mono text-sm">
            <p className="text-gray-500">// 너무 덥거나 습도가 너무 높으면 팬 가동</p>
            <span className="text-purple-600">if</span> (온도 {'>'} 35 <span className="text-red-500">||</span> 습도 {'>'} 90) {'{'}<br/>
            &nbsp;&nbsp; 팬_가동();<br/>
            {'}'}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            * 팁: 위험 상황을 감지할 때 유용합니다.
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl mt-8">
        <h3 className="text-2xl font-bold mb-4">⚠️ 중첩 조건문 (Nested If)</h3>
        <p className="mb-6 opacity-90">
          조건문 안에 또 다른 조건문이 들어가는 구조입니다. 복잡하지만 정교한 제어가 가능합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="bg-slate-900 p-6 rounded-lg font-mono text-green-400 text-sm shadow-inner">
                if (온도 {'>'} 30) {'{'}<br/>
                &nbsp;&nbsp; if (습도 {'<'} 40) {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp; // 덥고 건조함 {'->'} 가습기 + 팬<br/>
                &nbsp;&nbsp;&nbsp;&nbsp; 가습기_ON();<br/>
                &nbsp;&nbsp;&nbsp;&nbsp; 팬_ON();<br/>
                &nbsp;&nbsp; {'}'} else {'{'}<br/>
                &nbsp;&nbsp;&nbsp;&nbsp; // 덥고 습함 {'->'} 창문 열기<br/>
                &nbsp;&nbsp;&nbsp;&nbsp; 창문_OPEN();<br/>
                &nbsp;&nbsp; {'}'}<br/>
                {'}'}
            </div>
            <div className="flex flex-col gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-400 mb-2">시나리오</h4>
                    <p className="text-sm">
                        사막 기후(고온 건조)와 열대 우림(고온 다습)은 대처 방식이 다릅니다.
                        단순히 온도만 보고 팬을 틀면, 건조한 날엔 작물이 말라버릴 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTab;