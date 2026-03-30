import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <span className="text-4xl">🏗️</span> 데이터 관리자의 기본 지식
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4 text-lg">
          컴퓨터의 메모리는 한정된 자원입니다! 데이터를 효율적으로 저장하고 처리하려면 
          각 데이터의 성격에 맞는 <strong className="text-blue-600">자료형(Data Type)</strong>이라는 꼬리표를 붙여야 합니다.
          파이썬의 대표적인 4가지 기본 자료형을 알아봅시다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Integer */}
        <div className="bg-white border-2 border-blue-300 p-6 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-blue-700">정수 (int)</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Integer</span>
          </div>
          <p className="text-gray-700 text-base mb-4">소수점이 없는 숫자입니다. 개수를 세거나 순서를 매길 때 사용합니다.</p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 shadow-inner">
            <div>age = 25</div>
            <div>count = -10</div>
            <div>print(type(25)) # &lt;class 'int'&gt;</div>
          </div>
        </div>

        {/* Float */}
        <div className="bg-white border-2 border-green-300 p-6 rounded-xl hover:border-green-500 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-green-700">실수 (float)</h3>
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Floating Point</span>
          </div>
          <p className="text-gray-700 text-base mb-4">소수점이 포함된 숫자입니다. 정밀한 측정이 필요한 데이터에 사용합니다.</p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 shadow-inner">
            <div>height = 175.5</div>
            <div>pi = 3.14</div>
            <div>print(type(3.14)) # &lt;class 'float'&gt;</div>
          </div>
        </div>

        {/* String */}
        <div className="bg-white border-2 border-yellow-300 p-6 rounded-xl hover:border-yellow-500 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-yellow-700">문자열 (str)</h3>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">String</span>
          </div>
          <p className="text-gray-700 text-base mb-4">글자들의 집합입니다. 반드시 따옴표('', "")로 감싸야 합니다.</p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 shadow-inner">
            <div>name = "Python"</div>
            <div>number_str = "123"</div>
            <div>print(type("A")) # &lt;class 'str'&gt;</div>
          </div>
        </div>

        {/* Boolean */}
        <div className="bg-white border-2 border-purple-300 p-6 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-2xl font-bold text-purple-700">불린 (bool)</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">Boolean</span>
          </div>
          <p className="text-gray-700 text-base mb-4">참(True)과 거짓(False) 단 두 가지 값만 가집니다. 판단이나 조건에 사용됩니다.</p>
          <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm text-green-400 shadow-inner">
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
