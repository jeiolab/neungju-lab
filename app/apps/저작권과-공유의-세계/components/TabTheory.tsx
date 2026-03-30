import React from 'react';
import { Copyright, DollarSign, Ban, RefreshCcw, User } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-900">저작권과 공유의 세계</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          창작자의 권리를 지키는 '저작권'과 정보를 나누는 '카피레프트', 그리고 이를 실천하는 'CCL'에 대해 알아봅시다.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <Copyright className="text-slate-900 w-8 h-8" />
            <h3 className="text-xl font-bold text-slate-900">저작권 (Copyright)</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            창작물을 만든 사람에게 법이 부여하는 권리입니다. 허락 없이 남의 창작물을 마음대로 쓸 수 없게 하여 창작자의 노력을 보호합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="text-amber-500 w-8 h-8" />
            <h3 className="text-xl font-bold text-slate-900">카피레프트 (Copyleft)</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            "지식은 나눌수록 커진다"는 철학입니다. 저작권을 기반으로 하되, 조건에 따라 다른 사람들이 자유롭게 이용하고 수정할 수 있도록 허락하는 운동입니다.
          </p>
        </div>
      </div>

      <section className="bg-slate-100 p-6 rounded-2xl">
        <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">CCL (Creative Commons License) 4가지 조건</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BY */}
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <User className="text-blue-600 w-6 h-6" />
            </div>
            <h4 className="font-bold text-center text-lg mb-2">저작자 표시 (BY)</h4>
            <p className="text-sm text-slate-500 text-center">
              저작물의 원작자를 반드시 표기해야 합니다. 가장 기본적인 조건입니다.
            </p>
          </div>

          {/* NC */}
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <div className="relative">
                 <DollarSign className="text-yellow-600 w-6 h-6" />
                 <div className="absolute inset-0 border-2 border-yellow-600 rounded-full rotate-45 transform scale-x-0" style={{ transform: 'rotate(-45deg) scaleX(1)'}}></div>
              </div>
            </div>
            <h4 className="font-bold text-center text-lg mb-2">비영리 (NC)</h4>
            <p className="text-sm text-slate-500 text-center">
              돈을 버는 목적(영리 목적)으로는 사용할 수 없습니다.
            </p>
          </div>

          {/* ND */}
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl font-bold text-red-600">=</span>
            </div>
            <h4 className="font-bold text-center text-lg mb-2">변경 금지 (ND)</h4>
            <p className="text-sm text-slate-500 text-center">
              내용을 수정하거나 변형할 수 없습니다. 원본 그대로만 써야 합니다.
            </p>
          </div>

          {/* SA */}
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <RefreshCcw className="text-green-600 w-6 h-6" />
            </div>
            <h4 className="font-bold text-center text-lg mb-2">동일조건 변경허락 (SA)</h4>
            <p className="text-sm text-slate-500 text-center">
              저작물을 수정했다면, 그 결과물도 원본과 똑같은 라이선스를 적용해야 합니다.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabTheory;