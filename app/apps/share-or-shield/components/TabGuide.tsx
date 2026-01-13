import React from 'react';

const TabGuide: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 font-tech">
          CLASSIFICATION PROTOCOL
        </h1>
        <p className="text-slate-400">데이터 센터 신입 요원을 위한 분류 가이드</p>
      </header>

      <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
            <i className="fas fa-shield-halved text-xl"></i>
          </div>
          <h2 className="text-xl font-bold text-red-400">SHIELD (보호해야 할 정보)</h2>
        </div>
        <ul className="space-y-3 text-slate-300">
          <li className="flex gap-2">
            <i className="fas fa-check text-red-500 mt-1"></i>
            <div>
              <strong className="text-white">개인정보:</strong> 주민등록번호, 여권번호, 운전면허번호 등 개인을 식별할 수 있는 고유 정보.
            </div>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-red-500 mt-1"></i>
            <div>
              <strong className="text-white">민감정보:</strong> 사상, 신념, 건강, 유전 정보, 범죄 기록 등 사생활을 현저히 침해할 우려가 있는 정보.
            </div>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-red-500 mt-1"></i>
            <div>
              <strong className="text-white">지식재산권(저작권):</strong> 유료 영화, 소설, 음원 등 저작권자의 허락 없이 공유하면 불법인 정보.
            </div>
          </li>
        </ul>
      </section>

      <section className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <i className="fas fa-share-nodes text-xl"></i>
          </div>
          <h2 className="text-xl font-bold text-blue-400">SHARE (공유해도 되는 정보)</h2>
        </div>
        <ul className="space-y-3 text-slate-300">
          <li className="flex gap-2">
            <i className="fas fa-check text-blue-500 mt-1"></i>
            <div>
              <strong className="text-white">공공데이터:</strong> 날씨, 교통 정보, 공원 위치 등 공공기관이 생성하여 개방한 데이터.
            </div>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-blue-500 mt-1"></i>
            <div>
              <strong className="text-white">CCL(크리에이티브 커먼즈):</strong> 저작자가 특정 조건(출처 표시 등)을 지키면 공유를 허락한 저작물.
            </div>
          </li>
          <li className="flex gap-2">
            <i className="fas fa-check text-blue-500 mt-1"></i>
            <div>
              <strong className="text-white">공익 정보:</strong> 재난 발생 시 대피소 위치, 전염병 발생 현황 등 생명과 안전을 위한 정보.
            </div>
          </li>
        </ul>
      </section>

       <section className="bg-emerald-900/20 rounded-xl p-6 border border-emerald-700/50">
        <h3 className="text-lg font-bold text-emerald-400 mb-2">Tip: 애매할 땐?</h3>
        <p className="text-slate-300">
          "이 정보가 만약 <strong>전 세계 모든 사람</strong>에게 공개된다면 나에게 피해가 올까?"를 생각해보세요. 조금이라도 불안하다면 <span className="text-red-400 font-bold">SHIELD</span>가 정답일 확률이 높습니다!
        </p>
      </section>
    </div>
  );
};

export default TabGuide;
