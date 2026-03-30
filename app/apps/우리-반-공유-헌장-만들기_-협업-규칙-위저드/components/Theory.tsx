import React from 'react';
import { Shield, Lock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-8 h-8 text-indigo-600" />
          공유의 3대 핵심 요소
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">
              1
            </div>
            <h3 className="font-bold text-lg mb-2">권한 (Permission)</h3>
            <p className="text-slate-600 text-sm">
              누구에게 어디까지 허용할 것인가? '보기'와 '편집'은 완전히 다른 세상입니다. 
              최소 권한의 원칙을 지키세요.
            </p>
          </div>
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600 font-bold text-xl">
              2
            </div>
            <h3 className="font-bold text-lg mb-2">검사 (Inspection)</h3>
            <p className="text-slate-600 text-sm">
              공유하기 전에 저작권, 개인정보, 악성코드 여부를 반드시 검사해야 합니다. 
              한 번 올라간 자료는 되돌리기 어렵습니다.
            </p>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600 font-bold text-xl">
              3
            </div>
            <h3 className="font-bold text-lg mb-2">책임 (Responsibility)</h3>
            <p className="text-slate-600 text-sm">
              문제가 생겼을 때의 대응 매뉴얼입니다. 신고, 삭제, 사과 등 사후 대처가 
              빠를수록 피해를 줄일 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            흔한 오해 바로잡기
          </h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-slate-700">
              <span className="text-rose-500 font-bold">X</span>
              <span>"비밀번호만 걸면 무조건 안전하다?" <br/> <span className="text-xs text-slate-500">→ 비밀번호도 유출될 수 있습니다. 2단계 인증이 필요합니다.</span></span>
            </li>
            <li className="flex gap-3 text-slate-700">
              <span className="text-rose-500 font-bold">X</span>
              <span>"친구 사진이니까 그냥 올려도 되겠지?" <br/> <span className="text-xs text-slate-500">→ 초상권 침해입니다. 반드시 허락을 구하세요.</span></span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-sky-600">
            <Lock className="w-5 h-5" />
            클라우드 협업, 왜 좋을까요?
          </h3>
           <ul className="space-y-3">
            <li className="flex gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
              <span>실시간 동기화로 버전 관리가 쉽습니다.</span>
            </li>
            <li className="flex gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
              <span>랜섬웨어에 걸려도 이전 시점으로 복구가 가능합니다.</span>
            </li>
            <li className="flex gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-sky-500 shrink-0" />
              <span>접근 기록(로그)이 남아 누가 무엇을 했는지 알 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};