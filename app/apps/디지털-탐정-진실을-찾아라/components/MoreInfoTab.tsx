import React from 'react';
import { BookOpen, Share2, Heart, MessageCircle } from 'lucide-react';

const MoreInfoTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-600"/>
            디지털 에티켓 십계명
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 border-b pb-2">기본 원칙</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>자신이 대접받고 싶은 대로 남을 대접하라.</li>
                    <li>현실 공간보다 더 높은 윤리 의식을 가져라.</li>
                    <li>상대방의 시간과 대역폭을 존중하라.</li>
                    <li>자신의 지식을 나누고 도움을 주어라.</li>
                    <li>논쟁은 절제된 감정으로 참여하라.</li>
                </ul>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-700 border-b pb-2">실천 수칙</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>다른 사람의 사생활을 존중하라.</li>
                    <li>권력을 남용하지 마라.</li>
                    <li>다른 사람의 실수를 용서하라.</li>
                    <li>가짜 뉴스와 허위 정보를 생산하거나 유포하지 마라.</li>
                    <li>저작권을 준수하고 출처를 명확히 밝혀라.</li>
                </ul>
            </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-900 mb-4">올바른 정보 공유 체크리스트 (S.H.A.R.E)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="font-black text-2xl text-blue-500 mb-1">S</div>
                  <div className="font-bold text-gray-700 text-sm">Source</div>
                  <div className="text-xs text-gray-500">출처가 어디인가?</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="font-black text-2xl text-blue-500 mb-1">H</div>
                  <div className="font-bold text-gray-700 text-sm">Headline</div>
                  <div className="text-xs text-gray-500">제목이 자극적인가?</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="font-black text-2xl text-blue-500 mb-1">A</div>
                  <div className="font-bold text-gray-700 text-sm">Analyze</div>
                  <div className="text-xs text-gray-500">내용을 분석했나?</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="font-black text-2xl text-blue-500 mb-1">R</div>
                  <div className="font-bold text-gray-700 text-sm">Retouch</div>
                  <div className="text-xs text-gray-500">조작된 이미지는?</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="font-black text-2xl text-blue-500 mb-1">E</div>
                  <div className="font-bold text-gray-700 text-sm">Error</div>
                  <div className="text-xs text-gray-500">오타나 비문은?</div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MoreInfoTab;