import React from 'react';
import { CONCEPTS } from '../constants';
import { Network, Globe, Server, Router, ShieldCheck, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Network, Globe, Server, Router, ShieldCheck
};

export const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-full hidden sm:block">
            <Network className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <h2 className="font-bold text-blue-900 text-xl mb-2">오늘의 핵심 개념: DHCP와 네트워크 기초</h2>
            <p className="text-blue-700 leading-relaxed">
            네트워크 환경에서 IP와 DNS 설정은 필수입니다. 하지만 사람이 일일이 설정하면 충돌 위험이 있고 관리하기 힘듭니다. 
            이 문제를 해결해주는 <strong>DHCP</strong>와 관련 개념들을 익혀봅시다.
            </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CONCEPTS.map((concept) => {
          const Icon = iconMap[concept.iconName] || Network;
          return (
            <div key={concept.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md transition-all hover:-translate-y-1 group">
              <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-600 transition-colors">
                <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{concept.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{concept.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};