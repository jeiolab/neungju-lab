import React from 'react';
import { CharterData } from '../types';
import { ShieldCheck, Users, FileText, Lock, AlertOctagon, HelpCircle } from 'lucide-react';

interface Props {
  data: CharterData;
}

export const CharterPreview: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white p-8 rounded shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 h-full">
      <div className="border-4 border-slate-800 p-6 h-full flex flex-col justify-between">
        
        {/* Header */}
        <header className="text-center border-b-2 border-slate-800 pb-6 mb-6">
          <h1 className="text-3xl font-black text-slate-900 mb-2">우리 반 공유 헌장</h1>
          <p className="text-slate-600 font-medium">안전하고 책임감 있는 협업을 위한 우리의 약속</p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-6 flex-grow">
          
          {/* Section 1 */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-indigo-700">
              <FileText className="w-5 h-5" /> 1. 공유 대상
            </h3>
            {data.target.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {data.target.map(t => <li key={t}>{t}</li>)}
              </ul>
            ) : <p className="text-sm text-slate-400 italic">선택되지 않음</p>}
          </section>

          {/* Section 2 */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-emerald-700">
              <Users className="w-5 h-5" /> 2. 공유 범위
            </h3>
            <p className="text-sm font-medium">{data.scope || "선택되지 않음"}</p>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200 col-span-2">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-blue-700">
              <Lock className="w-5 h-5" /> 3. 권한 및 보안
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">허용 권한</p>
                {data.permissions.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {data.permissions.map(p => <li key={p}>{p}</li>)}
                  </ul>
                ) : <p className="text-sm text-slate-400 italic">선택되지 않음</p>}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">보안 수칙</p>
                {data.security.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {data.security.map(s => <li key={s}>{s}</li>)}
                  </ul>
                ) : <p className="text-sm text-slate-400 italic">선택되지 않음</p>}
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-rose-700">
              <ShieldCheck className="w-5 h-5" /> 4. 저작권/개인정보
            </h3>
            {data.copyright.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {data.copyright.map(c => <li key={c}>{c}</li>)}
              </ul>
            ) : <p className="text-sm text-slate-400 italic">선택되지 않음</p>}
          </section>

          {/* Section 5 */}
          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-amber-700">
              <AlertOctagon className="w-5 h-5" /> 5. 문제 대응
            </h3>
            <p className="text-sm font-medium">{data.response || "선택되지 않음"}</p>
          </section>

           {/* Custom Rule */}
           {data.customRule && (
            <section className="bg-white border-2 border-dashed border-slate-300 p-4 rounded-lg col-span-2">
              <h3 className="font-bold text-lg flex items-center gap-2 mb-2 text-slate-700">
                <HelpCircle className="w-5 h-5" /> 우리 반 특별 규칙
              </h3>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{data.customRule}</p>
            </section>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500">생성일: {new Date(data.lastUpdated).toLocaleDateString()}</p>
            <p className="text-xs text-slate-500">서명: ____________________</p>
          </div>
          <div className="text-right">
             <span className="inline-block bg-slate-800 text-white text-xs px-2 py-1 rounded">OFFICIAL CHARTER</span>
          </div>
        </footer>
      </div>
    </div>
  );
};