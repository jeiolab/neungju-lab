import React from 'react';
import { BookOpen, Tag, ArrowRightLeft, Database } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">지도학습이란? (Supervised Learning)</h2>
        <p className="text-gray-600">AI에게 "문제"와 "정답"을 함께 주면서 가르치는 방법입니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Definition */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">1. 개념 정의</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            마치 선생님이 학생에게 문제집의 <strong>문제</strong>와 <strong>해설지(정답)</strong>를 
            같이 주면서 공부시키는 것과 같아요. <br/>
            "이 사진은 고양이야", "이 사진은 강아지야"라고 알려주면 AI가 그 규칙을 찾아냅니다.
          </p>
        </div>

        {/* Card 2: Label */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">2. 레이블 (Label)</h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            데이터에 붙어있는 <strong>'정답표'</strong>를 말합니다.<br/>
            사과 사진에 붙은 "사과"라는 이름표가 바로 레이블입니다. 
            레이블이 정확해야 AI도 똑똑해집니다.
          </p>
        </div>

        {/* Card 3: Classification vs Regression */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <ArrowRightLeft className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">3. 무엇을 예측하나요?</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-50 p-4 rounded-xl">
              <h4 className="font-bold text-purple-700 mb-2">🅰️ 분류 (Classification)</h4>
              <p className="text-sm text-gray-700">
                몇 가지 정해진 그룹 중 하나를 고르는 것.<br/>
                예: "고양이 vs 강아지", "스팸 메일 vs 정상 메일"
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl">
              <h4 className="font-bold text-purple-700 mb-2">📈 회귀 (Regression)</h4>
              <p className="text-sm text-gray-700">
                연속적인 숫자를 예측하는 것.<br/>
                예: "키를 보고 몸무게 예측", "내년 집값 예측"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;