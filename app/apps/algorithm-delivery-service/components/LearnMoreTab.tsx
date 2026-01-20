import React from 'react';
import { Zap, Box, Database } from 'lucide-react';

const LearnMoreTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-white/20 rounded-full">
            <Zap size={32} className="text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold">더 빠른 방법은 없을까요?</h2>
        </div>
        <p className="text-lg text-purple-100 leading-relaxed">
          이진 탐색(O(log N))도 매우 빠르지만, 결국 몇 번은 찾아야 합니다. <br/>
          혹시 찾자마자 <span className="font-bold text-white bg-white/20 px-1 rounded">0초 만에 (O(1))</span> 물건을 집어낼 수는 없을까요?
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        <h3 className="flex items-center text-xl font-bold text-slate-800">
          <Database className="mr-2 text-purple-600" /> 해시 테이블 (Hash Table): 마법의 사물함
        </h3>
        <p className="text-slate-600">
          해시 테이블은 물건의 이름표(Key)만 보면 그 물건이 몇 번 사물함(Index)에 있는지 즉시 알 수 있는 구조입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3">일반 창고 (배열)</h4>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 p-2 bg-slate-50 rounded">
                <span className="w-6 h-6 flex items-center justify-center bg-slate-200 rounded text-xs text-slate-500">{i}</span>
                <Box size={16} className="text-slate-400" />
                <span className="text-sm text-slate-500">안에 뭐가 있는지 열어봐야 앎</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-bl-full opacity-50"></div>
          <h4 className="font-bold text-purple-900 mb-3">해시 테이블</h4>
           <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
              <span className="text-sm font-bold text-purple-700">"사과"</span>
              <span className="text-xs text-purple-400">Hash Function ➜</span>
              <span className="w-6 h-6 flex items-center justify-center bg-purple-200 rounded text-xs font-bold text-purple-800">101</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
              <span className="text-sm font-bold text-purple-700">"바나나"</span>
              <span className="text-xs text-purple-400">Hash Function ➜</span>
              <span className="w-6 h-6 flex items-center justify-center bg-purple-200 rounded text-xs font-bold text-purple-800">205</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            * '사과'라는 단어를 수학 공식(해시 함수)에 넣으면 바로 저장 위치(101번)가 나옵니다. 탐색이 필요 없습니다!
          </p>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl text-sm text-amber-900 border border-amber-100">
        <h4 className="font-bold mb-2">🤔 그럼 무조건 해시 테이블이 좋은가요?</h4>
        <p>
          아닙니다! 해시 테이블은 <span className="font-bold">공간(메모리)</span>을 많이 차지합니다. 
          또한 데이터의 순서가 중요할 때는(예: "가격 순으로 정렬해줘") 사용하기 어렵습니다.
          트레이드오프는 항상 존재합니다: <span className="font-bold">속도 vs 공간</span>
        </p>
      </div>
    </div>
  );
};

export default LearnMoreTab;