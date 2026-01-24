import React, { useState, useEffect } from 'react';
import { PacketStep } from '../types';
import { ArrowRight, CheckCircle, RefreshCw, AlertTriangle, Play, Server, Globe, Laptop, Box } from 'lucide-react';

const CORRECT_ORDER = ['dns', 'ip', 'split', 'route', 'reassemble'];

const STEPS_DATA: PacketStep[] = [
  { id: 'split', label: '패킷 분할', description: '데이터를 작은 조각으로 나눕니다.', icon: 'Box' },
  { id: 'ip', label: 'IP 주소 확인', description: '목적지의 실제 주소를 확인합니다.', icon: 'MapPin' },
  { id: 'reassemble', label: '데이터 재조립', description: '도착한 패킷을 원래대로 합칩니다.', icon: 'PackageOpen' },
  { id: 'dns', label: 'DNS 조회', description: '도메인 이름을 IP로 변환 요청합니다.', icon: 'Search' },
  { id: 'route', label: '라우터 경유', description: '최적의 경로를 따라 이동합니다.', icon: 'Route' },
];

interface SimulationTabProps {
  onComplete: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete }) => {
  const [availableSteps, setAvailableSteps] = useState<PacketStep[]>(STEPS_DATA);
  const [pipeline, setPipeline] = useState<PacketStep[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [packetPosition, setPacketPosition] = useState(0);

  const addToPipeline = (step: PacketStep) => {
    setPipeline([...pipeline, step]);
    setAvailableSteps(availableSteps.filter((s) => s.id !== step.id));
    setFeedback(null);
  };

  const removeFromPipeline = (step: PacketStep) => {
    setAvailableSteps([...availableSteps, step]);
    setPipeline(pipeline.filter((s) => s.id !== step.id));
    setFeedback(null);
  };

  const checkOrder = () => {
    if (pipeline.length !== CORRECT_ORDER.length) {
      setFeedback("모든 단계를 파이프라인에 배치해주세요!");
      return;
    }

    // Specific Feedback Logic
    if (pipeline[0].id !== 'dns') {
      setFeedback("잠깐! 주소도 모르고 출발할 순 없어요. 도메인을 IP로 바꾸는게 먼저 아닐까요?");
      return;
    }
    
    if (pipeline[1].id !== 'ip') {
      setFeedback("DNS 조회가 끝나면 무엇을 알게 되나요? 확인된 주소를 먼저 챙기세요.");
      return;
    }

    if (pipeline[2].id !== 'split') {
       setFeedback("데이터가 너무 크면 한번에 못 가요. 쪼개야 합니다.");
       return;
    }

    // Check full equality
    const currentOrderIds = pipeline.map(s => s.id);
    const isCorrect = currentOrderIds.every((val, index) => val === CORRECT_ORDER[index]);

    if (isCorrect) {
      setIsSuccess(true);
      setFeedback("정답입니다! 패킷 전송을 시작합니다.");
      startAnimation();
      onComplete();
    } else {
      setFeedback("순서가 조금 이상해요. 논리적으로 다시 생각해볼까요?");
    }
  };

  const startAnimation = () => {
    setIsAnimating(true);
    setPacketPosition(0);
  };

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setPacketPosition((prev) => {
          if (prev >= 100) {
            setIsAnimating(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 50); // Speed of animation
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const resetSimulation = () => {
    setAvailableSteps(STEPS_DATA);
    setPipeline([]);
    setFeedback(null);
    setIsSuccess(false);
    setIsAnimating(false);
    setPacketPosition(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-blue-600 mb-2">미션: 데이터를 서울에서 뉴욕까지 보내라!</h2>
        <p className="text-slate-600 text-sm">
          아래 뒤섞인 단계들을 올바른 순서대로 배치하여 데이터 전송 파이프라인을 완성하세요.
        </p>
      </div>

      {/* Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pool & Pipeline */}
        <div className="space-y-6">
          {/* Pipeline Drop Area */}
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-dashed border-slate-300 min-h-[300px]">
            <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">전송 파이프라인 (클릭하여 제거)</h3>
            <div className="space-y-2">
              {pipeline.map((step, index) => (
                <div 
                  key={step.id}
                  onClick={() => !isSuccess && removeFromPipeline(step)}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-white shadow-sm ${
                    isSuccess ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full mr-3 text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{step.label}</div>
                    <div className="text-xs text-slate-500">{step.description}</div>
                  </div>
                </div>
              ))}
              {pipeline.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-400 py-10 italic">
                  오른쪽(모바일은 아래)에서 단계를 선택하세요
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
             <button 
                onClick={checkOrder}
                disabled={isSuccess}
                className={`flex-1 py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                  isSuccess 
                  ? 'bg-green-600 text-white cursor-default shadow-md' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                {isSuccess ? <><CheckCircle size={20}/> 전송 준비 완료</> : <><Play size={20}/> 파이프라인 가동</>}
              </button>
              <button 
                onClick={resetSimulation}
                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-colors"
                title="초기화"
              >
                <RefreshCw size={20} />
              </button>
          </div>
          
          {feedback && (
            <div className={`p-4 rounded-lg flex items-start gap-3 shadow-sm ${isSuccess ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              {isSuccess ? <CheckCircle className="shrink-0 mt-0.5" /> : <AlertTriangle className="shrink-0 mt-0.5" />}
              <p>{feedback}</p>
            </div>
          )}
        </div>

        {/* Right: Step Pool & Visualization */}
        <div className="space-y-6">
           {/* Step Pool */}
           {!isSuccess && availableSteps.length > 0 && (
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">사용 가능한 단계 (클릭하여 추가)</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {availableSteps.map((step) => (
                   <button
                     key={step.id}
                     onClick={() => addToPipeline(step)}
                     className="flex flex-col items-start p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-left"
                   >
                     <span className="font-bold text-slate-800 text-sm">{step.label}</span>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Visualization Map */}
           <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 relative overflow-hidden h-64 flex flex-col justify-between shadow-inner">
              <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-20">
                 {/* Grid Background */}
                 {[...Array(24)].map((_, i) => <div key={i} className="border border-slate-300"></div>)}
              </div>

              {/* Map Nodes */}
              <div className="relative z-10 flex justify-between items-center h-full px-4">
                 <div className="flex flex-col items-center">
                    <Laptop className="text-blue-600 mb-2" size={32} />
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">서울 (Client)</span>
                 </div>
                 
                 {/* Path Line */}
                 <div className="flex-1 h-1 bg-slate-300 mx-4 relative">
                    <div 
                      className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-300 ease-linear"
                      style={{ width: `${packetPosition}%` }}
                    />
                    {/* Packet */}
                    {isAnimating && (
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-md border border-yellow-600 z-20"
                        style={{ left: `${packetPosition}%`, transition: 'left 50ms linear' }}
                      >
                         <div className="absolute -inset-1 bg-yellow-400 opacity-50 rounded-full animate-ping"></div>
                      </div>
                    )}

                    {/* Intermediate Nodes */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-[30%] w-3 h-3 bg-slate-400 rounded-full" title="Tokyo Router"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-3 h-3 bg-slate-400 rounded-full" title="Pacific Cable"></div>
                 </div>

                 <div className="flex flex-col items-center">
                    <Server className="text-green-600 mb-2" size={32} />
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">뉴욕 (Server)</span>
                 </div>
              </div>
              
              <div className="text-center text-xs text-slate-500 z-10 mt-auto font-medium">
                 {isAnimating ? "패킷 전송 중..." : "경로 대기 중"}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;