import React from 'react';
import { Fingerprint, Cpu, Lock, Eye } from 'lucide-react';

const FutureSecurity: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          미래의 보안 (Future Security)
        </h2>
        <p className="text-slate-600">비밀번호 없는 세상, 그리고 양자 컴퓨터의 위협.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Biometrics */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg group hover:border-indigo-400 transition-all">
          <div className="h-40 bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
             <Fingerprint className="w-24 h-24 text-indigo-300 opacity-30 absolute scale-150" />
             <Eye className="w-16 h-16 text-indigo-600 relative z-10" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">생체 인식 (Biometrics)</h3>
            <p className="text-slate-700 text-sm mb-4">
              지문, 홍채, 안면 인식 등 내 몸이 곧 열쇠가 되는 기술입니다. 
              FIDO(Fast Identity Online) 기술을 통해 비밀번호 없이도 안전하게 로그인할 수 있습니다.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded text-xs text-slate-700">
              <strong className="text-emerald-600">장점:</strong> 분실 우려 없음, 매우 편리함.<br/>
              <strong className="text-red-500">단점:</strong> 유출 시 변경 불가능 (지문을 바꿀 순 없으니까요).
            </div>
          </div>
        </div>

        {/* Quantum Cryptography */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg group hover:border-purple-400 transition-all">
          <div className="h-40 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
             <Cpu className="w-24 h-24 text-purple-300 opacity-30 absolute rotate-45" />
             <Lock className="w-16 h-16 text-purple-600 relative z-10" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-3">양자 암호 (Quantum Cryptography)</h3>
            <p className="text-slate-700 text-sm mb-4">
              양자 컴퓨터가 나오면 기존의 RSA 암호(소인수분해 기반)는 쉽게 뚫립니다. 
              이를 막기 위해 양자 내성 암호(PQC)와 양자 키 분배(QKD) 기술이 개발되고 있습니다.
            </p>
            <div className="bg-purple-50 border border-purple-200 p-3 rounded text-xs text-slate-700">
              <strong className="text-purple-600">핵심 원리:</strong> 양자 중첩과 얽힘 현상을 이용. 누군가 도청하면 데이터 상태가 변해버려 즉시 발각됨.
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
          <h3 className="text-slate-900 font-bold mb-2">🤔 생각해볼 문제</h3>
          <p className="text-slate-700 italic">
            "완벽한 보안 기술이 나오면 해커는 사라질까요? 아니면 해커들은 또 다른 방법(예: 사람의 심리를 이용한 사회공학적 해킹)을 찾아낼까요?"
          </p>
      </div>
    </div>
  );
};

export default FutureSecurity;