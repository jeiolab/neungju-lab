import React from 'react';
import { BookOpen, Shield, Globe, Users } from 'lucide-react';

const CopyrightClassroom: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">저작권 교실</h2>
        <p className="text-slate-600">창작물을 보호하고 올바르게 공유하는 방법을 배워봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Copyright (저작권)</h3>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            창작자가 자신의 창작물에 대해 가지는 배타적인 권리입니다. 
            허락 없이 남의 것을 베끼거나 사용하면 안 됩니다. 
            <br/><span className="text-sm text-slate-400 mt-2 block">* 모든 권리 보유 (All Rights Reserved)</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Copyleft & CCL</h3>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            저작권자가 "이 조건만 지키면 내 작품을 써도 좋아!"라고 미리 허락하는 것입니다.
            CCL(Creative Commons License)이 대표적입니다.
            <br/><span className="text-sm text-slate-400 mt-2 block">* 일부 권리 보유 (Some Rights Reserved)</span>
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-indigo-600" />
          <h3 className="text-xl font-bold text-indigo-900">공공누리란?</h3>
        </div>
        <p className="text-indigo-800 mb-4">
          대한민국 정부와 공공기관이 만든 저작물을 자유롭게 이용할 수 있도록 만든 라이선스입니다. 
          학교 과제할 때 <strong>'공공누리 제1유형'</strong> 마크가 있는 자료는 출처만 표시하면 자유롭게 쓸 수 있어요!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {[1, 2, 3, 4].map((type) => (
             <div key={type} className="bg-white p-3 rounded text-center text-sm font-medium shadow-sm">
                제{type}유형
                <span className="block text-xs text-gray-500 font-normal mt-1">
                  {type === 1 && "출처표시"}
                  {type === 2 && "출처표시 + 상업용금지"}
                  {type === 3 && "출처표시 + 변경금지"}
                  {type === 4 && "출처표시 + 상업용금지 + 변경금지"}
                </span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CopyrightClassroom;