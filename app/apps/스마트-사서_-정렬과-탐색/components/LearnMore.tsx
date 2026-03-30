import React from 'react';

const LearnMore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">한국십진분류법 (KDC)</h2>
        <div className="prose text-stone-600">
          <p>
            실제 도서관은 단순히 책 제목(가나다순)으로만 정렬하지 않습니다. <strong>주제(Subject)</strong>별로 정렬하기 위해 듀이십진분류법(DDC)이나 한국십진분류법(KDC)을 사용합니다.
          </p>
          <div className="my-6 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {[
              { code: '000', label: '총류' },
              { code: '100', label: '철학' },
              { code: '200', label: '종교' },
              { code: '300', label: '사회과학' },
              { code: '400', label: '자연과학' },
              { code: '500', label: '기술과학' },
              { code: '600', label: '예술' },
              { code: '700', label: '언어' },
              { code: '800', label: '문학' },
              { code: '900', label: '역사' },
            ].map(c => (
              <div key={c.code} className="bg-white border p-2 rounded hover:shadow-md transition-shadow cursor-default">
                <div className="font-bold text-amber-700">{c.code}</div>
                <div>{c.label}</div>
              </div>
            ))}
          </div>
          <p>
            이 시스템은 본질적으로 "트리(Tree)" 구조를 만듭니다. 모든 책을 순차적으로 찾는 대신, "기술과학(500)" 섹션으로 건너뛰고, 다시 "의학(510)"으로 들어가는 식으로 탐색 공간을 크게 줄입니다. 이는 이진 탐색이 범위를 절반씩 줄이는 원리와 매우 비슷합니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">빅오(Big O) 표기법: 속도의 수학</h2>
        <div className="grid md:grid-cols-2 gap-8">
           <div className="bg-stone-900 text-stone-50 p-6 rounded-xl font-mono text-sm shadow-xl">
             <h3 className="text-green-400 font-bold text-lg mb-4">순차 탐색: O(n)</h3>
             <ul className="space-y-2 text-stone-300">
               <li>10권 → 10단계</li>
               <li>1,000권 → 1,000단계</li>
               <li>1,000,000권 → 1,000,000단계</li>
             </ul>
             <p className="mt-4 text-red-400">확장성 나쁨.</p>
           </div>
           
           <div className="bg-stone-900 text-stone-50 p-6 rounded-xl font-mono text-sm shadow-xl">
             <h3 className="text-green-400 font-bold text-lg mb-4">이진 탐색: O(log n)</h3>
             <ul className="space-y-2 text-stone-300">
               <li>10권 → ~4단계</li>
               <li>1,000권 → ~10단계</li>
               <li>1,000,000권 → ~20단계</li>
             </ul>
             <p className="mt-4 text-green-400">확장성 매우 좋음.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;