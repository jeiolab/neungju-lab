import React, { useState } from 'react';
import { THEORY_DATA } from '../constants';
import { Wifi, Bluetooth, SmartphoneNfc, Radio } from 'lucide-react';
import { TechType } from '../types';

const IconMap = {
  [TechType.WIFI]: Wifi,
  [TechType.BLUETOOTH]: Bluetooth,
  [TechType.NFC]: SmartphoneNfc,
  [TechType.RFID]: Radio,
};

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-amber-600 mb-2">수사관 훈련 매뉴얼</h2>
        <p className="text-slate-600 leading-relaxed">
          현장에 나가기 전, 각 용의자(무선 기술)의 특징을 완벽히 파악해야 합니다.
          범인은 반드시 흔적(거리, 속도, 특징)을 남깁니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEORY_DATA.map((data) => {
          const Icon = IconMap[data.tech];
          return (
            <div key={data.tech} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-50 rounded-full text-blue-600 border border-blue-100">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{data.tech}</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="font-bold text-slate-500 w-12 shrink-0">거리:</span>
                  <span>{data.distance}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-slate-500 w-12 shrink-0">속도:</span>
                  <span>{data.speed}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-slate-500 w-12 shrink-0">특징:</span>
                  <span className="text-amber-700 font-medium bg-amber-50 px-1 rounded">{data.keyFeature}</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-slate-500 w-12 shrink-0">용도:</span>
                  <span>{data.usage}</span>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-center shadow-sm">
        <p className="text-sm text-blue-800 font-medium">💡 팁: '태깅'이라는 단어가 나오면 NFC나 RFID를 먼저 의심해보세요.</p>
      </div>
    </div>
  );
};