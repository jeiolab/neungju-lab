import React from 'react';
import { WizardData } from '../types';
import { THEMES } from '../constants';

interface ReportPreviewProps {
  data: WizardData;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ data }) => {
  if (!data.problem) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p>작성된 보고서가 없습니다. 위저드 탭에서 프로젝트를 설계해주세요.</p>
        </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-none md:rounded-xl overflow-hidden print:shadow-none print:w-full">
      <div className="bg-slate-900 text-white p-8 print:bg-white print:text-black print:border-b-2 print:border-black">
        <h1 className="text-3xl font-bold mb-2">탐구 보고서: {THEMES[data.theme].label}</h1>
        <p className="opacity-80">비지도 학습을 활용한 데이터 분석 프로젝트</p>
      </div>

      <div className="p-8 space-y-8 print:space-y-4">
        <section>
            <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3 print:text-black">1. 문제 정의</h2>
            <p className="text-slate-700 leading-relaxed">{data.problem}</p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3 print:text-black">2. 데이터 설계</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-bold text-slate-900 block mb-1">사용 속성</span>
                    <ul className="list-disc list-inside text-slate-700">
                        {data.attributes.map(attr => <li key={attr}>{attr}</li>)}
                    </ul>
                </div>
                <div>
                    <span className="font-bold text-slate-900 block mb-1">분석 방법</span>
                    <div className="bg-slate-100 p-2 rounded inline-block font-mono text-sm print:bg-transparent print:border">
                        {data.method}
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3 print:text-black">3. 성공 기준</h2>
            <ul className="list-check space-y-1 text-slate-700">
                {data.successCriteria.map(crit => (
                    <li key={crit} className="flex items-center">
                        <span className="mr-2">✅</span> {crit}
                    </li>
                ))}
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-3 print:text-black">4. 결과 해석 및 결론</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 print:bg-transparent print:border-0 print:p-0">
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{data.interpretation}</p>
            </div>
        </section>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center print:hidden">
            <button 
                onClick={() => window.print()}
                className="bg-slate-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700"
            >
                🖨️ 보고서 인쇄하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
