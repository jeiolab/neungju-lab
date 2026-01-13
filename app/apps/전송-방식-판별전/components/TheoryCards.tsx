import React, { useState } from 'react';
import { THEORY_DATA, SAFETY_CHECKLIST } from '../constants';
import { Wifi, Bluetooth, Nfc, Cloud, Smartphone, Cable, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { MethodType } from '../types';

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  bluetooth: Bluetooth,
  nfc: Nfc,
  cloud: Cloud,
  smartphone: Smartphone,
  cable: Cable
};

const TheoryCards: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (method: string) => {
    setExpanded(expanded === method ? null : method);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">무선 통신 기술 개념</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {THEORY_DATA.map((item) => {
            const Icon = iconMap[item.icon] || Wifi;
            const isExpanded = expanded === item.method;

            return (
              <div 
                key={item.method} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
                onClick={() => toggleExpand(item.method)}
              >
                <div className="p-5 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <button className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className={`px-5 pb-5 text-sm text-slate-600 ${isExpanded ? 'block' : 'hidden'}`}>
                    <p className="mb-3">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="font-semibold text-green-600 block mb-1">장점</span>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                {item.pros.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="font-semibold text-red-500 block mb-1">단점</span>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                {item.cons.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2" />
            공유 시 주의할 점 (Checklist)
        </h3>
        <ul className="space-y-3">
            {SAFETY_CHECKLIST.map((tip, idx) => (
                <li key={idx} className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3 accent-red-600" id={`check-${idx}`} />
                    <label htmlFor={`check-${idx}`} className="text-red-700 text-sm cursor-pointer">{tip}</label>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default TheoryCards;
