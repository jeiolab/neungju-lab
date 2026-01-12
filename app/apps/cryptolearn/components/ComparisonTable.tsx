import React from 'react';
import { ComparisonRow } from '../types';

const ComparisonTable: React.FC = () => {
  const data: ComparisonRow[] = [
    { feature: '키 개수', symmetric: '1개 (공유)', asymmetric: '2개 (공개+개인)', hash: '없음' },
    { feature: '속도', symmetric: '매우 빠름', asymmetric: '느림 (복잡한 연산)', hash: '매우 빠름' },
    { feature: '보안성', symmetric: '키 배송 위험 존재', asymmetric: '매우 안전', hash: '복호화 불가능' },
    { feature: '주 용도', symmetric: '대용량 데이터 암호화', asymmetric: '키 교환, 전자서명', hash: '비밀번호, 무결성 검증' },
    { feature: '방향성', symmetric: '양방향', asymmetric: '양방향', hash: '단방향' },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-lg border border-slate-200 bg-white mt-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
            <th className="p-4 font-bold">특징</th>
            <th className="p-4 font-bold text-blue-600">대칭키 (Symmetric)</th>
            <th className="p-4 font-bold text-purple-600">공개키 (Asymmetric)</th>
            <th className="p-4 font-bold text-orange-600">해시 (Hash)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-semibold text-slate-600 bg-slate-50/50">{row.feature}</td>
              <td className="p-4 text-slate-600">{row.symmetric}</td>
              <td className="p-4 text-slate-600">{row.asymmetric}</td>
              <td className="p-4 text-slate-600">{row.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;