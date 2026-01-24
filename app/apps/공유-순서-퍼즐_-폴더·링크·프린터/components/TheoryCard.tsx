import React from 'react';
import { Share2, Lock, Send, Monitor, Cloud, Printer } from 'lucide-react';

interface TheoryCardProps {
  onClose: () => void;
}

const TheoryCard: React.FC<TheoryCardProps> = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">공유의 기초 이론</h2>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors">닫기</button>
      </div>

      {/* Core Concept */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
        <h3 className="text-lg font-bold text-gray-800 mb-2">공유의 핵심 4단계 흐름</h3>
        <p className="text-gray-600 mb-4">네트워크 공유는 단순히 "보내기"가 아닙니다. 아래 4단계가 순서대로 이루어져야 합니다.</p>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Share2 size={24} />
            </div>
            <span className="font-bold text-sm">1. 연결 (Connection)</span>
            <p className="text-xs text-gray-500 mt-1">같은 네트워크, IP 확인</p>
          </div>
          <div className="h-0.5 w-8 bg-gray-300 md:block hidden"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={24} />
            </div>
            <span className="font-bold text-sm">2. 권한 (Permission)</span>
            <p className="text-xs text-gray-500 mt-1">누가 볼 수 있는가?</p>
          </div>
          <div className="h-0.5 w-8 bg-gray-300 md:block hidden"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Send size={24} />
            </div>
            <span className="font-bold text-sm">3. 전달 (Delivery)</span>
            <p className="text-xs text-gray-500 mt-1">경로/링크 알려주기</p>
          </div>
          <div className="h-0.5 w-8 bg-gray-300 md:block hidden"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Monitor size={24} />
            </div>
            <span className="font-bold text-sm">4. 검증 (Verification)</span>
            <p className="text-xs text-gray-500 mt-1">제대로 열리는지 확인</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OS Differences */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Monitor className="mr-2 text-gray-600" /> 운영체제가 다르면?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            윈도우(Windows)와 맥(macOS)은 파일 시스템(NTFS vs APFS)과 통신 프로토콜(SMB 등) 설정이 복잡할 수 있습니다.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 text-sm mb-1 flex items-center">
              <Cloud size={16} className="mr-1"/> 해결책: 클라우드 (Cloud)
            </h4>
            <p className="text-xs text-blue-700">
              구글 드라이브, 드롭박스 등 클라우드는 <strong>웹 표준</strong>을 따르기 때문에, OS에 상관없이 브라우저만 있으면 파일에 접근할 수 있습니다. 호환성 문제의 가장 강력한 해결책입니다.
            </p>
          </div>
        </div>

        {/* Printer Logic */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Printer className="mr-2 text-gray-600" /> 프린터 공유의 오해
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-red-500 mr-2 font-bold">X</span>
              <span>"선만 꽂으면 다 된다?" → 드라이버(번역기)가 없으면 컴퓨터는 프린터를 '알 수 없는 장치'로 인식합니다.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2 font-bold">X</span>
              <span>"IP 주소 몰라도 된다?" → 자동 검색이 실패하면, 프린터가 살고 있는 주소(IP)를 직접 입력해줘야 찾아갈 수 있습니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TheoryCard;