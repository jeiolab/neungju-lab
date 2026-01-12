import React from 'react';

export const ComparisonTable: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <span className="text-blue-500">📊</span> 정형 데이터 vs 비정형 데이터
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 border-b-2 border-slate-200">특징 (Feature)</th>
              <th className="p-4 border-b-2 border-slate-200">정형 데이터 (Structured)</th>
              <th className="p-4 border-b-2 border-slate-200 text-blue-600 font-bold">비정형 데이터 (Unstructured)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">형태 (Shape)</td>
              <td className="p-4 text-slate-600">고정된 필드 (행/열), 엑셀 표 형태</td>
              <td className="p-4 text-slate-800 font-medium">형식이 없음 (텍스트, 이미지, 비디오, 음성)</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">저장소 (Storage)</td>
              <td className="p-4 text-slate-600">RDBMS (SQL 데이터베이스)</td>
              <td className="p-4 text-slate-800 font-medium">NoSQL, Data Lake, Object Storage</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">분석 난이도</td>
              <td className="p-4 text-slate-600">쉬움 (통계, 정렬, 필터링 가능)</td>
              <td className="p-4 text-slate-800 font-medium">어려움 (AI/ML 전처리 필요)</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">분석 기술</td>
              <td className="p-4 text-slate-600">SQL 쿼리, 엑셀 함수</td>
              <td className="p-4 text-slate-800 font-medium bg-blue-50 rounded-lg">
                자연어 처리(NLP), 컴퓨터 비전(Vision API)
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-700">데이터 비중</td>
              <td className="p-4 text-slate-600">약 20%</td>
              <td className="p-4 text-slate-800 font-medium">약 80% (현대 빅데이터의 핵심)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
