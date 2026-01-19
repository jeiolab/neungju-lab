'use client';

import React from 'react';
import { EDUCATIONAL_CONTENT } from '../constants';
import { BookOpen } from 'lucide-react';

const OfficeView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">CEO 핸드북</h2>
        </div>
        <p className="text-slate-700 mb-6">
          현대 기업의 CEO로서 당신은 자금뿐만 아니라 고객의 데이터도 관리해야 합니다. 
          보안은 단순한 기능이 아니라, 사용자의 기본 권리입니다.
        </p>
        <div className="space-y-4">
          {EDUCATIONAL_CONTENT.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h3 className="font-bold text-indigo-700 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-center items-center text-center shadow-sm">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">👨‍💼</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">역할 가이드</h3>
        <p className="text-slate-600 italic">
          "당신의 목표는 10주간 회사를 생존시키는 것입니다. 자금이 바닥나거나 보안 점수가 0(치명적 해킹)이 되면 게임 오버입니다.
          높은 성장은 보통 높은 보안 비용이나 불편함을 수반합니다. 현명하게 선택하세요."
        </p>
      </div>
    </div>
  );
};

export default OfficeView;