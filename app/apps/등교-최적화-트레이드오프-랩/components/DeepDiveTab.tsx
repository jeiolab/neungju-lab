import React from 'react';
import { Target, Shuffle, TrendingUp } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4">모델은 목적에 따라 달라진다</h2>
        <p className="text-indigo-100 text-lg">
          우리가 만든 '등교 모델'은 <span className="font-bold text-white">시간 최소화</span>가 목적이었습니다.
          하지만 목적이 바뀌면 모델도 완전히 달라져야 합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <Target className="w-10 h-10 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">목적 1: 비용 최소화</h3>
          <p className="text-slate-600">
            용돈이 부족하다면? 시간 변수보다 <span className="font-bold text-slate-800">비용 변수</span>의 가중치가 훨씬 높아집니다.
            택시는 선택지에서 아예 제외될 수도 있습니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <Shuffle className="w-10 h-10 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">목적 2: 환승 최소화</h3>
          <p className="text-slate-600">
            비가 오거나 짐이 많다면? 총 소요 시간보다 <span className="font-bold text-slate-800">환승 횟수</span>나 <span className="font-bold text-slate-800">걷는 거리</span>가 중요한 변수가 됩니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">목적 3: 운동 효과</h3>
          <p className="text-slate-600">
            다이어트가 목적이라면? 칼로리 소모량이 핵심 출력값이 됩니다. 
            일부러 <span className="font-bold text-slate-800">더 먼 경로</span>를 선택하는 역설적인 최적화가 일어납니다.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-700 mb-3">🤔 생각해보기</h3>
        <p className="text-slate-600">
          여러분의 학교 생활에서 "성적 올리기"를 모델링한다면, 어떤 변수가 가장 중요할까요?
          <br/>
          (공부 시간? 수면 시간? 스마트폰 사용 시간?)
        </p>
      </div>
    </div>
  );
};

export default DeepDiveTab;