import React from 'react';
import { BookOpen, Code, Terminal, FileText } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 overflow-y-auto h-full pb-24">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-coffee-200">
        <h2 className="text-2xl font-bold text-coffee-800 flex items-center gap-2 mb-4">
          <Terminal className="w-6 h-6" />
          1. 표준 입출력 (Standard I/O)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            키오스크가 손님에게 메뉴를 보여주고(출력), 손님이 메뉴를 선택하는(입력) 과정은 
            프로그래밍의 가장 기초적인 <strong>입출력</strong> 과정과 같습니다.
          </p>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
            <p className="text-gray-400"># 1. 출력하기 (Output)</p>
            <p>print("어서오세요, CafeCoder입니다.")</p>
            <br/>
            <p className="text-gray-400"># 2. 입력받기 (Input)</p>
            <p>order = input("주문하실 메뉴를 입력하세요: ")</p>
            <p className="text-gray-400"># 주의: input으로 받은 데이터는 항상 문자열(str)입니다!</p>
            <p>count = int(input("수량을 입력하세요: ")) <span className="text-gray-500"># 숫자로 계산하려면 형변환 필수</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-coffee-200">
        <h2 className="text-2xl font-bold text-coffee-800 flex items-center gap-2 mb-4">
          <Code className="w-6 h-6" />
          2. 문자열 포매팅 (Formatting)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>영수증처럼 깔끔하게 데이터를 보여주기 위해 <strong>f-string</strong>을 사용합니다.</p>
          <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-coffee-500">
            <h3 className="font-bold mb-2">f-string 문법</h3>
            <p className="font-mono text-sm bg-white p-2 rounded border border-gray-200 mb-2">
              f"텍스트 &#123;변수명&#125; 텍스트"
            </p>
            <p className="text-sm">
              예시: <code className="bg-coffee-100 px-1 rounded">print(f"주문하신 &#123;menu&#125; &#123;count&#125;잔 나왔습니다.")</code>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div className="border p-4 rounded-lg">
               <h4 className="font-bold text-coffee-700 mb-2">이스케이프 문자</h4>
               <ul className="list-disc pl-5 space-y-2 text-sm">
                 <li><code className="bg-gray-200 font-mono px-1">\n</code> : 줄바꿈 (New Line)</li>
                 <li><code className="bg-gray-200 font-mono px-1">\t</code> : 탭 간격 (Tab)</li>
               </ul>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-coffee-200">
        <h2 className="text-2xl font-bold text-coffee-800 flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6" />
          3. 파일 입출력 (File I/O)
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>주문 내역이 사라지지 않게 하려면 파일에 저장해야 합니다.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <span className="block font-bold text-lg mb-1">'w' (Write)</span>
              <span className="text-sm text-gray-600">새로 쓰기 (덮어씀)</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <span className="block font-bold text-lg mb-1">'a' (Append)</span>
              <span className="text-sm text-gray-600">이어 쓰기 (추가)</span>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <span className="block font-bold text-lg mb-1">'r' (Read)</span>
              <span className="text-sm text-gray-600">읽기</span>
            </div>
          </div>

          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mt-4">
             <p>f = open("order_log.txt", "a", encoding="utf-8")</p>
             <p>f.write(f"&#123;menu&#125;: &#123;price&#125;원\n")</p>
             <p>f.close()</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;