import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const QUESTIONS = [
  {
    q: "이상치(Anomaly)에 대한 설명으로 가장 적절하지 않은 것은?",
    options: [
      "전체 데이터 분포에서 크게 벗어난 값이다.",
      "이상치는 항상 데이터 입력 오류(Error)이므로 삭제해야 한다.",
      "이상치 탐지는 정답 라벨이 없는 비지도 학습의 한 종류다.",
      "어떤 기준(Threshold)을 정하느냐에 따라 이상치 여부가 달라진다."
    ],
    a: 1,
    expl: "이상치는 오류일 수도 있지만, 새로운 발견(예: 신용카드 도난, 희귀 질병)일 수도 있습니다. 무조건 삭제하면 안 됩니다."
  },
  {
    q: "다음 중 이상치 탐지가 활용되는 사례가 아닌 것은?",
    options: [
      "공장 기계의 평소와 다른 진동 감지",
      "이메일 스팸 분류 (스팸/정상)",
      "새로운 고객 그룹(군집) 찾기",
      "디도스(DDoS) 공격 트래픽 감지"
    ],
    a: 2,
    expl: "새로운 고객 그룹을 찾는 것은 '군집화(Clustering)'의 영역입니다. 스팸 분류는 보통 지도 학습이지만, 이상치 탐지로도 접근 가능합니다. 그러나 군집 찾기가 가장 거리가 멉니다."
  },
  {
    q: "이상치 판단 기준(Threshold)을 너무 낮게 설정했을 때 발생하는 문제는?",
    options: [
      "이상치를 전혀 찾지 못한다.",
      "정상 데이터도 이상치라고 잘못 판단하는 경우(False Positive)가 늘어난다.",
      "계산 속도가 매우 빨라진다.",
      "데이터가 모두 삭제된다."
    ],
    a: 1,
    expl: "기준을 낮추면(엄격하게 하면) 조금만 튀어도 이상치로 보게 되어, 정상인 데이터도 범인으로 몰릴 확률이 높아집니다."
  }
];

export default function QuizTab() {
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1));
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[qIdx] = oIdx;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    return answers.reduce((acc, curr, idx) => (curr === QUESTIONS[idx].a ? acc + 1 : acc), 0);
  };

  const reset = () => {
    setAnswers(new Array(QUESTIONS.length).fill(-1));
    setShowResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">🕵️ 수사 능력 평가</h2>
        <p className="text-slate-400 mt-2">이론과 실전을 통해 배운 내용을 확인해보세요.</p>
      </div>

      <div className="space-y-6">
        {QUESTIONS.map((item, qIdx) => (
          <div key={qIdx} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex gap-2">
              <span className="text-indigo-400">Q{qIdx + 1}.</span> {item.q}
            </h3>
            
            <div className="space-y-2">
              {item.options.map((opt, oIdx) => {
                let btnClass = "w-full text-left p-3 rounded-lg border transition-all text-sm ";
                
                if (showResult) {
                    if (oIdx === item.a) btnClass += "bg-green-900/50 border-green-500 text-green-100";
                    else if (answers[qIdx] === oIdx && oIdx !== item.a) btnClass += "bg-red-900/50 border-red-500 text-red-100";
                    else btnClass += "bg-slate-900/50 border-slate-700 text-slate-400 opacity-50";
                } else {
                    if (answers[qIdx] === oIdx) btnClass += "bg-indigo-600 border-indigo-500 text-white";
                    else btnClass += "bg-slate-900 border-slate-600 text-slate-300 hover:bg-slate-700";
                }

                return (
                  <button 
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={showResult}
                    className={btnClass}
                  >
                    {opt}
                    {showResult && oIdx === item.a && <CheckCircle className="inline float-right w-4 h-4" />}
                    {showResult && answers[qIdx] === oIdx && oIdx !== item.a && <XCircle className="inline float-right w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-4 p-3 bg-slate-900/50 rounded-lg text-sm text-slate-300 border border-slate-700">
                <span className="font-bold text-indigo-400">해설:</span> {item.expl}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        {!showResult ? (
          <button 
            onClick={() => setShowResult(true)}
            disabled={answers.includes(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            채점하기
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xl font-bold text-white mb-4">
              총점: <span className="text-indigo-400">{calculateScore()}</span> / {QUESTIONS.length}
            </p>
            <button 
              onClick={reset}
              className="flex items-center gap-2 mx-auto bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-lg"
            >
              <RefreshCw size={18} /> 다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
