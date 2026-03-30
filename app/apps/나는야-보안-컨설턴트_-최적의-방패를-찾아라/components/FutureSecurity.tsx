import React from 'react';
import { Fingerprint, Cpu, Lock, Eye } from 'lucide-react';

const FutureSecurity: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          미래의 보안 (Future Security)
        </h2>
        <p className="text-slate-500">비밀번호 없는 세상, 그리고 양자 컴퓨터의 위협.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Biometrics */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:border-blue-300 transition-all">
          <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden border-b border-slate-200">
             <Fingerprint className="w-24 h-24 text-blue-400 opacity-30 absolute scale-150" />
             <Eye className="w-16 h-16 text-blue-600 relative z-10" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">생체 인식 (Biometrics)</h3>
            <p className="text-slate-600 text-sm mb-4">
              지문, 홍채, 안면 인식 등 내 몸이 곧 열쇠가 되는 기술입니다. 
              FIDO(Fast Identity Online) 기술을 통해 비밀번호 없이도 안전하게 로그인할 수 있습니다.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 border border-slate-200">
              <strong className="text-green-600">장점:</strong> 분실 우려 없음, 매우 편리함.<br/>
              <strong className="text-red-600">단점:</strong> 유출 시 변경 불가능 (지문을 바꿀 순 없으니까요).
            </div>
          </div>
        </div>

        {/* Quantum Cryptography */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group hover:border-indigo-300 transition-all">
          <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden border-b border-slate-200">
             <Cpu className="w-24 h-24 text-indigo-400 opacity-30 absolute rotate-45" />
             <Lock className="w-16 h-16 text-indigo-600 relative z-10" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">양자 암호 (Quantum Cryptography)</h3>
            <p className="text-slate-600 text-sm mb-4">
              양자 컴퓨터가 나오면 기존의 RSA 암호(소인수분해 기반)는 쉽게 뚫립니다. 
              이를 막기 위해 양자 내성 암호(PQC)와 양자 키 분배(QKD) 기술이 개발되고 있습니다.
            </p>
            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 border border-slate-200">
              <strong className="text-indigo-600">핵심 원리:</strong> 양자 중첩과 얽힘 현상을 이용. 누군가 도청하면 데이터 상태가 변해버려 즉시 발각됨.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
          <h3 className="text-slate-800 font-bold mb-2">🤔 생각해볼 문제</h3>
          <p className="text-slate-600 italic">
            "완벽한 보안 기술이 나오면 해커는 사라질까요? 아니면 해커들은 또 다른 방법(예: 사람의 심리를 이용한 사회공학적 해킹)을 찾아낼까요?"
          </p>
      </div>
    </div>
  );
};

export default FutureSecurity;
