import React from 'react';
import { FileEdit, FilePlus, FileSearch, ArrowRight } from 'lucide-react';

const ConceptView: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
            <span className="bg-emerald-400/10 p-1 rounded mr-2 text-sm">STEP 1</span>
            파일 처리의 3단계 흐름
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center">
            <div className="bg-slate-700 p-4 rounded-lg w-full md:w-auto">
              <span className="font-mono text-yellow-400 block mb-1">open()</span>
              <span className="text-sm text-slate-300">파일 열기</span>
            </div>
            <ArrowRight className="text-slate-500 hidden md:block" />
            <div className="bg-slate-700 p-4 rounded-lg w-full md:w-auto border border-emerald-500/50">
              <span className="font-mono text-emerald-400 block mb-1">read/write</span>
              <span className="text-sm text-slate-300">읽기/쓰기</span>
            </div>
            <ArrowRight className="text-slate-500 hidden md:block" />
            <div className="bg-slate-700 p-4 rounded-lg w-full md:w-auto">
              <span className="font-mono text-blue-400 block mb-1">close()</span>
              <span className="text-sm text-slate-300">파일 닫기</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            파일을 사용하려면 먼저 <code>open()</code> 함수로 파일을 열어 객체를 얻어야 합니다. 작업이 끝나면 반드시 <code>close()</code>를 호출하여 자원을 반납해야 데이터가 안전하게 저장됩니다.
          </p>
        </section>

        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">함께 알면 좋은 함수들</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 mr-2 min-w-[80px]">readline()</code>
              <span className="text-slate-300">파일에서 한 줄씩 읽어옵니다. 반복문(while)과 함께 사용하여 대용량 파일을 처리할 때 유용합니다.</span>
            </li>
            <li className="flex items-start">
              <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 mr-2 min-w-[80px]">readlines()</code>
              <span className="text-slate-300">파일의 모든 줄을 읽어 리스트(List) 형태로 반환합니다.</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full">
          <h2 className="text-xl font-bold text-white mb-6">파일 모드 (File Mode) 비교</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center mb-2">
                <FileEdit className="w-5 h-5 text-red-400 mr-2" />
                <h3 className="font-bold text-white">'w' (Write Mode)</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">쓰기 모드. 파일이 없으면 새로 생성하고, <strong className="text-red-400">있으면 기존 내용을 모두 지우고</strong> 처음부터 다시 씁니다.</p>
              <code className="block bg-black/30 p-2 rounded text-xs text-slate-400 font-mono">f = open('data.txt', 'w')</code>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-emerald-500">
              <div className="flex items-center mb-2">
                <FilePlus className="w-5 h-5 text-emerald-400 mr-2" />
                <h3 className="font-bold text-white">'a' (Append Mode)</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">추가 모드. 파일이 없으면 생성하고, 있으면 <strong className="text-emerald-400">기존 내용 뒤에 이어서</strong> 씁니다. 로그 기록에 적합합니다.</p>
              <code className="block bg-black/30 p-2 rounded text-xs text-slate-400 font-mono">f = open('data.txt', 'a')</code>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center mb-2">
                <FileSearch className="w-5 h-5 text-blue-400 mr-2" />
                <h3 className="font-bold text-white">'r' (Read Mode)</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">읽기 모드. 파일을 읽기만 할 때 사용합니다. 파일이 없으면 <span className="text-yellow-400">FileNotFoundError</span> 오류가 발생합니다.</p>
              <code className="block bg-black/30 p-2 rounded text-xs text-slate-400 font-mono">f = open('data.txt', 'r')</code>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConceptView;
