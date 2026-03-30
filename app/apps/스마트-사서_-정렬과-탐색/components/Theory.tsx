import React from 'react';
import { BookOpen, TrendingUp, Search } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-stone-800">정렬의 힘</h2>
        <p className="text-stone-600">왜 사서들은 책을 정리하는 데 많은 시간을 쓸까요?</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <Search className="text-red-600 w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">순차 탐색 (정렬 안 됨)</h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            지저분한 방을 상상해 보세요. 열쇠를 찾으려면 찾을 때까지 모든 곳을 뒤져야 합니다.
            책 20권이 있는 도서관이라면 20번을 일일이 확인해야 할 수도 있죠.
          </p>
          <div className="bg-stone-50 p-3 rounded text-xs font-mono text-stone-700">
            효율성: O(n)<br/>
            최악의 경우: 모든 항목 확인
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
             <TrendingUp className="text-green-600 w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2">이진 탐색 (정렬 됨)</h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            책이 가나다순으로 정렬되어 있다면 중간을 펼쳐볼 수 있습니다. '하'로 시작하는 책을 찾는다면 '가'부터 '타'까지는 무시해도 되죠. 
            매번 탐색 범위를 반으로 줄입니다.
          </p>
          <div className="bg-stone-50 p-3 rounded text-xs font-mono text-stone-700">
            효율성: O(log n)<br/>
            최악의 경우: 아주 적은 횟수만 확인
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4 items-start">
        <BookOpen className="text-amber-600 w-6 h-6 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-900">트레이드오프 (Trade-off)</h4>
          <p className="text-sm text-amber-800 mt-1">
            정렬은 처음에 시간이 걸립니다. 책을 한 번도 찾지 않는다면 정렬은 시간 낭비일 수 있습니다. 
            하지만 자주 책을 찾는다면, 초기의 투자(정렬)가 나중에 큰 시간 절약으로 돌아옵니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Theory;