import React from 'react';

const TheorySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Introduction */}
      <section className="bg-white rounded-2xl shadow-lg p-8 border-l-8 border-blue-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">합병 정렬(Merge Sort)이란?</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          주문서가 산더미처럼 쌓여있을 때, 혼자서 전부 순서대로 맞추려면 머리가 아프죠? 
          <br/>
          합병 정렬은 <strong>"나눠서 해결하자(Divide and Conquer)"</strong> 전략을 사용합니다.
          반으로 나누고, 친구에게 정렬을 맡기고, 나중에 합치는 방식입니다.
        </p>
      </section>

      {/* 3 Steps */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mb-4">🔪</div>
            <h3 className="font-bold text-xl mb-2">1. 분할 (Split)</h3>
            <p className="text-gray-500 text-sm">
                리스트를 더 이상 나눌 수 없을 때까지(1개가 남을 때까지) 절반으로 계속 쪼갭니다.
            </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-4">🔄</div>
            <h3 className="font-bold text-xl mb-2">2. 정렬 (Sort)</h3>
            <p className="text-gray-500 text-sm">
                1개만 남은 리스트는 그 자체로 정렬된 상태입니다. 재귀 호출(Recursive Call)의 바닥(Base Case)입니다.
            </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4">🔗</div>
            <h3 className="font-bold text-xl mb-2">3. 합병 (Merge)</h3>
            <p className="text-gray-500 text-sm">
                두 개의 정렬된 리스트를 비교하며 하나의 정렬된 리스트로 합칩니다. 이 과정이 핵심입니다!
            </p>
        </div>
      </div>

      {/* Deep Dive: Recursion */}
      <section className="bg-slate-800 text-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">🤔 왜 재귀(Recursion)인가요?</h3>
        <p className="text-slate-300 mb-4">
            "왼쪽 절반을 정렬해줘"라고 명령을 내리면, 그 명령을 받은 함수는 또다시 자기 리스트를 반으로 쪼개서 
            "이것 좀 정렬해줘"라고 부릅니다. 
        </p>
        <div className="bg-slate-700 p-4 rounded-lg font-mono text-sm text-green-400">
            function mergeSort(list) &#123;<br/>
            &nbsp;&nbsp;if (list.length &lt;= 1) return list; // 1개면 끝!<br/>
            &nbsp;&nbsp;const middle = list.length / 2;<br/>
            &nbsp;&nbsp;const left = mergeSort(list.slice(0, middle)); // 재귀!<br/>
            &nbsp;&nbsp;const right = mergeSort(list.slice(middle)); // 재귀!<br/>
            &nbsp;&nbsp;return merge(left, right); // 합병!<br/>
            &#125;
        </div>
      </section>
    </div>
  );
};

export default TheorySection;
