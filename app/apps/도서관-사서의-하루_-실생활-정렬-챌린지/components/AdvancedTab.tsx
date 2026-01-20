import React from 'react';
import { Library, Filter, ArrowDownUp } from 'lucide-react';

export const AdvancedTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
       <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-8 rounded-2xl shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Library className="w-6 h-6" /> 한국 십진분류법 (KDC)
            </h2>
            <p className="text-slate-300 mb-6 max-w-2xl">
              도서관의 모든 책은 주제에 따라 000부터 900까지 10가지 큰 분류로 나뉩니다.
              이것은 대규모 데이터를 효율적으로 '버킷 정렬(Bucket Sort)'하는 것과 유사합니다.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { code: '000', name: '총류' }, { code: '100', name: '철학' },
              { code: '200', name: '종교' }, { code: '300', name: '사회과학' },
              { code: '400', name: '자연과학' }, { code: '500', name: '기술과학' },
              { code: '600', name: '예술' }, { code: '700', name: '언어' },
              { code: '800', name: '문학' }, { code: '900', name: '역사' },
            ].map((item) => (
              <div key={item.code} className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10 hover:bg-white/20 transition cursor-help" title={`${item.code}: ${item.name}`}>
                <div className="text-xl font-bold text-amber-400">{item.code}</div>
                <div className="text-xs text-slate-200">{item.name}</div>
              </div>
            ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-indigo-600" />
          다중 정렬 기준 (Multi-level Sorting)
        </h3>
        <p className="text-gray-600 mb-4">
          도서관에서는 책을 찾기 위해 하나의 기준만 쓰지 않습니다. 
          순서대로 여러 기준을 적용합니다. 엑셀의 '정렬 기준 추가'와 같습니다.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-bold text-gray-800">분류 기호 (Genre)</h4>
              <p className="text-sm text-gray-500">800(문학)이 400(과학)보다 뒤에 옵니다.</p>
            </div>
          </div>
          <ArrowDownUp className="w-5 h-5 text-gray-300 mx-auto" />
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-bold text-gray-800">저자 기호 (Author)</h4>
              <p className="text-sm text-gray-500">같은 800번대라면, '김'씨 작가가 '이'씨 작가보다 앞에 옵니다.</p>
            </div>
          </div>
          <ArrowDownUp className="w-5 h-5 text-gray-300 mx-auto" />
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-bold text-gray-800">권차 기호 (Volume)</h4>
              <p className="text-sm text-gray-500">같은 작가의 책이라면, 1권이 2권보다 앞에 옵니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
