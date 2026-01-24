import React from 'react';
import { Globe, Lock, Unlock } from 'lucide-react';

export const TabDeepDive: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      
      {/* IPv4 vs IPv6 */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-blue-600" size={32} />
          <h2 className="text-2xl font-bold text-slate-800">IPv4 vs IPv6: 세대 교체</h2>
        </div>
        
        <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4">구분</th>
                <th scope="col" className="px-6 py-4 bg-blue-50 text-blue-800">IPv4 (현재 주류)</th>
                <th scope="col" className="px-6 py-4 bg-green-50 text-green-800">IPv6 (차세대)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900">주소 길이</th>
                <td className="px-6 py-4">32비트 (숫자 4개 묶음)</td>
                <td className="px-6 py-4">128비트 (복잡한 문자열)</td>
              </tr>
              <tr className="bg-slate-50 border-b">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900">주소 개수</th>
                <td className="px-6 py-4">약 43억 개 (고갈됨)</td>
                <td className="px-6 py-4">무한에 가까움</td>
              </tr>
              <tr className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900">표시 예시</th>
                <td className="px-6 py-4 font-mono">192.168.0.1</td>
                <td className="px-6 py-4 font-mono">2001:0db8:85a3:0000...</td>
              </tr>
              <tr className="bg-slate-50">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900">보안성</th>
                <td className="px-6 py-4">별도 보안 장비 필요</td>
                <td className="px-6 py-4">보안 기능 기본 내장</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Public vs Private IP */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1">
             <Unlock className="text-orange-500" />
             <Lock className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">공인 IP vs 사설 IP</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Public IP Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-400">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Globe size={20} className="text-orange-500"/> 공인 IP (Public)
            </h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              전 세계에서 유일하게 식별되는 주소입니다. 인터넷 서비스 제공업체(ISP)로부터 할당받으며, 
              외부 인터넷과 직접 통신이 가능합니다. 우리 집 대문 밖의 실제 도로명 주소와 같습니다.
            </p>
            <div className="bg-orange-50 p-3 rounded-lg text-xs font-mono text-orange-800">
              예: 220.123.45.67 (네이버, 구글 등)
            </div>
          </div>

          {/* Private IP Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Lock size={20} className="text-green-600"/> 사설 IP (Private)
            </h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              공유기 내부에서만 쓰이는 주소입니다. 외부에서는 이 주소를 바로 찾을 수 없어 보안상 안전하며,
              IP 부족 문제를 해결하기 위해 사용됩니다. 우리 집 안방, 거실 같은 내부 지칭입니다.
            </p>
            <div className="bg-green-50 p-3 rounded-lg text-xs font-mono text-green-800">
              예: 192.168.0.x, 10.x.x.x
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};