import React from 'react';
import { Box, Cookie, ArrowRight, Layers, Copy } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-indigo-600">클래스(Class) vs 객체(Object)</h2>
        <p className="text-gray-600 text-lg">
          객체 지향 프로그래밍(OOP)의 가장 기초적인 개념입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Class Card */}
        <div className="bg-white border border-indigo-200 rounded-xl p-6 shadow-lg hover:shadow-indigo-200 transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
              <Layers size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">클래스 (설계도)</h3>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>클래스(Class)</strong>는 객체를 만들어내기 위한 설계도나 틀입니다. 초기 상태(변수)와 행동(메소드)을 정의합니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border-l-4 border-indigo-500">
              <span className="text-purple-600">class</span> <span className="text-yellow-600">BungeoppangMachine</span>:<br/>
              &nbsp;&nbsp;<span className="text-purple-600">def</span> <span className="text-blue-600">__init__</span>(self, flavor):<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;self.flavor = flavor
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
              <li>아직 구체적인 물건으로 존재하지 않습니다.</li>
              <li>"무엇"인지를 정의하는 개념입니다.</li>
              <li>비유: <strong>붕어빵 틀</strong>, 자동차 설계도.</li>
            </ul>
          </div>
        </div>

        {/* Object Card */}
        <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-lg hover:shadow-emerald-200 transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <Cookie size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">인스턴스 (실체)</h3>
          </div>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>인스턴스(Instance)</strong>는 클래스(설계도)를 통해 실제로 생성된 객체입니다. 메모리에 실제로 존재합니다.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border-l-4 border-emerald-500">
              <span className="text-gray-500"># 인스턴스(붕어빵) 굽기</span><br/>
              cream_bun = <span className="text-yellow-600">BungeoppangMachine</span>(<span className="text-green-600">"슈크림"</span>)<br/>
              bean_bun = <span className="text-yellow-600">BungeoppangMachine</span>(<span className="text-green-600">"팥"</span>)
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
              <li>실제 메모리를 차지합니다.</li>
              <li>각자 고유한 데이터(예: 팥 맛, 슈크림 맛)를 가집니다.</li>
              <li>비유: 틀에서 갓 구워진 따끈한 <strong>붕어빵</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Visual Analogy */}
      <div className="bg-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-center gap-8 border border-gray-200 shadow-sm">
         <div className="text-center">
            <Box size={64} className="mx-auto text-indigo-600 mb-2" />
            <span className="font-mono text-indigo-700">붕어빵 틀 (Class)</span>
         </div>
         <ArrowRight size={32} className="text-gray-400" />
         <div className="flex flex-col gap-2 items-center">
            <div className="p-2 bg-indigo-600 text-white rounded font-mono text-xs">생성 (new)</div>
         </div>
         <ArrowRight size={32} className="text-gray-400" />
         <div className="flex gap-4">
            <div className="text-center animate-bounce" style={{ animationDuration: '2s' }}>
                <Copy size={48} className="mx-auto text-emerald-600 mb-2" />
                <span className="font-mono text-emerald-700">팥 붕어빵</span>
            </div>
            <div className="text-center animate-bounce" style={{ animationDuration: '2.5s' }}>
                <Copy size={48} className="mx-auto text-yellow-600 mb-2" />
                <span className="font-mono text-yellow-700">슈크림 붕어빵</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TheoryTab;