import React from 'react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">"기계학습이란 무엇인가?"</h2>
        <p className="text-slate-300 italic text-lg">
          "A computer program is said to learn from experience <strong className="text-yellow-400">E</strong> with respect to some class of tasks <strong className="text-yellow-400">T</strong> and performance measure <strong className="text-yellow-400">P</strong>, if its performance at tasks in <strong className="text-yellow-400">T</strong>, as measured by <strong className="text-yellow-400">P</strong>, improves with experience <strong className="text-yellow-400">E</strong>."
        </p>
        <div className="mt-4 text-right font-medium">- Tom M. Mitchell (1997)</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 px-2">스팸 필터 예시로 이해하기</h3>
        
        <div className="grid gap-4">
          <div className="bg-white p-6 rounded-xl shadow border-l-8 border-yellow-500 flex items-start gap-4">
            <div className="bg-yellow-100 text-yellow-800 font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">T</div>
            <div>
              <h4 className="font-bold text-lg">Task (작업)</h4>
              <p className="text-slate-600">이메일을 스팸인지 아닌지 분류하는 작업</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-8 border-blue-500 flex items-start gap-4">
            <div className="bg-blue-100 text-blue-800 font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">P</div>
            <div>
              <h4 className="font-bold text-lg">Performance (성능)</h4>
              <p className="text-slate-600">분류의 정확도 (얼마나 맞았는가?)</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-8 border-green-500 flex items-start gap-4">
            <div className="bg-green-100 text-green-800 font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">E</div>
            <div>
              <h4 className="font-bold text-lg">Experience (경험)</h4>
              <p className="text-slate-600">라벨링 된 이메일 데이터 셋 (사용자가 스팸/정상 분류해준 기록)</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 p-6 rounded-xl mt-6">
          <p className="text-center font-medium text-slate-700">
            결국 기계학습은 <span className="text-blue-600">데이터(E)</span>가 쌓일수록 <span className="text-purple-600">작업(T)</span>의 <span className="text-green-600">성능(P)</span>이 좋아지는 프로그램입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveTab;
