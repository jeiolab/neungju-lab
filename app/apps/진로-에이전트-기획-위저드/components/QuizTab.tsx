import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, RefreshCcw } from 'lucide-react';

const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    category: '문제정의',
    question: '다음 중 AI 진로 에이전트에게 내릴 명령으로 가장 적절한 것은?',
    options: [
      '나한테 맞는 직업을 무조건 하나만 정해줘.',
      '내 성적 데이터를 기반으로 지원 가능한 대학 리스트를 뽑아줘.',
      '내가 행복할 수 있는 인생의 정답을 알려줘.',
      '미래에 망하지 않을 직업을 예언해줘.'
    ],
    answer: 1,
    explanation: 'AI는 정답이나 예언을 하는 존재가 아니라, 데이터를 기반으로 정보를 제공하는 도구입니다.'
  },
  {
    id: 2,
    category: '책임',
    question: 'AI가 추천한 학과에 진학했다가 적성에 맞지 않아 후회하게 되었습니다. 최종 책임은 누구에게 있을까요?',
    options: [
      'AI 개발자',
      'AI 알고리즘',
      '추천을 최종 선택한 사용자(본인)',
      '데이터를 제공한 학교'
    ],
    answer: 2,
    explanation: 'AI는 조언자일 뿐입니다. 최종 결정과 그에 따른 책임은 주체인 인간에게 있습니다.'
  },
  {
    id: 3,
    category: '윤리',
    question: 'AI가 "간호사" 직업을 추천하며 여성 사진만 보여줍니다. 이 현상은 무엇일까요?',
    options: [
      '데이터 편향 (Bias)',
      '알고리즘 최적화',
      '개인정보 유출',
      '할루시네이션'
    ],
    answer: 0,
    explanation: '과거 데이터의 편견을 학습하여 특정 성별/인종에 치우친 결과를 내는 것을 데이터 편향이라고 합니다.'
  },
  {
    id: 4,
    category: '검증',
    question: '생성형 AI가 "2025년 신설되는 A대학교 드론학과" 정보를 알려주었습니다. 인간이 해야 할 올바른 행동은?',
    options: [
      'AI가 똑똑하니 믿고 바로 원서를 쓴다.',
      '친구들에게 소문을 낸다.',
      '해당 대학 입학처 홈페이지에 들어가 사실인지 확인한다.',
      'AI에게 고맙다고 인사한다.'
    ],
    answer: 2,
    explanation: 'AI는 없는 정보를 사실처럼 말하는 "할루시네이션"이 있을 수 있으므로 반드시 공식 출처를 통해 검증해야 합니다.'
  },
  {
    id: 5,
    category: '개인정보',
    question: '진로 상담을 위해 AI에게 제공해도 안전한 데이터는?',
    options: [
      '주민등록번호',
      '집 주소와 현관 비밀번호',
      '부모님 신용카드 번호',
      '나의 흥미 적성 검사 결과 키워드'
    ],
    answer: 3,
    explanation: '개인을 식별할 수 있는 민감 정보는 최소화해야 하며, 흥미 키워드 같은 일반 데이터가 안전합니다.'
  }
];

const QuizTab: React.FC<{ onScoreUpdate: (score: number) => void }> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const handleOptionClick = (idx: number) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    
    if (idx === QUIZ_DATA[currentIdx].answer) {
      setScore(s => s + 20);
    } else {
      setWrongAnswers(prev => [...prev, QUIZ_DATA[currentIdx].id]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      onScoreUpdate(score);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setWrongAnswers([]);
  };

  if (finished) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900">퀴즈 결과</h2>
        <div className="text-5xl font-bold text-indigo-600 mb-4">{score}점</div>
        
        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 p-4 rounded-lg text-left">
            <h3 className="font-bold text-red-800 mb-2">오답 노트</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {wrongAnswers.map(id => {
                const q = QUIZ_DATA.find(q => q.id === id);
                return <li key={id}>{q?.explanation}</li>;
              })}
            </ul>
          </div>
        )}

        <button 
          onClick={resetQuiz}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18}/> 다시 풀기
        </button>
      </div>
    );
  }

  const q = QUIZ_DATA[currentIdx];

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-4 flex justify-between text-sm font-medium text-gray-500">
        <span>Question {currentIdx + 1} / {QUIZ_DATA.length}</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{q.category}</span>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
            if (showExplanation) {
              if (idx === q.answer) btnClass += "bg-green-100 border-green-500 text-green-800 font-bold";
              else if (idx === selectedOpt) btnClass += "bg-red-100 border-red-500 text-red-800";
              else btnClass += "bg-gray-50 border-gray-200 text-gray-400";
            } else {
              btnClass += "hover:bg-indigo-50 hover:border-indigo-300 border-gray-200";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showExplanation}
                className={btnClass}
              >
                {opt}
                {showExplanation && idx === q.answer && <CheckCircle className="float-right text-green-600" size={20}/>}
                {showExplanation && idx === selectedOpt && idx !== q.answer && <XCircle className="float-right text-red-600" size={20}/>}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 text-sm">
            <strong>해설:</strong> {q.explanation}
          </div>
          <button 
            onClick={nextQuestion}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 shadow-lg"
          >
            {currentIdx < QUIZ_DATA.length - 1 ? '다음 문제' : '결과 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;