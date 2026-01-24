import React, { useState } from 'react';
import { QuizQuestion } from '../types';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "친구가 찍어준 내 엽기 사진을 단톡방에 올리려 한다. 가장 먼저 해야 할 일은?",
    options: ["포토샵으로 보정한다", "친구의 동의를 구한다", "재미있는 멘트를 생각한다", "익명으로 올린다"],
    correctAnswer: 1,
    explanation: "초상권 침해를 막기 위해 당사자의 동의는 필수입니다."
  },
  {
    id: 2,
    question: "인터넷에서 다운받은 영화 파일을 친구들에게 클라우드로 공유했다. 이 행동은?",
    options: ["좋은 정보를 나누는 선행이다", "친한 사이라 괜찮다", "비상업적이라 괜찮다", "저작권법 위반이다"],
    correctAnswer: 3,
    explanation: "저작권자의 허락 없이 파일을 배포/전송하는 것은 불법 공유에 해당합니다."
  },
  {
    id: 3,
    question: "수행평가 조별 과제 문서를 공유할 때 '편집 권한'을 주는 것이 가장 적절한 사람은?",
    options: ["우리 반 전체 친구들", "같은 조 팀원들", "다른 조 조장", "학교 게시판 방문자"],
    correctAnswer: 1,
    explanation: "협업이 필요한 팀원들에게만 편집 권한을 주고, 나머지는 '보기' 권한만 주는 것이 보안상 안전합니다."
  },
  {
    id: 4,
    question: "공용 PC에서 클라우드 로그인을 했다. 사용 후 해야 할 행동은?",
    options: ["창만 닫는다", "로그아웃하고 기록을 삭제한다", "바탕화면을 정리한다", "전원을 켜둔다"],
    correctAnswer: 1,
    explanation: "자동 로그인이 되어 있을 수 있으므로 반드시 로그아웃하고 브라우저 기록을 삭제해야 합니다."
  },
  {
    id: 5,
    question: "오픈소스 소프트웨어를 사용할 때 확인해야 할 것은?",
    options: ["개발자의 나이", "라이선스(사용 허가) 조건", "파일 용량", "다운로드 속도"],
    correctAnswer: 1,
    explanation: "오픈소스라도 상업적 이용 가능 여부, 출처 표기 의무 등 라이선스 조건이 다릅니다."
  }
];

interface QuizTabProps {
  onScoreUpdate: (points: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const submitQuiz = () => {
    let score = 0;
    QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score += 20;
    });
    onScoreUpdate(score);
    setShowResult(true);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6">🕵️ 디지털 윤리 & 보안 퀴즈</h2>
        <div className="space-y-8">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="pb-6 border-b border-gray-100 last:border-0">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                <span className="text-indigo-600 mr-2">Q{idx + 1}.</span>
                {q.question}
              </h3>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                  if (showResult) {
                    if (oIdx === q.correctAnswer) btnClass += "bg-green-100 border-green-400 text-green-800 font-bold";
                    else if (answers[q.id] === oIdx) btnClass += "bg-red-100 border-red-400 text-red-800";
                    else btnClass += "bg-gray-50 border-gray-200 text-gray-400";
                  } else {
                    if (answers[q.id] === oIdx) btnClass += "bg-indigo-100 border-indigo-400 text-indigo-800";
                    else btnClass += "bg-white border-gray-200 hover:bg-gray-50";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      className={btnClass}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  💡 <span className="font-bold">해설:</span> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        {!showResult && (
          <div className="mt-8 text-center">
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length < QUESTIONS.length}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              제출하고 채점하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;
