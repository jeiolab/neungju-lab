import React from 'react';
import { BookOpen, Zap, Shield, Armchair } from 'lucide-react';

const TheorySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-blue-500" />
          <h3 className="font-bold text-lg">속도 (Speed)</h3>
        </div>
        <p className="text-sm text-gray-600">
          "무조건 빠른 게 좋을까?"<br/>
          대역폭(Bandwidth)과 지연시간(Latency)이 핵심. 
          대용량 파일은 <strong>유선(USB/Thunderbolt)</strong>이 가장 빠르지만, 
          물리적 거리가 멀면 <strong>인터넷(클라우드)</strong>이 유일한 답일 수도 있어요.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="text-green-500" />
          <h3 className="font-bold text-lg">보안 (Security)</h3>
        </div>
        <p className="text-sm text-gray-600">
          "편하면 위험하다?"<br/>
          공공 와이파이는 해킹 위험이 높아요. 
          <strong>암호화(Encryption)</strong>가 된 클라우드나, 
          네트워크를 아예 타지 않는 <strong>물리적 매체</strong>가 보안 점수가 높습니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
        <div className="flex items-center gap-2 mb-3">
          <Armchair className="text-purple-500" />
          <h3 className="font-bold text-lg">편의 (Convenience)</h3>
        </div>
        <p className="text-sm text-gray-600">
          "언제 어디서나?"<br/>
          접근성(Accessibility)이 핵심입니다. 
          <strong>클라우드(SaaS)</strong>는 기기 상관없이 접속되어 편의성이 압도적입니다. 
          반면 USB는 잃어버리면 끝이고 들고 다녀야 하죠.
        </p>
      </div>
    </div>
  );
};

export default TheorySection;
