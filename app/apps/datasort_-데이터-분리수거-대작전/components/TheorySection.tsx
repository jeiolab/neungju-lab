import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
          <span className="text-3xl">🏗️</span> 데이터 관리자의 기본 지식
        </h2>
        <p className="text-gray-200 leading-relaxed mb-4">
          컴퓨터의 메모리는 한정된 자원입니다! 데이터를 효율적으로 저장하고 처리하려면 
          각 데이터의 성격에 맞는 <strong>자료형(Data Type)</strong>이라는 꼬리표를 붙여야 합니다.
          파이썬의 대표적인 4가지 기본 자료형을 알아봅시다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Integer */}
        <div className="bg-blue-900/40 border border-blue-500/30 p-5 rounded-xl hover:bg-blue-900/60 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-blue-300">정수 (int)</h3>
            <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">Integer</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">소수점이 없는 숫자입니다. 개수를 세거나 순서를 매길 때 사용합니다.</p>
          <div className="bg-black/40 p-3 rounded font-mono text-sm text-blue-200">
            <div>age = 25</div>
            <div>count = -10</div>
            <div>print(type(25)) # &lt;class 'int'&gt;</div>
          </div>
        </div>

        {/* Float */}
        <div className="bg-green-900/40 border border-green-500/30 p-5 rounded-xl hover:bg-green-900/60 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-green-300">실수 (float)</h3>
            <span className="text-xs bg-green-500/20 text-green-200 px-2 py-1 rounded">Floating Point</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">소수점이 포함된 숫자입니다. 정밀한 측정이 필요한 데이터에 사용합니다.</p>
          <div className="bg-black/40 p-3 rounded font-mono text-sm text-green-200">
            <div>height = 175.5</div>
            <div>pi = 3.14</div>
            <div>print(type(3.14)) # &lt;class 'float'&gt;</div>
          </div>
        </div>

        {/* String */}
        <div className="bg-yellow-900/40 border border-yellow-500/30 p-5 rounded-xl hover:bg-yellow-900/60 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-yellow-300">문자열 (str)</h3>
            <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded">String</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">글자들의 집합입니다. 반드시 따옴표('', "")로 감싸야 합니다.</p>
          <div className="bg-black/40 p-3 rounded font-mono text-sm text-yellow-200">
            <div>name = "Python"</div>
            <div>number_str = "123"</div>
            <div>print(type("A")) # &lt;class 'str'&gt;</div>
          </div>
        </div>

        {/* Boolean */}
        <div className="bg-purple-900/40 border border-purple-500/30 p-5 rounded-xl hover:bg-purple-900/60 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-purple-300">불린 (bool)</h3>
            <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">Boolean</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">참(True)과 거짓(False) 단 두 가지 값만 가집니다. 판단이나 조건에 사용됩니다.</p>
          <div className="bg-black/40 p-3 rounded font-mono text-sm text-purple-200">
            <div>is_active = True</div>
            <div>is_empty = False</div>
            <div>print(type(True)) # &lt;class 'bool'&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheorySection;
