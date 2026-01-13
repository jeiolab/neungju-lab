import React from 'react';
import { ML_STEPS, getIconComponent } from '../constants';

const ManualTab: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 bg-white rounded-lg shadow-inner">
      <h2 className="text-3xl font-bold text-factory-800 mb-6 flex items-center">
        <span className="bg-factory-800 text-white p-2 rounded mr-3 text-xl">DOC</span>
        공정 매뉴얼
      </h2>
      <p className="text-factory-600 mb-8 text-lg">
        AI 공장에서 고품질의 모델을 생산하기 위한 5단계 표준 공정입니다.
        엔지니어는 이 순서를 반드시 숙지해야 합니다.
      </p>

      <div className="space-y-6">
        {ML_STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col md:flex-row gap-4 p-5 border-l-4 border-factory-500 bg-factory-50 hover:bg-factory-100 transition-colors rounded-r-lg">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md text-factory-700">
                {getIconComponent(step.iconName, "w-8 h-8")}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-factory-800 mb-1">
                {step.label}
              </h3>
              <p className="text-factory-600 leading-relaxed">
                {step.description}
              </p>
              <div className="mt-3 text-sm text-factory-500 font-medium">
                KEY POINT: 
                {index === 0 && " '무엇'을 해결할지 모르면 시작할 수 없다."}
                {index === 1 && " 쓰레기 데이터(Garbage In)는 쓰레기 결과(Garbage Out)를 만든다."}
                {index === 2 && " 컴퓨터는 숫자만 이해한다. 결측치와 이상치를 처리하라."}
                {index === 3 && " 데이터의 패턴을 찾는 핵심 과정."}
                {index === 4 && " 처음 본 데이터(Test Set)에서도 잘 맞추는지 확인."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManualTab;