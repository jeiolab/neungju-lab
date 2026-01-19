import React from 'react';
import { BookOpen, Target, Users } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn p-4 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          분류의 정석 (이론)
        </h2>
        <p className="text-slate-600 mb-6">
          환영합니다, 연구원님. 데이터 분류 연구소에서는 크게 두 가지 방법으로 데이터를 다룹니다.
          임무를 시작하기 전에 아래 내용을 숙지하세요.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-200 p-2 rounded-lg">
                <Target className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold text-blue-900">지도 학습 (분류)</h3>
            </div>
            <p className="text-sm text-blue-800 mb-2 font-medium">"정답이 있는 문제 풀기"</p>
            <p className="text-blue-700 text-sm leading-relaxed">
              데이터에 <strong>라벨(정답)</strong>이 붙어 있습니다. <br/>
              "이것은 사과다", "저것은 배다"라고 컴퓨터에게 미리 알려주고 학습시킵니다.
              새로운 데이터가 들어오면 배운 대로 분류합니다.
            </p>
            <div className="mt-4 bg-white/50 p-3 rounded text-xs text-blue-600">
              <strong>활용 예시:</strong> 스팸 메일 필터링, 과일 등급 판정
            </div>
          </div>

          <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-200 p-2 rounded-lg">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">비지도 학습 (군집)</h3>
            </div>
            <p className="text-sm text-emerald-800 mb-2 font-medium">"끼리끼리 묶어주기"</p>
            <p className="text-emerald-700 text-sm leading-relaxed">
              정답이 없습니다. 데이터들의 <strong>특징(거리)</strong>을 보고 비슷한 것끼리 그룹을 만듭니다.
              "누가 누군지는 모르겠지만, 너희들은 비슷하네?"라고 판단합니다.
            </p>
            <div className="mt-4 bg-white/50 p-3 rounded text-xs text-emerald-600">
              <strong>활용 예시:</strong> 비슷한 고객 그룹 만들기, 뉴스 기사 그룹화
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;