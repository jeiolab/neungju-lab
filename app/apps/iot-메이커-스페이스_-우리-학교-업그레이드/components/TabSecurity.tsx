import React from 'react';
import { ShieldAlert, Lock, UserX, AlertTriangle } from 'lucide-react';

const TabSecurity: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <ShieldAlert className="text-red-400 w-8 h-8" />
            내가 만든 시스템이 해킹당한다면?
          </h2>
          <p className="text-slate-300 leading-relaxed max-w-2xl">
            IoT 기기는 인터넷에 연결되어 있어 편리하지만, 보안이 뚫리면 현실 세계에 직접적인 피해를 줄 수 있습니다. 
            단순히 정보가 유출되는 것을 넘어 물리적인 사고로 이어질 수 있죠.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <ShieldAlert className="w-64 h-64" />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
            <UserX className="text-red-500" /> 사생활 침해 (카메라/마이크)
          </h3>
          <p className="text-slate-600 text-sm">
            학교에 설치된 인체 감지 센서나 CCTV가 해킹되면 학생들의 이동 경로나 얼굴이 실시간으로 유출될 수 있습니다.
            <br/><br/>
            <strong>🤔 생각할 점:</strong> 꼭 필요한 곳에만 센서를 설치하고, 데이터는 암호화해서 저장해야 합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="text-orange-500" /> 오작동 유발 (액추에이터 제어)
          </h3>
          <p className="text-slate-600 text-sm">
            해커가 창문 개폐 시스템을 조작해 비 오는 날 창문을 모두 열어버리거나, 화재 경보를 일부러 울려 혼란을 줄 수 있습니다.
            <br/><br/>
            <strong>🤔 생각할 점:</strong> 외부에서 제어할 수 있는 권한을 강력하게 제한해야 합니다.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
        <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5" /> 보안을 위한 3원칙
        </h3>
        <ul className="list-disc list-inside text-yellow-900 space-y-2 text-sm">
          <li><strong>비밀번호 관리:</strong> 초기 비밀번호(0000, 1234)는 반드시 변경하기.</li>
          <li><strong>펌웨어 업데이트:</strong> 기기의 보안 결함을 막기 위해 최신 소프트웨어 유지하기.</li>
          <li><strong>네트워크 분리:</strong> IoT 기기는 중요한 데이터가 있는 PC와 다른 네트워크(와이파이) 사용하기.</li>
        </ul>
      </div>
    </div>
  );
};

export default TabSecurity;