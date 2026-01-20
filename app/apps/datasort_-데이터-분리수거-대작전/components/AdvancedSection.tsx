import React from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const AdvancedSection: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-red-300 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-8 h-8" />
          경고: TypeError 주의구역
        </h2>
        <p className="text-gray-300 mb-4">
          서로 다른 자료형끼리는 섞일 수 없는 경우가 많습니다. 특히 숫자와 문자를 더하려고 하면 파이썬은 혼란에 빠집니다.
        </p>
        <div className="bg-black/50 p-4 rounded-lg font-mono text-sm text-red-200 border-l-4 border-red-500">
          <div>age = 20</div>
          <div>print("내 나이는 " + age + "살")</div>
          <div className="text-red-400 mt-2"># TypeError: can only concatenate str (not "int") to str</div>
        </div>
      </div>

      <div className="bg-indigo-900/20 border border-indigo-500/50 p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-indigo-300 flex items-center gap-2 mb-4">
          🔄 형변환 (Casting) 센터
        </h2>
        <p className="text-gray-300 mb-6">
          다른 자료형끼리 연결하거나 연산하려면 <strong>형변환 함수</strong>를 사용해 모양을 바꿔야 합니다.
        </p>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl">
            <div className="bg-blue-600/30 text-blue-200 px-3 py-1 rounded">int( )</div>
            <ArrowRight className="text-slate-500" />
            <div className="text-slate-200">
              <span className="text-yellow-400">"123"</span>을 <span className="text-blue-400">123</span>으로 변환
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl">
            <div className="bg-yellow-600/30 text-yellow-200 px-3 py-1 rounded">str( )</div>
            <ArrowRight className="text-slate-500" />
            <div className="text-slate-200">
              <span className="text-blue-400">100</span>을 <span className="text-yellow-400">"100"</span>으로 변환
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl">
            <div className="bg-green-600/30 text-green-200 px-3 py-1 rounded">float( )</div>
            <ArrowRight className="text-slate-500" />
            <div className="text-slate-200">
              <span className="text-blue-400">5</span>를 <span className="text-green-400">5.0</span>으로 변환
            </div>
          </div>
        </div>

        <div className="mt-6 bg-slate-700/30 p-4 rounded-xl">
          <h3 className="text-indigo-200 font-bold mb-2">💡 해결책</h3>
          <div className="font-mono text-sm text-green-300">
            print("내 나이는 " + str(age) + "살") <span className="text-slate-400"># "내 나이는 20살"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSection;
