import React, { useState } from 'react';
import { WizardData } from '../types';
import { generateSpeechScript } from '../services/geminiService';

interface ReportProps {
  data: WizardData;
  onUpdate: (data: WizardData) => void;
}

export const Report: React.FC<ReportProps> = ({ data, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'poster' | 'script' | 'reflection'>('poster');
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateScript = async () => {
    setLoading(true);
    const generated = await generateSpeechScript(data);
    setScript(generated);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800">📊 내 진로 설계 리포트</h2>
        <div className="flex gap-2">
           <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium">
             <button onClick={() => setActiveTab('poster')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'poster' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>포스터</button>
             <button onClick={() => setActiveTab('reflection')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'reflection' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>생각 넓히기</button>
             <button onClick={() => setActiveTab('script')} className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'script' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>발표 대본</button>
           </div>
           <button onClick={handlePrint} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm">🖨 인쇄</button>
        </div>
      </div>

      {activeTab === 'poster' && (
        <div className="bg-white p-8 md:p-12 rounded-none md:rounded-2xl shadow-lg border border-slate-200 print-only" id="print-area">
          <div className="text-center mb-10 border-b-2 border-slate-800 pb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">MY CAREER ROADMAP</h1>
            <p className="text-slate-500 font-medium">디지털 사회의 나침반: 4단계 진로 설계</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">01 TARGET JOB</h3>
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <div className="text-2xl font-bold text-slate-800 mb-2">{data.targetJob || '미정'}</div>
                  <p className="text-slate-600 text-sm">{data.jobReason || '선택 이유가 입력되지 않았습니다.'}</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">02 CORE SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                   {data.capabilities.filter(c => c.selected).length > 0 ? (
                     data.capabilities.filter(c => c.selected).map(c => (
                       <span key={c.id} className={`px-3 py-1 rounded-lg text-sm font-medium border ${c.category === 'general' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-indigo-100 border-indigo-300 text-indigo-800'}`}>
                         {c.name}
                       </span>
                     ))
                   ) : (
                     <span className="text-slate-400 text-sm">선택된 역량이 없습니다.</span>
                   )}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">03 BLUEPRINT</h3>
                <div className="bg-slate-50 p-5 rounded-xl space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">자격 요건</span>
                    <span className="text-slate-800 font-medium">{data.requirements || '-'}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <span className="text-xs font-bold text-slate-500 block">주요 업무</span>
                    <span className="text-slate-800 font-medium">{data.duties || '-'}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                     <span className="text-xs font-bold text-slate-500 block">최종 비전</span>
                     <span className="text-slate-800 font-medium">{data.longTermGoal || '-'}</span>
                  </div>
                </div>
              </section>

              <section>
                 <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">04 ACTION PLAN</h3>
                 <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">WHERE</div>
                      <span className="text-sm text-slate-700">{data.searchWhere || '-'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">WHEN</div>
                      <span className="text-sm text-slate-700">{data.searchWhen || '-'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded text-xs font-bold mt-0.5">WHAT</div>
                      <span className="text-sm text-slate-700">{data.searchWhat || '-'}</span>
                    </div>
                 </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reflection' && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-4">🤔 생각 넓히기: 반례와 대비책</h3>
           <p className="text-slate-500 mb-6">완벽한 계획은 없습니다. 예상치 못한 상황(반례)을 가정하고 대비책을 세워봅시다.</p>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Q. 내 계획이 실패한다면, 가장 큰 원인은 무엇일까요?</label>
               <textarea 
                 value={data.failureScenario}
                 onChange={(e) => onUpdate({...data, failureScenario: e.target.value})}
                 className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:outline-none focus:border-red-400 h-24"
                 placeholder="예: AI 기술의 발전으로 해당 직무가 사라질 수 있다."
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">A. 그렇다면 어떻게 대비하겠습니까?</label>
               <textarea 
                 value={data.contingencyPlan}
                 onChange={(e) => onUpdate({...data, contingencyPlan: e.target.value})}
                 className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-200 focus:outline-none focus:border-green-400 h-24"
                 placeholder="예: 기획력과 창의력을 더 키워 AI를 도구로 활용하는 관리자가 되겠다."
               />
             </div>
           </div>
        </div>
      )}

      {activeTab === 'script' && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-slate-800">🎙 1분 발표 대본</h3>
             <button 
                onClick={handleGenerateScript}
                disabled={loading || !process.env.API_KEY}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
             >
               {loading ? 'AI가 작성 중...' : '✨ AI 자동 생성'}
             </button>
           </div>
           
           {!process.env.API_KEY && <p className="text-red-500 text-xs mb-4">API Key가 설정되지 않았습니다.</p>}

           <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 min-h-[300px] whitespace-pre-wrap leading-relaxed text-slate-700 font-medium">
             {script ? script : (
               <span className="text-slate-400">
                 위의 'AI 자동 생성' 버튼을 누르면 작성된 진로 계획 데이터를 바탕으로 발표 대본이 만들어집니다.
               </span>
             )}
           </div>
        </div>
      )}
    </div>
  );
};
