import React, { useState } from 'react';
    import { QuizQuestion } from '../types';
    import { motion } from 'framer-motion';
    import { CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
    
    const questions: QuizQuestion[] = [
      {
        id: 1,
        scenario: "로그 항목 #402: '사용자가 브라우저 홈페이지가 자동으로 변경되었고, 오프라인 상태에서도 도박 사이트 팝업 광고가 뜬다고 불만을 제기함.'",
        options: ["랜섬웨어 공격", "애드웨어 / 스파이웨어", "DDoS 공격", "SQL 인젝션"],
        correctIndex: 1,
        explanation: "애드웨어는 공격적으로 광고를 노출합니다. 홈페이지 변경은 잠재적으로 원하지 않는 프로그램(PUP)이나 스파이웨어의 흔한 증상입니다."
      },
      {
        id: 2,
        scenario: "로그 항목 #991: '서버 CPU가 순식간에 100%로 치솟음. 트래픽 분석 결과 전 세계의 수많은 IP 주소에서 80번 포트로 수백만 건의 요청이 들어오고 있음.'",
        options: ["트로이 목마", "피싱", "DDoS 공격", "중간자 공격 (MitM)"],
        correctIndex: 2,
        explanation: "분산 서비스 거부(DDoS) 공격은 봇넷(다수의 다른 IP)을 이용하여 타겟 리소스에 트래픽을 폭주시킵니다."
      },
      {
        id: 3,
        scenario: "로그 항목 #102: '직원이 CEO로부터 긴급 송금을 요청하는 이메일을 받음. 발신자 주소는 ceo@c0mpany.com (숫자 0이 포함됨)이었음.'",
        options: ["스피어 피싱", "바이러스", "웜", "키로거"],
        correctIndex: 0,
        explanation: "스피어 피싱은 특정 개인이나 단체를 타겟으로 합니다. 도메인 철자를 살짝 바꾸는 타이포스쿼팅(Typosquatting)은 전형적인 수법입니다."
      }
    ];
    
    const QuizView: React.FC = () => {
      const [currentQ, setCurrentQ] = useState(0);
      const [selected, setSelected] = useState<number | null>(null);
      const [showResult, setShowResult] = useState(false);
    
      const handleSelect = (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
      };
    
      const nextQ = () => {
        setSelected(null);
        setShowResult(false);
        setCurrentQ(prev => (prev + 1) % questions.length);
      };
    
      const question = questions[currentQ];
      const isCorrect = selected === question.correctIndex;
    
      return (
        <div className="max-w-3xl mx-auto p-6 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-lab-800">위협 데이터베이스</h2>
            <p className="text-lab-500 mt-2">과거 사건 일지를 분석하여 위협을 식별하세요.</p>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-lg border border-lab-200 overflow-hidden">
            <div className="bg-lab-800 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-primary-400" />
                <span className="font-mono text-lg">사건 일지 #{question.id}</span>
              </div>
              <span className="text-lab-400 text-sm">{currentQ + 1} / {questions.length}</span>
            </div>
    
            <div className="p-8">
              <p className="font-mono text-lab-600 bg-lab-50 p-4 rounded-lg border-l-4 border-lab-400 mb-8 italic">
                "{question.scenario}"
              </p>
    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                      ${showResult 
                        ? idx === question.correctIndex 
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : idx === selected 
                            ? 'border-red-500 bg-red-50 text-red-800'
                            : 'border-lab-100 opacity-50'
                        : 'border-lab-100 hover:border-primary-400 hover:bg-primary-50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      {opt}
                      {showResult && idx === question.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showResult && idx === selected && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </button>
                ))}
              </div>
    
              {showResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8 pt-6 border-t border-lab-100"
                >
                  <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect ? '분석 성공' : '식별 실패'}
                  </h4>
                  <p className="text-lab-600 text-sm mb-6">{question.explanation}</p>
                  <button 
                    onClick={nextQ}
                    className="w-full py-3 bg-lab-800 text-white rounded-lg hover:bg-lab-700 transition-colors font-medium"
                  >
                    다음 사건
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      );
    };
    
    export default QuizView;