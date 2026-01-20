import React from 'react';
import { Layers, List, Grid3X3 } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">다차원 데이터의 세계</h2>
        <p className="text-slate-600">왜 1차원 리스트로는 부족할까요? 엑셀과 파이썬의 연결고리를 찾아봅시다.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <List size={24} />
            </div>
            <h3 className="text-xl font-bold">1차원 리스트 (List)</h3>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            기차처럼 데이터가 한 줄로 연결된 형태입니다.
            <br/>예: <code className="bg-slate-100 px-1 py-0.5 rounded text-pink-600 font-mono">[80, 90, 70]</code>
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 mb-2">한 학생의 성적만 관리할 때 적합</p>
            <div className="flex space-x-2">
              {[80, 90, 70].map((n, i) => (
                <div key={i} className="w-12 h-12 bg-white border border-slate-300 flex items-center justify-center font-mono rounded shadow-sm">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold">2차원 리스트 (Matrix)</h3>
          </div>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            리스트 안에 리스트가 들어있는 형태입니다. 엑셀의 '표'와 같습니다.
            <br/>예: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">[[80, 90], [70, 85]]</code>
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 mb-2 font-medium">여러 학생의 성적을 관리할 때 필수!</p>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-white border border-blue-300 flex items-center justify-center font-mono rounded text-blue-900 shadow-sm">80</div>
                <div className="w-12 h-12 bg-white border border-blue-300 flex items-center justify-center font-mono rounded text-blue-900 shadow-sm">90</div>
              </div>
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-white border border-blue-300 flex items-center justify-center font-mono rounded text-blue-900 shadow-sm">70</div>
                <div className="w-12 h-12 bg-white border border-blue-300 flex items-center justify-center font-mono rounded text-blue-900 shadow-sm">85</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Grid3X3 className="mr-2" />
          데이터 접근 공식 (Indexing)
        </h3>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="font-mono text-lg space-y-4">
             <div className="bg-indigo-800 p-4 rounded-lg border border-indigo-700">
               <span className="text-pink-400">scores</span>
               <span className="text-yellow-400">[행]</span>
               <span className="text-green-400">[열]</span>
             </div>
             <p className="text-sm text-indigo-200">
               = <span className="text-pink-400">성적표</span>
               <span className="text-yellow-400">[학생 번호]</span>
               <span className="text-green-400">[과목 번호]</span>
             </p>
          </div>
          <div className="text-sm space-y-2 text-indigo-100">
            <p>1. 첫 번째 대괄호 <span className="text-yellow-400 font-mono">[i]</span>는 <strong>몇 번째 줄(Row)</strong>인지를 결정합니다.</p>
            <p>2. 두 번째 대괄호 <span className="text-green-400 font-mono">[j]</span>는 그 줄 안에서 <strong>몇 번째 칸(Column)</strong>인지를 결정합니다.</p>
            <p className="mt-4 p-2 bg-indigo-800/50 rounded border-l-4 border-yellow-400">
              💡 주의: 컴퓨터의 숫자는 0부터 시작합니다! <br/>
              1번 학생 = 인덱스 0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};