import React from 'react';
import { ArrowRight, Filter, Layers, CheckCircle } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">전처리 마스터의 길</h2>
        <p className="text-slate-500">전처리는 단순히 '지우는 것'이 아니라 데이터를 '요리'하는 과정입니다.</p>
      </div>

      <div className="relative border-l-4 border-indigo-200 ml-4 space-y-10 pl-8 py-2">
        {/* Step 1 */}
        <div className="relative">
          <div className="absolute -left-[45px] top-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-500" /> 데이터 정제 (Cleaning)
          </h3>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            우리가 실험한 단계입니다. 결측치를 채우고, 이상치를 제거하고, 중복된 데이터를 삭제하여 노이즈를 줄입니다.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative">
          <div className="absolute -left-[45px] top-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" /> 데이터 통합 (Integration)
          </h3>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            여러 소스의 데이터를 합칩니다. 예를 들어, '학생 신체검사 기록'과 '체육대회 기록'을 학번 기준으로 합치는 것입니다. 이때 데이터 형식이 다르면 오류가 발생합니다.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="absolute -left-[45px] top-0 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-indigo-500" /> 데이터 변환 (Transformation)
          </h3>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            분석하기 좋은 형태로 바꿉니다. 
            <br/> - <strong>정규화(Normalization):</strong> 0~100점 점수와 0~10000원 금액을 0~1 사이 값으로 통일하기.
            <br/> - <strong>원-핫 인코딩:</strong> '남/여' 글자를 컴퓨터가 이해하는 [0, 1] 숫자로 바꾸기.
          </p>
        </div>

        {/* Step 4 */}
        <div className="relative">
          <div className="absolute -left-[45px] top-0 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</div>
          <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" /> 분석 준비 완료!
          </h3>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            이제 AI를 학습시키거나 통계 분석을 돌릴 수 있는 '깔끔한 데이터셋'이 완성되었습니다.
          </p>
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl text-center">
        <p className="font-medium text-slate-600">
            💡 현업 데이터 과학자들은 업무 시간의 <span className="text-indigo-600 font-bold">80%</span>를 전처리에 씁니다.
        </p>
      </div>
    </div>
  );
};

export default DeepDiveTab;
