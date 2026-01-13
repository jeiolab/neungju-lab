import React from 'react';
import { Book, User, Database, ArrowRight } from 'lucide-react';

const MoreInfoTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Book className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">도서관</h3>
          <p className="text-sm text-gray-600 mb-4">
            도서관 책은 청구기호 순으로 <strong>정렬</strong>되어 있습니다. 
            그래서 우리는 도서관 입구부터 모든 책을 뒤지지 않고, 
            섹션(800번대, 810번대...)을 찾아 들어가는 <strong>이진 탐색</strong>과 유사한 방법을 사용합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">연락처 목록</h3>
          <p className="text-sm text-gray-600 mb-4">
            휴대폰 연락처에서 '김철수'를 찾을 때 스크롤을 쭉 내려 'ㄱ' 근처로 바로 이동하죠? 
            이것도 <strong>정렬</strong>된 상태를 이용해 탐색 범위를 좁히는 원리입니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">데이터베이스</h3>
          <p className="text-sm text-gray-600 mb-4">
            실제 SW 시스템에서는 데이터베이스에 <strong>인덱스(Index)</strong>를 만듭니다. 
            미리 정렬해둔 목차를 만드는 것이죠. 덕분에 수억 개의 데이터도 순식간에 검색됩니다.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 text-white rounded-xl p-8 shadow-lg">
        <h3 className="text-xl font-bold mb-4">🤔 왜 항상 정렬하지 않을까요?</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <ArrowRight className="w-5 h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
            <p className="text-slate-300">
              <span className="text-white font-bold">비용 문제:</span> 정렬(Sorting) 자체도 시간이 걸립니다. 
              ($O(N \log N)$). 탐색을 딱 한 번만 할 거라면, 굳이 시간 들여 정렬하고 이진 탐색을 할 필요 없이 그냥 순차 탐색($O(N)$)하는 게 더 빠릅니다.
            </p>
          </div>
          <div className="flex items-start">
            <ArrowRight className="w-5 h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
            <p className="text-slate-300">
              <span className="text-white font-bold">변경이 잦은 경우:</span> 데이터가 계속 추가되고 삭제되면, 
              그때마다 다시 정렬해야 합니다. 이 유지보수 비용이 비쌀 때는 정렬하지 않고 둡니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreInfoTab;
