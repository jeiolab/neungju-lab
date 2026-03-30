import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const AdvancedSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-red-50 border-2 border-red-300 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-red-700 flex items-center gap-3 mb-4">
          <AlertTriangle className="w-10 h-10" />
          경고: TypeError 주의구역
        </h2>
        <p className="text-gray-700 mb-4 text-lg">
          서로 다른 자료형끼리는 섞일 수 없는 경우가 많습니다. 특히 숫자와 문자를 더하려고 하면 파이썬은 혼란에 빠집니다.
        </p>
        <div className="bg-gray-900 p-5 rounded-lg font-mono text-sm text-red-300 border-l-4 border-red-500 shadow-inner">
          <div>age = 20</div>
          <div>print("내 나이는 " + age + "살")</div>
          <div className="text-red-500 mt-2 font-semibold"># TypeError: can only concatenate str (not "int") to str</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-indigo-700 flex items-center gap-3 mb-4">
          🔄 형변환 (Casting) 센터
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          다른 자료형끼리 연결하거나 연산하려면 <strong className="text-indigo-600">형변환 함수</strong>를 사용해 모양을 바꿔야 합니다.
        </p>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-4 bg-white border-2 border-blue-200 p-5 rounded-xl shadow-md">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">int( )</div>
            <ArrowRight className="text-gray-600" size={24} />
            <div className="text-gray-800 text-lg">
              <span className="text-yellow-600 font-semibold">"123"</span>을 <span className="text-blue-600 font-semibold">123</span>으로 변환
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border-2 border-yellow-200 p-5 rounded-xl shadow-md">
            <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold">str( )</div>
            <ArrowRight className="text-gray-600" size={24} />
            <div className="text-gray-800 text-lg">
              <span className="text-blue-600 font-semibold">100</span>을 <span className="text-yellow-600 font-semibold">"100"</span>으로 변환
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border-2 border-green-200 p-5 rounded-xl shadow-md">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold">float( )</div>
            <ArrowRight className="text-gray-600" size={24} />
            <div className="text-gray-800 text-lg">
              <span className="text-blue-600 font-semibold">5</span>를 <span className="text-green-600 font-semibold">5.0</span>으로 변환
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white border-2 border-indigo-200 p-5 rounded-xl shadow-md">
          <h3 className="text-indigo-700 font-bold mb-3 text-lg">💡 해결책</h3>
          <div className="font-mono text-base text-gray-800 bg-gray-50 p-3 rounded">
            print("내 나이는 " + str(age) + "살") <span className="text-gray-500"># "내 나이는 20살"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSection;
