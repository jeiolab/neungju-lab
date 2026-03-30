import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { QuizQuestion } from '../types';

interface QuizTabProps {
  onCorrect: () => void;
}

const allQuestions: QuizQuestion[] = [
  { id: 1, text: "IoT는 무엇의 약자일까요?", options: ["Internet of Things", "Intranet of Technology", "Input of Time", "Idea of Tomorrow"], correctIndex: 0, explanation: "IoT는 Internet of Things(사물인터넷)의 약자입니다.", difficulty: "쉬움" },
  { id: 2, text: "주변의 빛, 소리, 온도를 감지하는 장치는?", options: ["배터리", "센서", "모터", "화면"], correctIndex: 1, explanation: "센서는 환경 변화를 감지하여 데이터로 만듭니다.", difficulty: "쉬움" },
  { id: 3, text: "수집된 데이터를 저장하고 분석하는 가상의 공간은?", options: ["지하창고", "클라우드", "USB", "CD"], correctIndex: 1, explanation: "클라우드(Cloud)는 인터넷 상의 데이터 저장/처리 공간입니다.", difficulty: "쉬움" },
  { id: 4, text: "IoT 기술로 적절하지 않은 예시는?", options: ["스마트폰으로 집 조명 끄기", "자동으로 물 주는 화분", "손으로 직접 쓴 편지", "혼잡도를 알려주는 키오스크"], correctIndex: 2, explanation: "손으로 쓴 편지는 디지털 기술이나 인터넷 연결이 없습니다.", difficulty: "쉬움" },
  { id: 5, text: "센서가 너무 예민할 때 발생할 수 있는 문제는?", options: ["알림이 전혀 안 온다", "오작동(거짓 알림)이 많아진다", "배터리가 평생 간다", "기기가 고장난다"], correctIndex: 1, explanation: "민감도가 너무 높으면 작은 변화에도 반응해 오작동할 수 있습니다.", difficulty: "보통" },
  { id: 6, text: "자동화 수준이 너무 높을 때의 단점은?", options: ["너무 편하다", "전기를 안 쓴다", "기기에 과도하게 의존하게 된다", "속도가 느리다"], correctIndex: 2, explanation: "기기에만 의존하면, 고장 시 대처 능력이 떨어질 수 있습니다.", difficulty: "보통" },
  { id: 7, text: "스마트 그리드의 주된 목적은?", options: ["전기 낭비 줄이기", "인터넷 속도 높이기", "물 절약하기", "게임 성능 높이기"], correctIndex: 0, explanation: "스마트 그리드는 전력망을 지능화하여 에너지를 효율적으로 관리합니다.", difficulty: "보통" },
  { id: 8, text: "데이터를 분석하여 스스로 판단하는 과정은 어디에 해당할까요?", options: ["입력(센싱)", "처리(판단)", "출력(행동)", "삭제"], correctIndex: 1, explanation: "수집된 데이터를 분석하는 것은 '처리' 및 '판단' 단계입니다.", difficulty: "보통" },
  { id: 9, text: "IoT 보안 문제로 가장 적절한 것은?", options: ["기기가 너무 싸다", "해킹으로 사생활이 침해될 수 있다", "디자인이 안 예쁘다", "전기가 끊긴다"], correctIndex: 1, explanation: "네트워크에 연결되므로 해킹 시 카메라 영상 등이 유출될 위험이 있습니다.", difficulty: "어려움" },
  { id: 10, text: "다음 중 '액추에이터(Actuator)'의 역할은?", options: ["온도 측정", "데이터 저장", "실제 물리적 움직임 수행", "와이파이 연결"], correctIndex: 2, explanation: "액추에이터는 모터 등을 이용해 실제 물리적인 행동(문 열기 등)을 수행합니다.", difficulty: "어려움" },
];

const QuizTab: React.FC<QuizTabProps> = ({ onCorrect }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongNotes, setWrongNotes] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const currentQ = allQuestions[currentQIndex];
    if (index === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      onCorrect();
    } else {
      setWrongNotes(prev => [...prev, currentQ.id]);
    }
  };

  const handleNext = () => {
    if (currentQIndex < allQuestions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setWrongNotes([]);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="space-y-6 text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 결과</h2>
        <div className="text-6xl font-black text-indigo-600 my-6">{score * 10}점</div>
        <p className="text-slate-600 mb-8">
          {score >= 8 ? "대단해요! IoT 박사님이네요. 🎓" : "수고했어요! 오답노트를 확인해보세요. 👍"}
        </p>
        
        {wrongNotes.length > 0 && (
          <div className="text-left bg-rose-50 p-4 rounded-xl border border-rose-100 mb-6">
            <h3 className="font-bold text-rose-700 mb-2">📝 오답 노트</h3>
            <ul className="space-y-3">
              {wrongNotes.map(id => {
                const q = allQuestions.find(it => it.id === id);
                return q ? (
                  <li key={id} className="text-sm">
                    <span className="font-bold text-slate-700">Q. {q.text}</span>
                    <p className="text-rose-600 mt-1">💡 {q.explanation}</p>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}

        <button 
          onClick={handleRetry}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 mx-auto hover:bg-indigo-700"
        >
          <RefreshCcw size={20} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const currentQ = allQuestions[currentQIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-sm font-medium text-slate-500">
        <span>문제 {currentQIndex + 1} / {allQuestions.length}</span>
        <span className={`px-2 py-1 rounded text-xs ${currentQ.difficulty === '어려움' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
          난이도: {currentQ.difficulty}
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 min-h-[300px] flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.text}
        </h2>

        <div className="space-y-3 flex-1">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
            if (!isAnswered) {
              btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 bg-white";
            } else {
              if (idx === currentQ.correctIndex) {
                btnClass += "bg-emerald-100 border-emerald-500 text-emerald-800 font-bold";
              } else if (idx === selectedOption) {
                btnClass += "bg-rose-100 border-rose-500 text-rose-800";
              } else {
                btnClass += "bg-slate-50 border-slate-100 text-slate-400";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex justify-between items-center">
                  <span>{idx + 1}. {opt}</span>
                  {isAnswered && idx === currentQ.correctIndex && <CheckCircle size={20} className="text-emerald-600" />}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="text-rose-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-100 animate-fade-in-up">
            <p className="text-sm font-medium text-indigo-800 bg-indigo-50 p-3 rounded-lg mb-4">
              해설: {currentQ.explanation}
            </p>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
            >
              {currentQIndex < allQuestions.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
