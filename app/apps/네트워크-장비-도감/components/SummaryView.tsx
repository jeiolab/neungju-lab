import React from 'react';
import { DEVICES } from '../constants';

export const SummaryView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">장비 핵심 요약 노트</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEVICES.map((device) => {
           const Icon = device.icon;
           return (
            <div key={device.id} className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 border-b pb-4 border-slate-100">
                <div className={`p-3 rounded-full ${device.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{device.name}</h3>
                  <span className="text-sm text-slate-500 font-medium">{device.role}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">비유</span>
                  <p className="text-slate-700">{device.metaphor}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">특징</span>
                  <p className="text-slate-600 text-sm">{device.description}</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2 py-1 rounded shrink-0 mt-0.5">키워드</span>
                  <p className="font-mono text-slate-900 font-bold">{device.techKey}</p>
                </div>
              </div>
            </div>
           );
        })}
      </div>
    </div>
  );
};