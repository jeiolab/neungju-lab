import React from 'react';
import { SECTOR_INFO } from '../constants';
import { Home, Car, Stethoscope, Wallet } from 'lucide-react';

const iconMap: any = {
  home: Home,
  car: Car,
  stethoscope: Stethoscope,
  wallet: Wallet
};

const SectorFuturesTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">분야별 미래 변화</h2>
        <p className="text-slate-400 text-sm">20년 후 우리 생활은 어떻게 바뀔까요?</p>
      </div>

      <div className="grid gap-4">
        {SECTOR_INFO.map((info) => {
          const Icon = iconMap[info.icon];
          return (
            <div key={info.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Icon size={64} />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-700 rounded-lg text-cyan-400">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">{info.sector}</h3>
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center text-sm">
                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <span className="block text-xs text-slate-500 mb-1">2025 (현재)</span>
                  <span className="text-slate-300 font-medium">{info.current}</span>
                </div>

                <div className="text-slate-600">
                   →
                </div>

                <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/30">
                  <span className="block text-xs text-indigo-400 mb-1">2045 (미래)</span>
                  <span className="text-indigo-200 font-bold">{info.future}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorFuturesTab;