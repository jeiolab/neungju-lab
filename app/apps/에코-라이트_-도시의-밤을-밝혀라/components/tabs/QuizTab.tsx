import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, XCircle } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "조도 센서(CdS)의 아날로그 값을 디지털로 변환할 때, 0~1023 사이의 값으로 표현하는 장치는 무엇인가요?",
    options: ["CPU", "ADC", "DAC", "GPU"],
    correct: 1,
    explanation: "ADC(Analog-to-Digital Converter)는 아날로그 신호를 디지털 숫자로 변환합니다."
  },
  {
    id: 2,
    text: "다음 중 가로등 에너지를 절약하면서도 시민의 안전을 지키기 위한 가장 효율적인 센서 조합은?",
    options: ["타이머(시간)만 사용", "조도 센서 + 모션 센서", "온도 센서 + 습도 센서", "수동 스위치"],
    correct: 1,
    explanation: "어두울 때(조도) 사람이 지나갈 때만(모션) 켜는 방식이 가장 효율적입니다."
  },
  {
    id: 3,
    text: "트레이드오프(Trade-off) 관계에 대한 설명으로 옳은 것은?",
    options: ["두 가지 목표를 동시에 100% 달성할 수 있는 상태", "하나를 얻으면 다른 하나를 잃게 되는 상충 관계", "서로 아무런 관련이 없는 관계", "모든 것이 완벽한 상태"],
    correct: 1,
    explanation: "에너지 절약과 밝기(안전)처럼 서로 상충되는 관계를 트레이드오프라고 합니다."
  }
];

export const QuizTab: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({...prev, [qId]: optionIdx}));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {questions.map((q, idx) => (
        <Card key={q.id} className="relative overflow-hidden">
          <div className="flex items-start gap-3 mb-4">
            <span className="bg-sky-600 text-white w-6 h-6 rounded flex items-center justify-center text-sm font-bold flex-shrink-0">
              Q{idx + 1}
            </span>
            <h3 className="text-lg font-semibold text-slate-900">{q.text}</h3>
          </div>
          
          <div className="space-y-2 pl-9">
            {q.options.map((option, oIdx) => {
              const isSelected = selectedAnswers[q.id] === oIdx;
              const isCorrect = q.correct === oIdx;
              let btnClass = "w-full text-left p-3 rounded border transition-all ";
              
              if (showResults) {
                if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-800";
                else if (isSelected) btnClass += "bg-red-100 border-red-500 text-red-800";
                else btnClass += "bg-slate-50 border-slate-200 text-slate-400";
              } else {
                if (isSelected) btnClass += "bg-sky-100 border-sky-500 text-sky-800";
                else btnClass += "bg-white border-slate-200 hover:bg-slate-50 text-slate-700";
              }

              return (
                <button 
                  key={oIdx}
                  onClick={() => handleSelect(q.id, oIdx)}
                  className={btnClass}
                  disabled={showResults}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {showResults && isCorrect && <CheckCircle size={18} className="text-green-600" />}
                    {showResults && isSelected && !isCorrect && <XCircle size={18} className="text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-4 ml-9 p-3 bg-slate-50 rounded border-l-2 border-yellow-500 text-sm text-slate-700">
              <strong className="text-yellow-600 block mb-1">해설:</strong>
              {q.explanation}
            </div>
          )}
        </Card>
      ))}

      <div className="text-center pt-4">
        {!showResults ? (
          <button 
            onClick={() => setShowResults(true)}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-8 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/30"
          >
            채점하기
          </button>
        ) : (
          <div className="text-2xl font-bold text-slate-900 animate-bounce">
            총점: <span className="text-yellow-600">{calculateScore()}</span> / {questions.length}
          </div>
        )}
      </div>
    </div>
  );
};