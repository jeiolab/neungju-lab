import React from 'react';
import { FileVideo, Cpu, Package } from 'lucide-react';

const Manual: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-2">기술 매뉴얼</h2>
        <p className="text-slate-300">스트리머 타이쿤 기술팀을 위한 대외비 자료입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Codec Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">코덱 (Codec)이란?</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            <strong>코덱</strong>은 <strong>Co</strong>mpressor(압축기)-<strong>Dec</strong>ompressor(해제기)의 약자입니다.
            거대한 원본 영상을 인터넷으로 보낼 수 있게 작게 줄이고, 다시 화면에 보여줄 수 있게 복구하는 소프트웨어입니다.
          </p>
          <ul className="space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
            <li><strong>H.264 (AVC):</strong> 업계 표준. 화질과 속도의 균형이 좋아 대부분의 방송 플랫폼에서 사용합니다.</li>
            <li><strong>H.265 (HEVC):</strong> 최신 기술. H.264보다 50% 더 잘 압축하지만, 컴퓨터 성능이 훨씬 더 필요합니다.</li>
            <li><strong>AV1:</strong> 미래 기술. 무료 오픈소스이며 효율이 매우 좋지만, 구형 컴퓨터에서는 매우 느립니다.</li>
          </ul>
        </div>

        {/* Container Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">컨테이너 (포맷)</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            코덱이 내용물이라면, <strong>컨테이너</strong>는 택배 상자입니다.
            영상 데이터, 소리 데이터, 자막 등을 하나의 파일로 묶어줍니다.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-3 rounded hover:bg-orange-50 transition-colors">
              <h4 className="font-bold text-gray-900">.MP4</h4>
              <p className="text-xs text-gray-500">호환성 최고. 유튜브, 트위치, 웹 어디서든 잘 열립니다.</p>
            </div>
            <div className="border p-3 rounded hover:bg-orange-50 transition-colors">
              <h4 className="font-bold text-gray-900">.MKV</h4>
              <p className="text-xs text-gray-500">거의 모든 코덱을 담을 수 있습니다. 보관용으로 좋지만 방송용으로는 부적합.</p>
            </div>
            <div className="border p-3 rounded hover:bg-orange-50 transition-colors">
              <h4 className="font-bold text-gray-900">.AVI</h4>
              <p className="text-xs text-gray-500">옛날 방식. 용량이 너무 큽니다. 꼭 필요한 경우가 아니면 피하세요.</p>
            </div>
            <div className="border p-3 rounded hover:bg-orange-50 transition-colors">
              <h4 className="font-bold text-gray-900">.MOV</h4>
              <p className="text-xs text-gray-500">애플 포맷. 화질이 좋아 전문 편집에 쓰입니다.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
            <FileVideo className="text-blue-600" />
            <h3 className="font-bold text-blue-800">비트레이트와 대역폭: 황금률</h3>
        </div>
        <p className="text-blue-900">
          <strong>비트레이트(Bitrate)</strong>는 1초에 보내는 데이터의 양입니다 (예: 5000 kbps). <br />
          만약 <strong>비트레이트</strong>가 인터넷 <strong>대역폭(Bandwidth)</strong>보다 높으면 데이터가 제때 도착하지 못합니다.
          이것이 바로 시청자들이 싫어하는 <span className="font-bold text-red-600">버퍼링</span>의 원인입니다.
        </p>
      </div>
    </div>
  );
};

export default Manual;