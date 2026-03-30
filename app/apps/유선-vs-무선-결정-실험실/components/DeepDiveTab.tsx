import React, { useState } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';

const OX_QUESTIONS = [
  { q: "전파 간섭은 물리적인 벽 때문에만 생긴다?", a: false, exp: "아니요! 전자레인지, 블루투스 등 다른 전자기기의 전파 때문에도 발생합니다." },
  { q: "무선 네트워크는 누구나 신호를 잡을 수 있어 보안 설정이 필수다?", a: true, exp: "맞습니다! 공중으로 퍼지는 전파 특성상 암호화가 없으면 도청될 수 있습니다." },
  { q: "5GHz 와이파이는 2.4GHz보다 항상 더 멀리 간다?", a: false, exp: "아니요! 5GHz는 속도는 빠르지만 장애물 통과력이 약해 도달 거리가 짧습니다." },
];

const DeepDiveTab: React.FC = () => {
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const handleAnswer = (idx: number, choice: boolean) => {
    const newAnswers = [...answers];
    newAnswers[idx] = choice;
    setAnswers(newAnswers);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-slate-800">심화 학습: 왜 그럴까?</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-3">📡 통신 간섭 (Interference)</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">
            와이파이는 눈에 보이지 않는 <strong>'주파수'</strong>라는 고속도로를 이용합니다. 
            만약 옆집 와이파이나 전자레인지가 같은 차선(채널)을 쓴다면? 
            자동차가 막히는 것처럼 데이터 전송도 느려집니다. 이것을 <strong>전파 간섭</strong>이라고 합니다.
          </p>
          <div className="bg-white p-3 rounded-lg text-xs text-indigo-800 font-medium">
            💡 팁: 2.4GHz 대역은 간섭이 심해요. 5GHz를 쓰면 더 쾌적할 수 있습니다!
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
          <h3 className="text-lg font-bold text-orange-900 mb-3">🔒 보안 설정이 중요한 이유</h3>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">
            유선은 선을 직접 꽂아야 해킹할 수 있지만, 무선은 공유기 반경 50m 내에 있는 해커가 
            전파를 가로챌 수 있습니다. <br/>
            그래서 <strong>WPA2/WPA3</strong> 같은 강력한 암호화를 걸어두지 않으면, 
            여러분이 보는 웹사이트나 비밀번호가 노출될 수 있습니다.
          </p>
          <div className="bg-white p-3 rounded-lg text-xs text-orange-800 font-medium">
            💡 팁: 카페에서 '자물쇠' 없는 와이파이로 금융거래는 절대 금물!
          </div>
        </div>
      </div>

      {/* OX Quiz */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <HelpCircle className="text-teal-500" /> 개념 확인 O/X 퀴즈
        </h3>
        <div className="space-y-4">
          {OX_QUESTIONS.map((item, idx) => (
            <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
              <p className="font-semibold text-slate-800 mb-3">Q{idx + 1}. {item.q}</p>
              
              {answers[idx] === null ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAnswer(idx, true)}
                    className="flex-1 bg-white border-2 border-slate-200 hover:border-blue-400 hover:text-blue-500 py-2 rounded-lg font-bold text-slate-400 transition-colors"
                  >
                    O
                  </button>
                  <button 
                    onClick={() => handleAnswer(idx, false)}
                    className="flex-1 bg-white border-2 border-slate-200 hover:border-red-400 hover:text-red-500 py-2 rounded-lg font-bold text-slate-400 transition-colors"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className={`p-3 rounded-lg text-sm font-medium ${answers[idx] === item.a ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {answers[idx] === item.a ? (
                    <span className="flex items-center gap-2"><Check className="w-4 h-4" /> 정답입니다!</span>
                  ) : (
                    <span className="flex items-center gap-2"><X className="w-4 h-4" /> 틀렸습니다.</span>
                  )}
                  <p className="mt-1 text-slate-600 font-normal">{item.exp}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeepDiveTab;
