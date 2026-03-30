import React, { useState } from 'react';
import { Cable, Wifi, ShieldCheck, Zap, Laptop, Monitor, Smartphone, Check, SmartphoneCharging } from 'lucide-react';
import { CONCEPTS } from '../constants';
import { NetworkType } from '../types';

interface ConceptTabsProps {
  onComplete: () => void;
}

export const ConceptTabs: React.FC<ConceptTabsProps> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<NetworkType>('WIRED');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const data = CONCEPTS[activeTab];

  return (
    <div className="w-full space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">네트워크 방식 비교</h2>
        <p className="text-slate-500 text-sm mt-1">탭을 눌러 각 특징을 확인해보세요.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
        <button
          onClick={() => setActiveTab('WIRED')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'WIRED'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Cable className="w-4 h-4" />
          유선 (Wired)
        </button>
        <button
          onClick={() => setActiveTab('WIRELESS')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'WIRELESS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Wifi className="w-4 h-4" />
          무선 (Wireless)
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <div className={`h-2 w-full ${activeTab === 'WIRED' ? 'bg-slate-800' : 'bg-blue-600'}`} />
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${activeTab === 'WIRED' ? 'bg-slate-100 text-slate-800' : 'bg-blue-50 text-blue-600'}`}>
              {activeTab === 'WIRED' ? <Monitor className="w-8 h-8" /> : <Smartphone className="w-8 h-8" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{data.title}</h3>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">{data.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 장점
              </h4>
              <ul className="space-y-2">
                {data.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-green-900 flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <h4 className="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" /> 단점
              </h4>
              <ul className="space-y-2">
                {data.cons.map((con, idx) => (
                  <li key={idx} className="text-sm text-red-900 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
             <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Examples</p>
             <div className="flex flex-wrap gap-2">
               {data.examples.map((ex, idx) => (
                 <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                   {ex}
                 </span>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Deep Dive & Next Button Area */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
           onClick={() => setIsModalOpen(true)}
           className="flex-1 px-4 py-3 bg-white border border-blue-200 text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <SmartphoneCharging className="w-4 h-4" />
          심화: 핫스팟 vs 테더링
        </button>
        
        <button
          onClick={onComplete}
          className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          시뮬레이션 게임 시작
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-slate-800">더 알아보기</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
               <div className="space-y-2">
                 <div className="flex items-center gap-2 mb-1">
                   <Wifi className="w-5 h-5 text-blue-600" />
                   <h4 className="font-bold text-slate-900">모바일 핫스팟 (Hotspot)</h4>
                 </div>
                 <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg leading-relaxed">
                   스마트폰을 <span className="font-bold text-blue-700">무선 공유기(AP)</span>처럼 만들어 주변 기기들이 Wi-Fi로 접속하게 해줍니다. 
                   <br/>👉 <strong>장점:</strong> 여러 기기 동시 연결 가능.
                   <br/>👉 <strong>단점:</strong> 배터리 소모가 크고 발열 발생.
                 </p>
               </div>
               
               <div className="space-y-2">
                 <div className="flex items-center gap-2 mb-1">
                   <Cable className="w-5 h-5 text-slate-700" />
                   <h4 className="font-bold text-slate-900">테더링 (Tethering)</h4>
                 </div>
                 <p className="text-sm text-slate-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
                   스마트폰과 기기를 <span className="font-bold text-slate-800">USB 케이블</span>이나 블루투스로 1:1 연결하여 인터넷을 공유합니다.
                   <br/>👉 <strong>장점:</strong> USB 연결 시 충전과 동시에 사용 가능, 보안성 우수.
                   <br/>👉 <strong>단점:</strong> 1:1 연결이 기본이며 선이 필요함(USB).
                 </p>
               </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700"
              >
                이해했어요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};