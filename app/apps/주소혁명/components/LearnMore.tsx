import React from 'react';
import { SectionTitle } from './SectionTitle';
import { Terminal, Command } from 'lucide-react';

export const LearnMore: React.FC = () => {
  return (
    <section id="learn-more" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionTitle 
        title="더 알아보기: 직접 확인해보기" 
        subtitle="개발자처럼 내 컴퓨터의 IP 설정을 직접 확인해보세요."
      />
      
      <div className="grid lg:grid-cols-2 gap-12 items-center mt-12">
        <div className="space-y-8">
          <div className="flex gap-4 items-start">
            <div className="bg-slate-800 text-white p-3 rounded-lg mt-1 shrink-0">
              <Terminal size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">명령 프롬프트(CMD) 사용법</h3>
              <p className="text-slate-600 mb-4">
                윈도우 컴퓨터에서는 <code className="bg-slate-100 px-2 py-0.5 rounded text-pink-600 font-mono text-sm">ipconfig</code> 명령어를 통해 
                현재 할당된 IPv4 및 IPv6 주소를 자세히 확인할 수 있습니다.
              </p>
              <ol className="space-y-3">
                {[
                  "키보드에서 [Windows 키 + R]을 누릅니다.",
                  "실행 창이 뜨면 'cmd'를 입력하고 엔터를 칩니다.",
                  "검은색 창이 나오면 'ipconfig'라고 입력하고 엔터를 누릅니다.",
                  "결과 화면에서 'IPv4 주소'와 'IPv6 주소'를 찾아보세요."
                ].map((step, idx) => (
                  <li key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 font-medium text-sm sm:text-base">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
          <div className="relative bg-[#1e1e1e] rounded-lg shadow-2xl p-4 font-mono text-sm sm:text-base overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400 text-xs">Command Prompt</span>
            </div>
            <div className="space-y-1 text-gray-300">
              <p>C:\Users\Student&gt; <span className="text-white animate-pulse">ipconfig</span></p>
              <br/>
              <p>Windows IP 구성</p>
              <br/>
              <p>무선 LAN 어댑터 Wi-Fi:</p>
              <br/>
              <p className="pl-4">연결별 DNS 접미사. . . . :</p>
              <div className="pl-4 flex gap-2">
                <span>IPv6 주소 . . . . . . . . :</span>
                <span className="text-indigo-400 font-bold">2001:0db8:85a3::8a2e:0370</span>
              </div>
              <div className="pl-4 flex gap-2">
                <span>IPv4 주소 . . . . . . . . :</span>
                <span className="text-blue-400 font-bold">192.168.0.15</span>
              </div>
              <p className="pl-4">서브넷 마스크 . . . . . . : 255.255.255.0</p>
              <p className="pl-4">기본 게이트웨이 . . . . . : 192.168.0.1</p>
              <br/>
              <p>C:\Users\Student&gt; _</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};