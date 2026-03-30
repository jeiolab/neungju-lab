import React from 'react';

const CriticalThinking: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-2">🤔 생각해볼 문제</h2>
            <p className="opacity-90">데이터 과학은 단순히 코드를 돌리는 것이 아니라, 결과를 비판적으로 해석하는 과정입니다.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-3">1. 조건 바꾸기</h3>
                <p className="text-slate-600 mb-4">
                    만약 '공부 시간' 대신 '유튜브 시청 시간'을 속성으로 넣었다면, 군집 결과가 어떻게 달라졌을까요?
                    데이터 속성 하나가 전체 결과의 해석을 어떻게 뒤바꿀 수 있는지 생각해보세요.
                </p>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" placeholder="나의 생각 적기..." />
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-3">2. 반례 찾기</h3>
                <p className="text-slate-600 mb-4">
                    군집화 결과가 항상 정답일까요? "A그룹은 공부를 잘한다"라고 단정 지을 때, 
                    여기에 속하지만 공부를 못하는 학생이 있다면 어떤 윤리적 문제가 생길까요?
                </p>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" placeholder="나의 생각 적기..." />
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 md:col-span-2">
                <h3 className="text-xl font-bold text-slate-800 mb-3">3. 적용 설계하기</h3>
                <p className="text-slate-600 mb-4">
                    이 분석 결과를 학교 정책(예: 방과후 프로그램 추천)에 실제로 사용하려 합니다. 
                    이때 발생할 수 있는 부작용을 막기 위해 어떤 <b>추가 검증 절차</b>가 필요할까요?
                </p>
                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" placeholder="검증 절차 제안해보기..." />
            </div>
       </div>
    </div>
  );
};

export default CriticalThinking;
