import React from 'react';
import { Card } from '../ui/Card';
import { Database, UserCheck, Key } from 'lucide-react';

export const LearnMoreTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
         <h2 className="text-3xl font-bold text-slate-900">법적 & 기술적 배경 지식</h2>
         <p className="text-slate-500 mt-2">우리의 데이터를 지켜주는 현실 세계의 규칙들입니다.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-blue-500">
           <Database className="text-blue-500 mb-4" size={32} />
           <h3 className="font-bold text-lg mb-2">데이터 3법</h3>
           <p className="text-sm text-slate-600">
             안전한 데이터 경제 활성화를 위해 개인정보보호법, 신용정보법, 정보통신망법을 개정한 것입니다. 가명정보 개념을 도입하여 활용 범위를 넓혔습니다.
           </p>
        </Card>

        <Card className="bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-teal-500">
           <UserCheck className="text-teal-500 mb-4" size={32} />
           <h3 className="font-bold text-lg mb-2">마이데이터 (MyData)</h3>
           <p className="text-sm text-slate-600">
             개인이 데이터의 '주인'이 되는 패러다임입니다. 기업이 독점하던 내 정보를 내가 원하는 다른 서비스로 이동시키고 관리할 수 있습니다.
           </p>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-slate-50 border-l-4 border-l-purple-500">
           <Key className="text-purple-500 mb-4" size={32} />
           <h3 className="font-bold text-lg mb-2">가명처리</h3>
           <p className="text-sm text-slate-600">
             추가 정보 없이는 특정 개인을 알아볼 수 없도록 개인정보를 가공하는 것입니다. 통계 작성이나 연구 목적으로 동의 없이 활용 가능합니다.
           </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-xl mb-4">데이터 수집가의 윤리 체크리스트</h3>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">1</span>
            <div>
              <span className="font-bold text-slate-800">목적 제한 (Purpose Limitation):</span>
              <p className="text-slate-600 text-sm">명시된 특정 목적을 위해서만 수집해야 합니다. "혹시 몰라서" 수집하는 것은 금물입니다.</p>
            </div>
          </li>
          <li className="flex gap-3">
             <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">2</span>
            <div>
              <span className="font-bold text-slate-800">데이터 최소화 (Data Minimization):</span>
              <p className="text-slate-600 text-sm">목표 달성에 꼭 필요한 최소한의 정보만 수집해야 합니다.</p>
            </div>
          </li>
          <li className="flex gap-3">
             <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">3</span>
            <div>
              <span className="font-bold text-slate-800">보안성 (Security):</span>
              <p className="text-slate-600 text-sm">수집된 데이터는 암호화하고 접근 권한을 철저히 관리해야 합니다.</p>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  );
};