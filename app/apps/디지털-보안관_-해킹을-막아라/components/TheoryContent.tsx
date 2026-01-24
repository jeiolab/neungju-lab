import React from 'react';
import { Shield, Lock, Cpu, Eye, FileWarning, Wifi } from 'lucide-react';

export const TheoryContent: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto text-slate-800">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="text-blue-600" /> 개인정보 보호의 기초
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          개인정보란 살아있는 개인에 관한 정보로서 성명, 주민등록번호 등을 통해 개인을 알아볼 수 있는 정보를 말합니다. 
          해커들은 여러분의 사소한 정보(생일, 애완동물 이름)를 조합해 비밀번호를 알아냅니다.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-blue-700">
          <li>SNS에 과도한 신상 정보(학교, 집 위치) 올리지 않기</li>
          <li>사이트마다 다른 비밀번호 사용하기</li>
          <li>2단계 인증(2FA) 반드시 활성화하기</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-red-500" /> 악성 프로그램
          </h3>
          <p className="text-xs text-slate-500">
            바이러스, 웜, 트로이목마, 랜섬웨어 등 시스템에 해를 끼치는 소프트웨어를 총칭합니다. 출처가 불분명한 파일은 절대 실행 금지!
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-500" /> 암호화 (Encryption)
          </h3>
          <p className="text-xs text-slate-500">
            데이터를 엉망진창으로 섞어 열쇠(Key)가 없으면 알아볼 수 없게 만드는 기술입니다. HTTPS 웹사이트는 통신을 암호화합니다.
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-yellow-500" /> 방화벽 (Firewall)
          </h3>
          <p className="text-xs text-slate-500">
            네트워크의 성벽입니다. 허용된 통신만 통과시키고 수상한 접속 시도는 차단합니다. 항상 켜두세요.
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-500" /> 피싱 (Phishing)
          </h3>
          <p className="text-xs text-slate-500">
            가짜 사이트나 이메일로 낚시(Fishing)하듯 정보를 빼내는 수법입니다. URL 주소를 항상 확인하는 습관이 필요합니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TipsContent: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
       <div className="bg-white border-l-4 border-blue-500 p-6 rounded-r-xl shadow-md border-y border-r border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
             <Wifi className="w-5 h-5 text-blue-600" /> 내 PC 공유 폴더 해제 (Windows)
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600">
            <li>파일 탐색기 실행</li>
            <li>공유된 폴더 우클릭 → <span className="text-blue-600 font-bold">속성</span></li>
            <li>[공유] 탭 선택 → <span className="text-blue-600 font-bold">고급 공유</span> 클릭</li>
            <li><span className="text-red-500 font-bold">'선택한 폴더 공유'</span> 체크 해제</li>
            <li>확인 버튼 클릭</li>
          </ol>
       </div>

       <div className="bg-white border-l-4 border-green-500 p-6 rounded-r-xl shadow-md border-y border-r border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
             <Lock className="w-5 h-5 text-green-600" /> 스마트폰 위치 권한 관리
          </h3>
          <p className="text-sm text-slate-500 mb-3">꼭 필요한 앱(지도 등)에만 위치 권한을 허용하세요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Android</p>
                <p className="text-xs text-slate-500">설정 → 애플리케이션 → (앱 선택) → 권한 → 위치 → '앱 사용 중에만 허용' 또는 '거부'</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">iOS (iPhone)</p>
                <p className="text-xs text-slate-500">설정 → 개인정보 보호 및 보안 → 위치 서비스 → (앱 선택) → '안 함' 또는 '앱을 사용하는 동안'</p>
            </div>
          </div>
       </div>
    </div>
  );
};

export const ReflectionContent: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-white to-slate-100 p-8 rounded-2xl border border-slate-200 text-center max-w-2xl mx-auto shadow-lg">
            <h2 className="text-3xl font-black text-slate-900 mb-6">편리함 vs 보안</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                "비밀번호를 저장해두면 로그인이 편하지만, 해킹당하면 모든 것을 잃습니다."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-4">우리가 잃어버리는 것</h3>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li className="flex items-start gap-2">❌ <strong>자동 로그인:</strong> 공용 PC에서 로그아웃을 깜빡하면 개인정보가 노출됩니다.</li>
                        <li className="flex items-start gap-2">❌ <strong>쉬운 비밀번호:</strong> 기억하기 쉽지만, 해커도 맞추기 쉽습니다.</li>
                        <li className="flex items-start gap-2">❌ <strong>모든 권한 허용:</strong> 앱 설치가 빠르지만, 내 연락처가 유출될 수 있습니다.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-green-600 mb-4">보안관의 조언</h3>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li className="flex items-start gap-2">✅ <strong>불편함은 안전의 비용:</strong> 2단계 인증의 10초가 계정을 평생 지킵니다.</li>
                        <li className="flex items-start gap-2">✅ <strong>최소 권한 원칙:</strong> 꼭 필요한 권한만 앱에 부여하세요.</li>
                        <li className="flex items-start gap-2">✅ <strong>백업 생활화:</strong> 랜섬웨어에 걸려도 백업이 있다면 안전합니다.</li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 p-4 bg-slate-50 rounded-xl inline-block border border-slate-200">
                <p className="font-mono text-blue-600 font-bold">
                    "완벽한 보안은 없습니다. 하지만 더 높은 보안 장벽은 해커를 포기하게 만듭니다."
                </p>
            </div>
        </div>
    )
}