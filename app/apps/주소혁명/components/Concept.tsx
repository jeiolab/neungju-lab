import React from 'react';
import { SectionTitle } from './SectionTitle';
import { Box, Layers, Globe, ShieldCheck } from 'lucide-react';

const ComparisonCard: React.FC<{
  title: string;
  bit: string;
  format: string;
  count: string;
  color: 'blue' | 'indigo';
  icon: React.ReactNode;
  features: string[];
}> = ({ title, bit, format, count, color, icon, features }) => (
  <div className={`flex-1 bg-white rounded-2xl shadow-xl border-2 ${color === 'blue' ? 'border-blue-100' : 'border-indigo-100'} overflow-hidden transition-transform hover:-translate-y-1 duration-300`}>
    <div className={`p-6 ${color === 'blue' ? 'bg-blue-600' : 'bg-indigo-600'} text-white flex items-center justify-between`}>
      <div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="opacity-90 font-mono">{bit}</span>
      </div>
      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
        {icon}
      </div>
    </div>
    <div className="p-6 space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">주소 형식</h4>
        <div className="font-mono bg-slate-100 p-3 rounded-lg text-slate-700 text-sm break-all">
          {format}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">주소 개수</h4>
        <p className={`text-xl font-bold ${color === 'blue' ? 'text-blue-600' : 'text-indigo-600'}`}>
          {count}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">주요 특징</h4>
        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start text-slate-600 text-sm">
              <span className={`mr-2 mt-1 w-2 h-2 rounded-full ${color === 'blue' ? 'bg-blue-400' : 'bg-indigo-400'}`}></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export const Concept: React.FC = () => {
  return (
    <section id="concept" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle 
        title="개념 비교: 과거와 미래" 
        subtitle="우리가 사용하던 인터넷 주소 체계와 앞으로 사용하게 될 차세대 주소 체계를 비교해봅시다."
      />
      
      <div className="flex flex-col md:flex-row gap-8 mt-12">
        <ComparisonCard
          title="IPv4"
          bit="32-bit Address"
          format="192.168.0.1 (10진수)"
          count="약 43억 개"
          color="blue"
          icon={<Box size={32} />}
          features={[
            "1980년대 초반부터 사용된 표준",
            "현재 주소가 거의 고갈됨",
            "설정이 간편하지만 보안 기능이 기본은 아님",
            "점(.)으로 구분된 4개의 숫자로 구성"
          ]}
        />
        
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-slate-200 p-2 rounded-full">
            <Globe className="text-slate-400" size={32} />
          </div>
        </div>

        <ComparisonCard
          title="IPv6"
          bit="128-bit Address"
          format="2001:0db8:85a3:0000:0000:8a2e:0370:7334 (16진수)"
          count="약 3.4 × 10³⁸ 개 (거의 무한)"
          color="indigo"
          icon={<Layers size={32} />}
          features={[
            "주소 고갈 문제를 해결하기 위해 등장",
            "더 빠른 데이터 처리 속도",
            "강력한 보안 기능(IPSec) 내장",
            "콜론(:)으로 구분된 16진수로 구성"
          ]}
        />
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-blue-900 mb-1">왜 바꿔야 하나요?</h4>
          <p className="text-blue-800 leading-relaxed">
            스마트폰, 태블릿, 그리고 냉장고나 시계 같은 IoT(사물인터넷) 기기들이 폭발적으로 늘어나면서 
            43억 개의 IPv4 주소로는 전 세계의 모든 기기에 주소를 할당하기 부족해졌습니다. 
            IPv6는 모래알 개수보다 많은 주소를 제공하여 이 문제를 영구적으로 해결합니다.
          </p>
        </div>
      </div>
    </section>
  );
};