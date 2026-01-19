import React from 'react';

const DeepDiveTab: React.FC<{ onRead: () => void }> = ({ onRead }) => {
  // Simple check to mark as read when user reaches bottom or spends time
  React.useEffect(() => {
    const timer = setTimeout(() => {
        onRead();
    }, 3000); // Auto-award after 3 seconds of "reading" for simplicity in this demo
    return () => clearTimeout(timer);
  }, [onRead]);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
      <div className="border-b border-slate-100 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">심층 탐구: AI 암흑기와 극복</h2>
        <p className="text-slate-500">왜 인공지능 연구는 두 번의 긴 겨울을 맞이해야 했을까요?</p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold text-indigo-700 mb-3">1. 첫 번째 겨울: 과도한 약속 (1970년대 중반)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            초기 AI 연구자들은 "10년 안에 컴퓨터가 체스 챔피언을 이기고, 모든 언어를 번역할 것"이라고 호언장담했습니다.
            하지만 당시의 하드웨어(컴퓨팅 파워)와 데이터 처리 능력은 현저히 부족했습니다.
          </p>
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400 text-sm text-orange-800">
            <strong>XOR 문제:</strong> 퍼셉트론(초기 신경망)이 단순한 논리 연산조차 못한다는 사실이 수학적으로 증명되면서(민스키와 페퍼트), 신경망 연구에 대한 지원이 전면 중단되었습니다.
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-indigo-700 mb-3">2. 두 번째 겨울: 전문가 시스템의 한계 (1980년대 후반)</h3>
          <p className="text-slate-700 leading-relaxed mb-4">
            기업들은 '전문가 시스템'에 막대한 투자를 했습니다. 하지만 이 시스템은 새로운 상황에 대처하지 못했고, 유지보수 비용이 너무 많이 들었습니다.
            "비싸기만 하고 쓸모가 제한적이다"라는 인식이 퍼지며 다시 한번 투자가 끊겼습니다.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-indigo-700 mb-3">3. 어떻게 극복했나? (2000년대 이후)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl mb-2">💾</div>
              <h4 className="font-bold text-slate-800">빅데이터</h4>
              <p className="text-xs text-slate-500">인터넷으로 인한 데이터 폭발</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-bold text-slate-800">GPU</h4>
              <p className="text-xs text-slate-500">병렬 연산 능력의 비약적 발전</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-bold text-slate-800">딥러닝</h4>
              <p className="text-xs text-slate-500">스스로 특징을 찾는 알고리즘</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DeepDiveTab;
