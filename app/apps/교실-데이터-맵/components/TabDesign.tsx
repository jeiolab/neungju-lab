import React from 'react';

const TabDesign: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">데이터 구조 설계하기</h2>
        <p className="text-slate-600">배운 내용을 바탕으로 실제 문제를 해결할 구조를 생각해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Change Conditions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="mb-4">
             <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">사고력 확장</span>
           </div>
           <h3 className="font-bold text-slate-800 text-lg mb-3">1. 조건 바꾸기</h3>
           <p className="text-sm text-slate-600 mb-4">
             만약 교실이 '분단'까지 나누어져 있다면(예: 1분단, 2분단...), 
             좌석 데이터는 2차원으로 충분할까요? 아니면 3차원이 필요할까요?
           </p>
           <textarea 
             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-24"
             placeholder="예: 분단이 추가되면 [분단][행][열] 구조가 되어 3차원이 필요할 것 같습니다..."
           ></textarea>
        </div>

        {/* Card 2: Find Exceptions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="mb-4">
             <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded">비판적 사고</span>
           </div>
           <h3 className="font-bold text-slate-800 text-lg mb-3">2. 반례 찾기</h3>
           <p className="text-sm text-slate-600 mb-4">
             "a[2]라고만 썼는데 왜 특정 좌석 하나를 선택하지 못할까요?" 
             이 상황을 친구에게 설명한다고 생각하고 적어보세요.
           </p>
           <textarea 
             className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 outline-none resize-none h-24"
             placeholder="2차원 리스트에서 인덱스 하나만 쓰면..."
           ></textarea>
        </div>

        {/* Card 3: Design Application (Full Width) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
           <div className="mb-4">
             <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">창의적 적용</span>
           </div>
           <h3 className="font-bold text-slate-800 text-lg mb-3">3. 우리 반 데이터 설계</h3>
           <p className="text-sm text-slate-600 mb-4">
             우리 반 학생들의 <strong>키(Height)</strong>와 <strong>몸무게(Weight)</strong>를 
             모두 기록하려면 어떤 리스트 구조가 좋을까요? (예: 2차원 리스트 활용법)
           </p>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-500 mb-3">
             {/* Simple code editor look */}
             students = [<br/>
             &nbsp;&nbsp;[170, 65], // 1번 학생 [키, 몸무게]<br/>
             &nbsp;&nbsp;...<br/>
             ]
           </div>
           <textarea 
             className="w-full p-3