import React, { useState } from 'react';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [miniQuizAnswer, setMiniQuizAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const terms = [
    {
      id: 'sensor',
      term: '센서 (Sensor)',
      def: '에이전트가 환경으로부터 정보를 받아들이는 장치.',
      ex: '카메라(시각), 마이크(청각), 키보드(입력)'
    },
    {
      id: 'actuator',
      term: '액추에이터 (Actuator)',
      def: '에이전트가 환경에 물리적인 작용을 가하는 장치.',
      ex: '모터(이동), 스피커(소리), 화면(디스플레이)'
    },
    {
      id: 'agent_fn',
      term: '에이전트 함수 (Agent Function)',
      def: '입력된 인식(Percept)을 행동(Action)으로 매핑하는 수학적/논리적 규칙.',
      ex: 'f(장애물 감지) = 멈춤'
    }
  ];

  const miniQuiz = {
    q: "에이전트 함수는 [ A ]을 [ B ]으로 연결해줍니다. 빈칸에 알맞은 말은?",
    options: ["A: 행동, B: 인식", "A: 인식, B: 행동", "A: 센서, B: 배터리"],
    correct: 1
  };

  const handleQuizSubmit = (idx: number) => {
    setMiniQuizAnswer(idx);
    setShowResult(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          핵심 용어 카드
        </h2>
        <p className="text-indigo-200 mb-6">카드를 클릭해서 상세 내용을 확인하세요.</p>
        
        <div className="grid gap-4">
          {terms.map((t) => (
            <div 
              key={t.id}
              onClick={() => setActiveTerm(activeTerm === t.id ? null : t.id)}
              className={`bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl cursor-pointer transition-all duration-300 ${activeTerm === t.id ? 'bg-white/20 scale-105' : 'hover:bg-white/15'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{t.term}</span>
                <span className="text-indigo-300 text-sm">{activeTerm === t.id ? '접기' : '더보기'}</span>
              </div>
              
              {activeTerm === t.id && (
                <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in text-indigo-100">
                  <p className="mb-2"><strong className="text-white">정의:</strong> {t.def}</p>
                  <p><strong className="text-white">예시:</strong> {t.ex}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mini Quiz Section */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-8">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">MINI QUIZ</span>
        <h3 className="text-xl font-bold text-slate-800 mt-2 mb-6">{miniQuiz.q}</h3>
        
        <div className="space-y-3">
          {miniQuiz.options.map((opt, idx) => (
            <button
              key={idx}
              disabled={showResult}
              onClick={() => handleQuizSubmit(idx)}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                showResult 
                  ? idx === miniQuiz.correct 
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : idx === miniQuizAnswer 
                      ? 'bg-red-100 border-2 border-red-500 text-red-800'
                      : 'bg-slate-50 border border-slate-200 opacity-50'
                  : 'bg-white border-2 border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {showResult && idx === miniQuiz.correct && <CheckCircle className="text-green-600 w-5 h-5" />}
                {showResult && idx === miniQuizAnswer && idx !== miniQuiz.correct && <XCircle className="text-red-600 w-5 h-5" />}
              </div>
            </button>
          ))}
        </div>
        
        {showResult && (
          <div className={`mt-4 p-4 rounded-lg text-center font-bold ${
            miniQuizAnswer === miniQuiz.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {miniQuizAnswer === miniQuiz.correct ? "정답입니다! 🎉" : "아쉽네요, 다시 생각해보세요! (정답: 2번)"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeepDiveTab;