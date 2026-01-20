import React from 'react';
import { Layers, GitBranch, AlertOctagon } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-fade-in">
       <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
         <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
           <Layers className="text-yellow-400" />
           심화: 중첩 구조 (Nesting)
         </h2>
         <p className="text-slate-300 text-lg leading-relaxed">
           현실 세계의 문제는 "예/아니오" 한 번으로 끝나지 않습니다.<br/>
           조건 안에 또 다른 조건이 들어가는 것을 <strong>중첩(Nesting)</strong>이라고 합니다.
         </p>
       </div>

       <div className="grid md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             <AlertOctagon className="text-red-500" />
             왜 중첩이 필요한가요?
           </h3>
           <p className="text-slate-600 mb-4">
             혈압이 '높다'고 해서 다 같은 고혈압이 아닙니다.
             경도 고혈압(140~159)과 중증 고혈압(160 이상)은 처방이 다를 수 있습니다.
           </p>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm space-y-2">
             <p className="text-purple-600">만약 (수축기 {'>='} 140) 이면:</p>
             <div className="pl-4 border-l-2 border-purple-200">
               <p className="text-slate-500 mb-1">// 1차 관문 통과: 일단 고혈압임.</p>
               <p className="text-blue-600">만약 (수축기 {'>='} 160) 이면:</p>
               <p className="pl-4 text-red-600">→ "즉시 병원 방문하세요!"</p>
               <p className="text-blue-600">아니면:</p>
               <p className="pl-4 text-orange-600">→ "생활 습관을 개선하세요."</p>
             </div>
             <p className="text-purple-600">아니면:</p>
             <p className="pl-4 text-green-600">→ "정상입니다."</p>
           </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             <GitBranch className="text-indigo-500" />
             복잡도 관리
           </h3>
           <p className="text-slate-600 mb-4">
             중첩이 너무 깊어지면 코드를 읽기 어려워집니다(Spaghetti Code).
             이럴 때는 AND/OR 논리 연산자를 사용해 조건을 합치거나, 함수로 분리하는 것이 좋습니다.
           </p>
           <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-yellow-800 text-sm">
             <strong>팁:</strong> 들여쓰기를 정확하게 맞춰야 어떤 조건에 속하는지 헷갈리지 않습니다.
             파이썬 같은 언어에서는 들여쓰기가 틀리면 오류가 발생합니다!
           </div>
         </div>
       </div>
    </div>
  );
};

export default AdvancedTab;