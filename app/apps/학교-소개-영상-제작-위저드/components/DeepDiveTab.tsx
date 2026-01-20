import React from 'react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">왜 '병렬 처리'가 중요할까요?</h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
            <div className="flex-1">
                <p className="text-slate-600 leading-relaxed mb-4">
                    프로젝트 관리에서 <strong>주경로(Critical Path)</strong>는 의존 관계가 있는 작업들의 가장 긴 연속 구간을 말합니다.
                    이 경로에 있지 않은 작업들은 종종 동시에(병렬로) 수행할 수 있습니다.
                </p>
                <p className="text-slate-600 leading-relaxed">
                    서로 의존하지 않는 작업들을 찾아내면, 전체 프로젝트 기간을 획기적으로 줄일 수 있습니다.
                </p>
            </div>
            <div className="flex-1 bg-slate-50 p-6 rounded-xl border border-slate-200 w-full">
                <h4 className="font-bold text-center mb-4">순차적(Sequential) vs. 병렬(Parallel)</h4>
                
                {/* Sequential Vis */}
                <div className="mb-6">
                    <div className="text-xs text-slate-500 mb-1">나쁜 예: 순차적 진행 (총 4일 소요)</div>
                    <div className="flex gap-1">
                        <div className="h-8 bg-red-400 w-1/4 flex items-center justify-center text-white text-xs rounded">대본</div>
                        <div className="h-8 bg-red-400 w-1/4 flex items-center justify-center text-white text-xs rounded">소품</div>
                        <div className="h-8 bg-red-400 w-1/4 flex items-center justify-center text-white text-xs rounded">촬영</div>
                        <div className="h-8 bg-red-400 w-1/4 flex items-center justify-center text-white text-xs rounded">편집</div>
                    </div>
                </div>

                {/* Parallel Vis */}
                <div>
                    <div className="text-xs text-slate-500 mb-1">좋은 예: 병렬 진행 (총 3일 소요)</div>
                    <div className="flex gap-1 relative h-16">
                        <div className="h-8 bg-green-500 w-1/4 flex items-center justify-center text-white text-xs rounded absolute top-0 left-0">대본</div>
                        {/* Props can happen same time as Script if different person */}
                        <div className="h-8 bg-green-500 w-1/4 flex items-center justify-center text-white text-xs rounded absolute top-8 left-0">소품</div>
                        
                        <div className="h-16 bg-green-600 w-1/4 flex items-center justify-center text-white text-xs rounded absolute top-0 left-1/4 ml-1">촬영</div>
                        <div className="h-16 bg-green-600 w-1/4 flex items-center justify-center text-white text-xs rounded absolute top-0 left-2/4 ml-2">편집</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
            <h4 className="font-bold text-indigo-900">현실 세계 적용 사례</h4>
            <p className="text-indigo-800 text-sm mt-1">
                소프트웨어 개발팀은 이 방식을 항상 사용합니다. 개발자가 '백엔드' 코드를 짜는 동안, 디자이너는 '프론트엔드' UI를 작업합니다. 
                그리고 중간 지점에서 만나 결과물을 합치죠.
            </p>
        </div>
    </div>
  );
};

export default DeepDiveTab;