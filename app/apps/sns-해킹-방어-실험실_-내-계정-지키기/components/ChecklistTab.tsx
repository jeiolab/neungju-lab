'use client';

import React from 'react';
import { TIPS } from '../constants';
import { CheckSquare, MapPin } from 'lucide-react';

export const ChecklistTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="text-indigo-600" />
          장소별 보안 가이드
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {TIPS.map((tip, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100">
              <div className="bg-white text-xs font-bold px-2 py-1 rounded border border-slate-200 text-slate-500 shrink-0 shadow-sm">
                {tip.context}
              </div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl shadow-lg text-white">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckSquare className="w-6 h-6" />
            나만의 실천 체크리스트
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
            {[
                "내 계정 비밀번호는 10자리 이상인가?",
                "주요 사이트(Google, Naver 등)에 2FA를 켰는가?",
                "SNS 비공개 계정 전환을 고려해보았는가?",
                "폰에 백신 앱이 설치되어 있는가?"
            ].map((item, i) => (
                <label key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-colors border border-white/10">
                    <input type="checkbox" className="w-5 h-5 rounded border-2 border-white/50 text-indigo-500 focus:ring-offset-0 focus:ring-0 bg-transparent checked:bg-white checked:border-white transition-all" />
                    <span className="text-sm font-medium">{item}</span>
                </label>
            ))}
        </div>
      </div>
    </div>
  );
};