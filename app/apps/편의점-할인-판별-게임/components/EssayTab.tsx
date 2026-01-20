import React from 'react';

const EssayTab: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-6">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">문제 1: 조건 바꾸기</span>
            <h3 className="text-lg font-bold text-gray-800">"할인 조건이 너무 까다로워요!"</h3>
            <p className="text-gray-600 mt-2 text-sm">
                현재 조건은 <code>(total &gt;= 50000) and membership</code> 입니다. 
                매출을 올리기 위해 조건을 더 완화하려면 논리 연산자나 비교 연산자를 어떻게 바꾸면 좋을까요?
            </p>
        </div>
        <textarea 
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-sm"
            placeholder="예: and를 or로 바꾸면..."
        ></textarea>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-6">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">문제 2: 반례 찾기</span>
            <h3 className="text-lg font-bold text-gray-800">"청소년 보호 시간 오류"</h3>
            <p className="text-gray-600 mt-2 text-sm">
                개발자가 <code>if time &gt; 22 and age &lt; 19:</code> 라고 코드를 짰습니다.
                이 코드가 자정(00시)부터 새벽 6시 사이에는 작동하지 않는 이유는 무엇일까요?
            </p>
        </div>
        <textarea 
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-sm"
            placeholder="시간은 24시간제에서 0, 1, 2...로 다시 시작하므로..."
        ></textarea>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="mb-6">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">문제 3: 적용 설계</span>
            <h3 className="text-lg font-bold text-gray-800">"편의점 1+1 로직 설계"</h3>
            <p className="text-gray-600 mt-2 text-sm">
                어떤 상품을 가져왔을 때, 1+1 대상인지 확인하고, 개수가 짝수인지 확인하는 절차를 한글이나 의사코드(pseudo-code)로 적어보세요.
            </p>
        </div>
        <textarea 
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-sm"
            placeholder="만약 상품이 행사목록에 있다면..."
        ></textarea>
      </div>
    </div>
  );
};

export default EssayTab;