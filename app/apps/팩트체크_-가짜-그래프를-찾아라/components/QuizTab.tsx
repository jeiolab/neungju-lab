import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Check, X, Award } from 'lucide-react';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "막대 그래프의 Y축이 0이 아닌 50부터 시작하면 어떤 효과가 발생할까요?",
    options: ["차이가 작아 보인다", "차이가 과장되어 보인다", "변화 없음", "막대가 사라진다"],
    correctAnswer: 1,
    explanation: "축 자르기(0 이상에서 시작)는 시각적으로 작은 차이를 엄청나게 커 보이게 만듭니다."
  },
  {
    id: 2,
    question: "데이터 비율을 왜곡하기로 악명 높은 3D 차트 효과는 무엇일까요?",
    options: ["3D 산점도", "3D 파이 차트", "3D 막대 차트", "3D 라인 차트"],
    correctAnswer: 1,
    explanation: "3D 파이 차트에서는 보는 사람에게 더 '가까운' 조각이 원근법 때문에 실제보다 훨씬 커 보입니다."
  },
  {
    id: 3,
    question: "아이스크림 판매량과 상어 공격 횟수가 함께 증가하는 그래프가 있습니다. 무엇을 결론지을 수 있을까요?",
    options: ["아이스크림이 상어 공격을 유발한다", "상어는 아이스크림을 좋아한다", "상관관계는 인과관계를 의미하지 않는다", "데이터가 조작되었다"],
    correctAnswer: 2,
    explanation: "이것은 고전적인 '교란 변수'의 예입니다(여름 더위가 두 가지 모두의 원인). 직접적인 인과관계가 아닙니다."
  },
  {
    id: 4,
    question: "데이터 시각화에서 '체리 피킹(Cherry Picking)'이란 무엇인가요?",
    options: ["빨간색 막대만 선택하기", "특정 의도를 뒷받침하기 위해 특정 기간만 선택하기", "과일 아이콘 사용하기", "가장 좋은 폰트 고르기"],
    correctAnswer: 1,
    explanation: "체리 피킹은 전체적인 추세를 숨기고 데이터의 일부(예: 2020-2021년)만 보여주는 것을 의미합니다."
  },
  {
    id: 5,
    question: "'잉크는 데이터를 표현하는 데 비례하여 사용되어야 한다'는 원칙은 무엇인가요?",
    options: ["데이터-잉크 비율", "색채 이론", "황금비", "파레토 법칙"],
    correctAnswer: 0,
    explanation: "에드워드 터프티의 데이터-잉크 비율은 불필요한 시각적 요소를 제거할 것을 제안합니다."
  },
  {
    id: 6,
    question: "파이 차트의 퍼센트 합계가 120%입니다. 무엇이 잘못되었나요?",
    options: ["반올림 오류", "불가능한 데이터", "도넛 차트이다", "객관식 질문이다"],
    correctAnswer: 1,
    explanation: "파이 차트는 전체(100%)를 나타냅니다. 그 외의 값은 수학적으로 타당하지 않습니다."
  },
  {
    id: 7,
    question: "원의 면적을 사용하여 선형 값을 나타낼 때 종종 발생하는 문제는?",
    options: ["과소평가", "차이의 과장", "반지름과 면적의 혼동", "위의 모든 것"],
    correctAnswer: 3,
    explanation: "인간은 면적을 정확하게 판단하는 데 서툽니다. 반지름을 두 배로 늘리면 면적은 네 배가 되어 보는 사람을 오해하게 만듭니다."
  },
  {
    id: 8,
    question: "'스파게티 차트'란 무엇인가요?",
    options: ["파스타에 관한 차트", "너무 많은 선이 겹쳐 있는 라인 차트", "복잡한 흐름도", "꼬인 막대 차트"],
    correctAnswer: 1,
    explanation: "선이 너무 많으면 개별 추세를 따라가기 불가능해지며, 마치 스파게티처럼 보입니다."
  },
  {
    id: 9,
    question: "로그 스케일(Logarithmic scale)은 언제 적절할까요?",
    options: ["항상", "절대 안 됨", "데이터가 거대한 자릿수 범위를 다룰 때", "성장을 숨기고 싶을 때"],
    correctAnswer: 2,
    explanation: "로그 스케일은 지수 데이터(바이러스나 소리 등)에 유용하지만, 일반 대중에게는 혼란을 줄 수 있습니다."
  },
  {
    id: 10,
    question: "누적 그래프(Cumulative graph)는 항상:",
    options: ["내려간다", "올라가거나 평평하다", "심하게 변동한다", "0을 교차한다"],
    correctAnswer: 1,
    explanation: "누적 그래프는 이전 합계에 더해지므로, 값이 음수가 아닌 이상(일반적인 집계에서는 드뭄) 절대 감소하지 않습니다."
  }
];

interface QuizTabProps {
  onScoreUpdate: (points: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQ = QUESTIONS[currentQIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === currentQ.correctAnswer) {
      const points = 10;
      setScore(prev => prev + points);
      onScoreUpdate(points);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="text-center p-12 bg-slate-800 rounded-xl border border-slate-700">
        <Award size={64} className="mx-auto text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">평가 완료</h2>
        <p className="text-xl text-slate-300 mb-6">
          획득 점수: <span className="text-blue-400 font-bold">{score} / {QUESTIONS.length * 10}</span>
        </p>
        <div className="inline-block bg-slate-900 p-4 rounded-lg">
          <p className="text-slate-400">
            {score > 80 ? "명탐정 등급!" : score > 50 ? "초보 탐정" : "탐정 학교로 돌아가세요!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between text-slate-400 text-sm uppercase tracking-widest">
        <span>문제 {currentQIndex + 1} / {QUESTIONS.length}</span>
        <span>점수: {score}</span>
      </div>
      
      <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">{currentQ.question}</h3>
        
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ";
            if (!isAnswered) {
              btnClass += "bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500 text-slate-200";
            } else {
              if (idx === currentQ.correctAnswer) {
                btnClass += "bg-green-900/40 border-green-500 text-green-300";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-900/40 border-red-500 text-red-300";
              } else {
                btnClass += "bg-slate-700/50 border-slate-700 text-slate-500";
              }
            }

            return (
              <button 
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={btnClass}
              >
                {option}
                {isAnswered && idx === currentQ.correctAnswer && <Check size={20} />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctAnswer && <X size={20} />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 animate-fadeIn">
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
              <p className="text-blue-300 text-sm">
                <span className="font-bold">팩트 체크:</span> {currentQ.explanation}
              </p>
            </div>
            <button 
              onClick={handleNext}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors"
            >
              {currentQIndex === QUESTIONS.length - 1 ? "시험 종료" : "다음 증거"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;