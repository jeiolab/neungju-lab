import React from 'react';
import { Info } from 'lucide-react';

const TabMetadata: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
        <div className="bg-white p-2 rounded-full h-fit shadow-sm text-blue-600">
            <Info size={24} />
        </div>
        <div>
            <h3 className="font-bold text-blue-900 text-lg mb-1">메타데이터란?</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
                '데이터에 대한 데이터'입니다. 이 데이터가 언제, 어디서, 왜 수집되었고, 어떻게 가공되었는지 설명하는 꼬리표입니다. 
                가명정보를 안전하게 공유하려면, <strong>누가 이 데이터를 사용할 수 있는지</strong> 명확히 적어야 합니다.
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 font-bold text-slate-700">
            메타데이터 작성 연습 (예시: 안전지도 설문)
        </div>
        <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">데이터셋 이름</label>
                    <input type="text" defaultValue="2024_학교주변_안전_설문_v1" className="w-full p-2 border rounded bg-slate-50 text-slate-800" disabled />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">작성자(관리 책임자)</label>
                    <input type="text" placeholder="예: 1학년 3반 정보동아리장" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">가명처리 내역 (필수)</label>
                <textarea 
                    className="w-full p-3 border rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="예: 이름은 삭제함. 주소는 동 단위까지만 남김. 전화번호는 뒤 4자리 마스킹 처리함."
                ></textarea>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                     <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">공유 허용 대상</label>
                     <select className="w-full p-2 border rounded bg-white">
                         <option>학교 구성원 전체</option>
                         <option>담당 선생님 및 프로젝트 팀원</option>
                         <option>외부 공개</option>
                     </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">삭제 예정일</label>
                    <input type="date" className="w-full p-2 border rounded" />
                </div>
            </div>
            
            <button className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
                저장하기 (시뮬레이션)
            </button>
        </div>
      </div>
    </div>
  );
};

export default TabMetadata;