import React from 'react';
import { Library, BookOpen, Search } from 'lucide-react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">실생활로 보는 탐색</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <div className="bg-orange-50 p-6 rounded-t-xl border-x border-t border-orange-100 flex justify-center items-center h-48 group-hover:bg-orange-100 transition-colors">
              <BookOpen className="w-24 h-24 text-orange-400" />
            </div>
            <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">서점의 베스트셀러 코너</h3>
              <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">순차 탐색 (Linear)</div>
              <p className="text-slate-600">
                베스트셀러 매대는 보통 책이 무작위로 쌓여 있거나 순위별로 있습니다. 특정 책을 찾으려면 
                <strong> 눈으로 하나씩 훑어봐야 합니다.</strong>
              </p>
            </div>
          </div>

          <div className="group">
            <div className="bg-indigo-50 p-6 rounded-t-xl border-x border-t border-indigo-100 flex justify-center items-center h-48 group-hover:bg-indigo-100 transition-colors">
              <Library className="w-24 h-24 text-indigo-400" />
            </div>
            <div className="bg-white p-6 rounded-b-xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">도서관의 책꽂이</h3>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">이진 탐색 (Binary)</div>
              <p className="text-slate-600">
                도서관 책은 <strong>청구기호(번호) 순서대로 정렬</strong>되어 있습니다. 
                '800번대'를 찾으려면 책장의 중간을 보고, 번호가 작으면 왼쪽, 크면 오른쪽으로 이동하며 찾습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-bold flex items-center mb-4">
            <Search className="w-5 h-5 mr-2 text-yellow-400"/>
            사전 찾기 (Dictionary)
        </h3>
        <p className="text-slate-300 leading-relaxed">
            두꺼운 영어 사전에서 <strong>'Computer'</strong>라는 단어를 찾을 때, 우리는 첫 장부터 한 장씩 넘기지 않습니다(순차 탐색 X).
            대략 중간쯤을 펴보고, <strong>'M'</strong>이 나오면 <strong>'C'</strong>는 앞쪽에 있으니 앞부분의 절반을 다시 펼칩니다.
            이것이 우리가 본능적으로 사용하는 <strong>이진 탐색</strong>의 원리입니다.
        </p>
      </div>
    </div>
  );
};

export default TabDeepDive;