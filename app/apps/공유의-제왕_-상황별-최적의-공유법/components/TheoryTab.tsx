import React from 'react';
import { Network, Server, Share2, Cable, Wifi } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Wired vs Wireless */}
      <section className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
          <Share2 className="w-6 h-6" />
          1. 유선 vs 무선 공유
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Cable className="w-5 h-5 text-blue-600" /> 유선 공유 (Wired)
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li><span className="font-bold text-gray-800">도구:</span> USB, 외장하드, 랜선(LAN)</li>
              <li><span className="font-bold text-blue-600">장점:</span> 인터넷 불필요, 대용량 전송 속도 빠름, 보안 우수</li>
              <li><span className="font-bold text-red-500">단점:</span> 물리적 연결 필요, 분실 위험, 바이러스 감염 주의</li>
              <li><span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-800">Best:</span> 10GB 이상 영상, 인터넷 없는 환경</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-purple-600" /> 무선 공유 (Wireless)
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
              <li><span className="font-bold text-gray-800">도구:</span> 클라우드, 이메일, 블루투스/AirDrop</li>
              <li><span className="font-bold text-purple-600">장점:</span> 물리적 거리 제약 없음(클라우드), 편리함</li>
              <li><span className="font-bold text-red-500">단점:</span> 인터넷 환경 필수(클라우드), 속도 편차, 해킹 위험</li>
              <li><span className="text-xs bg-purple-100 px-2 py-0.5 rounded text-purple-800">Best:</span> 협업 문서, 소용량 사진</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cloud Service Models */}
      <section className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          2. 클라우드 서비스 모델 (XaaS)
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-green-200 bg-green-50 p-4 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-green-700 mb-2">SaaS</h3>
            <p className="text-xs text-green-600 mb-2">Software as a Service</p>
            <p className="text-sm text-gray-700 mb-3">
              설치 없이 웹에서 바로 쓰는 소프트웨어.
            </p>
            <div className="bg-white p-2 rounded text-xs text-gray-500">
              예: Google Drive, Notion, Canva
            </div>
          </div>

          <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-2">PaaS</h3>
            <p className="text-xs text-blue-600 mb-2">Platform as a Service</p>
            <p className="text-sm text-gray-700 mb-3">
              개발자가 앱을 만들 수 있는 플랫폼 제공.
            </p>
            <div className="bg-white p-2 rounded text-xs text-gray-500">
              예: Google App Engine, Heroku
            </div>
          </div>

          <div className="border border-orange-200 bg-orange-50 p-4 rounded-xl hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-orange-700 mb-2">IaaS</h3>
            <p className="text-xs text-orange-600 mb-2">Infrastructure as a Service</p>
            <p className="text-sm text-gray-700 mb-3">
              서버, 스토리지 등 인프라 장비 대여.
            </p>
            <div className="bg-white p-2 rounded text-xs text-gray-500">
              예: AWS EC2, Google Compute Engine
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
        <h2 className="text-xl font-bold mb-2">💡 조장의 꿀팁</h2>
        <p className="text-indigo-100">
          "무조건 편하다고 좋은 게 아니야! <br/>
          <strong>보안</strong>이 중요하면 USB나 암호화된 클라우드,<br/>
          <strong>속도</strong>가 중요하면 AirDrop이나 유선 전송을 고려해야 해."
        </p>
      </section>
    </div>
  );
};

export default TheoryTab;
