import React from 'react';

const TheorySection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-lg mb-2">💡 핵심 개념</h3>
        <p className="text-sm opacity-90 leading-relaxed">
          <strong>허프만 코딩</strong>은 문자의 <span className="bg-indigo-500 px-1 rounded">빈도수</span>에 따라 길이를 다르게 코딩하는 압축 기술입니다. 자주 나오는 문자는 짧게, 드물게 나오는 문자는 길게 표현하여 전체 용량을 줄입니다.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
        <h3 className="font-bold text-lg mb-2 text-indigo-900">⚡ 오해와 진실</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          "허프만 트리는 항상 똑같다?" <br/>
          <span className="text-red-500 font-bold">NO!</span> 빈도수가 같은 문자가 있을 때 어떤 것을 먼저 묶느냐에 따라 트리 모양과 코드는 달라질 수 있습니다. 하지만 전체 압축 효율(비트 수)은 동일합니다.
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
        <h3 className="font-bold text-lg mb-2 text-indigo-900">🚀 실생활 활용</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          ZIP 파일 압축, JPEG 이미지, MP3 오디오 등 우리가 사용하는 대부분의 압축 포맷의 마지막 단계에서 이 원리가 사용됩니다.
        </p>
      </div>
    </div>
  );
};

export default TheorySection;
