import React from 'react';
import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

const JobTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">IoT가 바꾼 직업의 세계</h2>
        <p className="text-slate-600">사물 인터넷 기술의 발달로 사라지는 직업과 새로 생겨나는 직업을 알아봅시다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Jobs */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-cyan-50 p-4 border-b border-cyan-100 flex items-center gap-2">
            <TrendingUp className="text-cyan-600" />
            <h3 className="text-lg font-bold text-cyan-900">새로 생겨난 직업 (부상)</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-slate-800">IoT 플랫폼 개발자</h4>
                <p className="text-sm text-slate-600 mt-1">다양한 사물을 인터넷에 연결하고 제어하는 프로그램을 만듭니다.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                🔒
              </div>
              <div>
                <h4 className="font-bold text-slate-800">IoT 보안 전문가</h4>
                <p className="text-sm text-slate-600 mt-1">해킹으로 인해 집안의 정보가 유출되지 않도록 보안 시스템을 구축합니다.</p>
              </div>
            </div>
             <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                📊
              </div>
              <div>
                <h4 className="font-bold text-slate-800">빅데이터 분석가</h4>
                <p className="text-sm text-slate-600 mt-1">수많은 센서에서 수집된 방대한 데이터를 분석하여 유의미한 정보를 찾습니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Changing Jobs */}
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-2">
            <TrendingDown className="text-orange-600" />
            <h3 className="text-lg font-bold text-orange-900">변화하거나 사라지는 직업</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                👮
              </div>
              <div>
                <h4 className="font-bold text-slate-800">검침원 / 단순 관리인</h4>
                <p className="text-sm text-slate-600 mt-1">가스나 수도 사용량을 원격으로 자동 검침하게 되면서 직접 방문할 필요가 줄어듭니다.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-2xl">
                🏭
              </div>
              <div>
                <h4 className="font-bold text-slate-800">단순 조립 생산직</h4>
                <p className="text-sm text-slate-600 mt-1">스마트 팩토리 도입으로 단순 반복 작업은 로봇과 자동화 시스템이 대체합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTab;