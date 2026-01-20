import React from 'react';
import { Book, FileText, ShoppingCart } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">왜 '정렬'이 필요할까요?</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          우리가 물건을 찾기 쉽게 하려면 순서대로 나열되어 있어야 합니다. 
          도서관에서 수만 권의 책 중 내가 원하는 책을 10초 만에 찾을 수 있는 이유는 
          책들이 <strong>'청구기호 순서'</strong>로 정렬되어 있기 때문입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center text-center">
            <Book className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold text-blue-900">도서관</h3>
            <p className="text-xs text-blue-700 mt-1">청구기호 순서대로 책을 꽂아 빠르게 검색</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl flex flex-col items-center text-center">
            <FileText className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-bold text-green-900">출석부</h3>
            <p className="text-xs text-green-700 mt-1">이름 가나다순 혹은 번호 순서로 관리</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl flex flex-col items-center text-center">
            <ShoppingCart className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-bold text-purple-900">쇼핑몰</h3>
            <p className="text-xs text-purple-700 mt-1">낮은 가격순, 판매량순으로 상품 보기</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            삽입 정렬 (Insertion Sort)
          </h3>
          <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
            이미 정렬된 줄 사이에 새로운 친구가 끼어드는 것과 같습니다.
            <br/>"내 자리가 어디지?" 하며 빈칸을 벌리고 들어갑니다.
          </p>
          <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-500">
            책 정리할 때 가장 많이 쓰는 방식!
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
             <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            선택 정렬 (Selection Sort)
          </h3>
          <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
            운동장에 흩어진 친구들 중 키가 제일 작은 사람부터 차례대로 불러내는 방식입니다.
            <br/>"가장 작은 사람 나와!"
          </p>
          <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-500">
            섞여있는 시험지를 번호순으로 모을 때 유용함.
          </div>
        </div>
      </section>
    </div>
  );
};
