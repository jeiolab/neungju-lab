import React from 'react';
import { UserProgress } from '../types';

interface Props {
  userProgress: UserProgress;
}

const TabMoreInfo: React.FC<Props> = ({ userProgress }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Badges Widget */}
      <div className="md:col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          🏅 나의 배지 컬렉션
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {userProgress.badges.map(badge => (
            <div key={badge.id} className={`flex flex-col items-center p-4 rounded-xl transition-all ${badge.unlocked ? 'bg-white/10' : 'bg-white/5 opacity-50 grayscale'}`}>
              <div className="text-4xl mb-3">{badge.icon}</div>
              <div className="font-bold text-sm mb-1">{badge.name}</div>
              <div className="text-xs text-gray-400 text-center">{badge.description}</div>
              {!badge.unlocked && <div className="mt-2 text-[10px] uppercase tracking-wider bg-black/30 px-2 py-1 rounded">Locked</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Reading 1 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-blue-600">🏫 학교 안전과 IoT</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          학교에는 화재 감지기뿐만 아니라 공기질 측정기, 자동 조명 제어 등 다양한 IoT 시스템이 숨어 있습니다.
          특히 급식실의 가스 누출 경보기는 오늘 배운 "센서-판단-출력" 과정을 매우 빠르게 수행하여 대형 사고를 막습니다.
          여러분이 설계한 화재 경보기는 교실 천장에 있는 '열 감지기' 또는 '연기 감지기'와 같은 원리입니다.
        </p>
      </div>

      {/* Reading 2 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-purple-600">🧑‍💻 진로 가이드: 임베디드 엔지니어</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          오늘 한 활동이 재미있었나요? 하드웨어(센서)와 소프트웨어(판단 로직)를 연결하는 일을 하는 사람을 '임베디드(Embedded) 시스템 개발자'라고 합니다.
          자동차, 스마트폰, 로봇 청소기 등 우리 주변의 모든 똑똑한 기계는 이 엔지니어들의 손을 거칩니다.
          <br/><br/>
          <strong>관련 학과:</strong> 전자공학과, 컴퓨터공학과, 임베디드소프트웨어과
        </p>
      </div>
    </div>
  );
};

export default TabMoreInfo;