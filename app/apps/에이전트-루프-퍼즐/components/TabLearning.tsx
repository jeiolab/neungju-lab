import React, { useState, useEffect } from 'react';
import { AGENT_STEPS } from '../constants';
import { Eye, Brain, Cpu, Zap, ChevronRight } from 'lucide-react';

const iconMap: any = { Eye, Brain, Cpu, Zap };

interface Props {
  onComplete: () => void;
}

const TabLearning: React.FC<Props> = ({ onComplete }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showCheckQuestion, setShowCheckQuestion] = useState(false);
  const [timer, setTimer] = useState(10);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    let interval: any;
    if (showCheckQuestion && timer > 0 && !answered) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showCheckQuestion, timer, answered]);

  const handleNext = () => {
    if (activeStepIndex < AGENT_STEPS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      setShowCheckQuestion(true);
    }
  };

  const handleCheckAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      alert("정답입니다! +10 XP");
      setAnswered(true);
      onComplete();
    } else {
      alert("다시 한 번 생각해보세요. 에이전트의 목표는 스스로 행동하는 것입니다.");
    }
  };

  if (showCheckQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border-2 border-indigo-100">
          <div className="text-4xl font-bold text-indigo-600 mb-4">{timer}초</div>
          <h2 className="text-xl font-bold mb-6">확인 퀴즈</h2>
          <p className="mb-8 text-gray-600">지능형 에이전트 루프의 최종 목적은 무엇인가요?</p>
          <div className="space-y-3">
            <button
              onClick={() => handleCheckAnswer(false)}
              className="w-full p-3 rounded-lg border hover:bg-slate-50 transition"
            >
              데이터만 계속 수집하기
            </button>
            <button
              onClick={() => handleCheckAnswer(true)}
              className="w-full p-3 rounded-lg border bg-indigo-50 border-indigo-200 hover:bg-indigo-100 font-bold text-indigo-700 transition"
            >
              환경을 인식하고 적절하게 행동하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const step = AGENT_STEPS[activeStepIndex];
  const Icon = iconMap[step.icon];

  return (
    <div className="flex flex-col h-full items-center pt-8 px-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-between mb-4 px-2">
            {AGENT_STEPS.map((s, idx) => (
                <div key={s.id} className={`h-2 flex-1 rounded-full mx-1 transition-colors ${idx <= activeStepIndex ? 'bg-indigo-500' : 'bg-gray-200'}`} />
            ))}
        </div>
        
        <div className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-500 transform ${step.color}`}>
          <div className="p-8 flex flex-col items-center text-center h-[400px] justify-center">
            <div className={`p-6 rounded-full bg-white mb-6 shadow-sm`}>
              <Icon size={64} className="stroke-current" />
            </div>
            <h2 className="text-3xl font-bold mb-4">{step.koreanName}</h2>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {step.description}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
             <button 
               onClick={handleNext}
               className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
             >
                {activeStepIndex === AGENT_STEPS.length - 1 ? '퀴즈 풀기' : '다음'} 
                <ChevronRight className="ml-2 w-5 h-5" />
             </button>
          </div>
        </div>
        
        <p className="text-center text-slate-400 mt-6 text-sm">
          카드를 읽고 과정을 이해해보세요.
        </p>
      </div>
    </div>
  );
};

export default TabLearning;