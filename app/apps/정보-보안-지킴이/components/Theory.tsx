'use client';

import React from 'react';
import { Shield, Key, RefreshCw, Smartphone } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          보안 기초 개념
        </h2>
        <p className="text-slate-600 mb-6">
          정보 보안은 어렵지 않습니다. 우리 일상 속 작은 습관들이 모여 강력한 방패가 됩니다.
          가장 중요한 세 가지 원칙을 알아봅시다.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Key className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">1. 강력한 비밀번호</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            비밀번호는 집 열쇠와 같습니다. 
            <br/><br/>
            <strong className="text-blue-600">규칙:</strong><br/>
            - 12자리 이상 권장<br/>
            - 대소문자, 숫자, 특수문자 혼합<br/>
            - 개인정보(생일, 전화번호) 포함 금지<br/>
            - 사이트마다 다르게 설정
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">2. 2단계 인증 (2FA)</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            비밀번호가 털려도 안전할 수 있는 최후의 보루입니다.
            <br/><br/>
            <strong className="text-emerald-600">원리:</strong><br/>
            로그인 시, 비밀번호 외에 내가 가진 기기(스마트폰)로 전송된 
            일회용 번호를 입력해야만 접속이 가능합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">3. 소프트웨어 업데이트</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            귀찮다고 미루는 업데이트, 해커들이 가장 좋아합니다.
            <br/><br/>
            <strong className="text-amber-600">중요성:</strong><br/>
            업데이트는 새로운 기능뿐만 아니라, 발견된 보안 취약점을 막아주는 
            '보안 패치'를 포함하고 있습니다. 항상 최신 버전을 유지하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Theory;