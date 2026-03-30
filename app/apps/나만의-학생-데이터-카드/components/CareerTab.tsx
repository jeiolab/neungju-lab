import React from 'react';
import { Briefcase, BarChart, Binary } from 'lucide-react';

const CareerTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2">변수와 자료형, 왜 중요할까?</h2>
        <p className="text-slate-300">
          모든 프로그램의 기초! 데이터를 어떻게 저장하느냐에 따라 AI의 성능이 결정됩니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <BarChart className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">데이터 분석가</h3>
          <p className="text-sm text-slate-600">
            수집한 데이터(키, 점수 등)가 숫자인지 문자인지 정확히 분류해야 통계 분석이 가능합니다. 잘못된 자료형은 오류의 주범!
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Binary className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">AI 개발자</h3>
          <p className="text-sm text-slate-600">
            인공지능 모델을 학습시킬 때 입력 데이터의 형태(Shape)와 타입(Type)을 맞추는 것이 가장 기초적이고 중요한 작업입니다.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">백엔드 개발자</h3>
          <p className="text-sm text-slate-600">
            회원가입 정보를 데이터베이스에 저장할 때, 이름(문자), 나이(정수), 가입일(날짜) 등을 효율적으로 설계해야 합니다.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-4">
        <h3 className="font-bold text-indigo-900 mb-3">✅ 진로 체크리스트</h3>
        <ul className="space-y-2 text-sm text-indigo-800">
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>나는 데이터를 꼼꼼하게 분류하는 것을 좋아하는가?</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>복잡한 정보를 체계적으로 정리할 때 뿌듯함을 느끼는가?</span>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded text-indigo-600" />
            <span>오류가 났을 때 원인을 찾아 해결하는 과정이 재미있는가?</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CareerTab;