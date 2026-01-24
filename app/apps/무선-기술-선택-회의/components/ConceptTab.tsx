import React, { useState } from 'react';
import { TECH_PROFILES } from '../constants';
import { Wifi, Bluetooth, Radio, CreditCard, Signal } from 'lucide-react';

const ConceptTab: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'WiFi': return <Wifi className="w-12 h-12 text-blue-500" />;
      case 'Bluetooth': return <Bluetooth className="w-12 h-12 text-indigo-500" />;
      case 'NFC': return <CreditCard className="w-12 h-12 text-green-500" />;
      case 'RFID': return <Radio className="w-12 h-12 text-orange-500" />;
      case 'Cellular': return <Signal className="w-12 h-12 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">무선 통신 기술 5대장</h2>
        <p className="text-gray-600">카드를 눌러 상세 스펙과 활용 사례를 확인해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECH_PROFILES.map((tech) => (
          <div
            key={tech.id}
            onClick={() => setActiveId(activeId === tech.id ? null : tech.id)}
            className={`
              relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300
              ${activeId === tech.id ? 'ring-4 ring-indigo-300 transform scale-105' : 'hover:shadow-xl hover:-translate-y-1'}
            `}
          >
            <div className="p-6 flex flex-col items-center">
              <div className="mb-4 bg-gray-50 p-4 rounded-full">{getIcon(tech.id)}</div>
              <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
              <p className="text-sm text-gray-500 text-center mb-4">{tech.description}</p>
              
              {activeId === tech.id && (
                <div className="w-full mt-4 space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">통신 거리</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${tech.distance}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">전송 속도</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${tech.speed}%` }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">보안성</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${tech.security}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="font-bold text-gray-700 mb-1">주요 활용:</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.typicalUses.map((use, idx) => (
                        <span key={idx} className="bg-white border border-gray-300 text-xs px-2 py-1 rounded-md">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeId !== tech.id && (
                <div className="text-blue-500 text-sm font-semibold mt-2">터치해서 상세정보 보기</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConceptTab;
