import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "K값이 커질수록(군집이 많아질수록) 일반적으로 어떤 현상이 발생하나요?",
    options: [
      "해석하기 쉬워진다.",
      "군집 내 데이터끼리의 거리(응집도)가 멀어진다.",
      "군집 내 데이터끼리 더 촘촘하게 뭉친다(응집도 상승).",
      "데이터 전체의 개수가 줄어든다."
    ],
    answer: 2,
    explanation: "K가 커지면 중심점이 많아져서 각 데이터가 자신의 중심점과 더 가까워집니다. 하지만 그룹이 너무 많아 복잡해질 수 있죠."
  },
  {
    id: 2,
    question: "다음 중 비지도 학습(Unsupervised Learning)에 해당하는 것은?",
    options: [
      "개와 고양이 사진을 라벨과 함께 학습시키기",
      "집 가격을 예측하기 위해 평수와 위치 데이터 학습시키기",
      "쇼핑몰 고객들을 구매 패턴에 따라 그룹으로 나누기",
      "스팸 메일인지 아닌지 분류하기"
    ],
    answer: 2,
    explanation: "정답(Label) 없이 데이터의 패턴(구매 습관)을 찾아 그룹화하는 것이 비지도 학습의 핵심입니다."
  },
  {
    id: 3,
    question: "현업에서 '완벽한 K'를 찾기 어려운 이유는?",
    options: [
      "컴퓨터 성능이 부족해서",
      "해석 가능성과 성능 간의 트레이드오프가 존재하기 때문",
      "K는 항상 3이어야 하기 때문",
      "데이터가 항상 완벽하기 때문"
    ],
    answer: 1,
    explanation: "수학적으로 응집도가 가장 높은 K가 비즈니스적으로는 너무 복잡해서 쓸모 없을 수도 있습니다. 항상 선택의 문제입니다."
  }
];

const Quiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === questions[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
        // Reset or finish
        alert(`퀴즈 종료! 점수: ${score}/${questions.length} ` + (selected === questions[currentQ].answer ? "(마지막 정답 포함)" : ""));
        setCurrentQ(0);
        setSelected(null);
        setShowResult(false);
        setScore(0);
    }
  };

  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">핵심 확인 퀴즈</h2>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-lg font-medium text-gray-700 mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let baseClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ";
            if (showResult) {
              if (idx === q.answer) baseClass += "border-green-500 bg-green-50 text-green-700";
              else if (idx === selected) baseClass += "border-red-500 bg-red-50 text-red-700";
              else baseClass += "border-gray-100 text-gray-400";
            } else {
              baseClass += "border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 text-gray-600";
            }

            return (
              <button key={idx} onClick={() => handleSelect(idx)} className={baseClass} disabled={showResult}>
                <span>{opt}</span>
                {showResult && idx === q.answer && <CheckCircle className="text-green-500" size={20}/>}
                {showResult && idx === selected && idx !== q.answer && <XCircle className="text-red-500" size={20}/>}
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="animate-fade-in">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
            <h4 className="font-bold text-blue-700 mb-1">해설</h4>
            <p className="text-blue-600 text-sm">{q.explanation}</p>
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {currentQ < questions.length - 1 ? "다음 문제" : "다시 풀기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;