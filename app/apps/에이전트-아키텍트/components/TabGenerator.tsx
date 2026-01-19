import React, { useState, useEffect } from 'react';
import { Agent, SensorType } from '../types';
import { ArrowRight, Bot, Save, RotateCcw, Check } from 'lucide-react';
import AgentCard from './AgentCard';

interface TabGeneratorProps {
  onSave: (agent: Agent) => void;
}

const TabGenerator: React.FC<TabGeneratorProps> = ({ onSave }) => {
  const [step, setStep] = useState(0);
  const [agent, setAgent] = useState<Partial<Agent>>({
    sensors: [],
    actions: [],
  });
  const [tempInput, setTempInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Avatar colors
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];

  const handleNext = () => {
    setFeedback(null);
    if (step === 0) {
      if (!agent.name || !agent.goal) {
        setFeedback("에이전트의 이름과 목표를 모두 입력해주세요!");
        return;
      }
    }
    if (step === 2 && (!agent.sensors || agent.sensors.length === 0)) {
       setFeedback("센서가 없으면 에이전트가 앞을 볼 수 없어요! 최소 1개를 선택해주세요.");
       return;
    }
    if (step === 3 && (!agent.actions || agent.actions.length === 0)) {
        setFeedback("에이전트가 할 수 있는 행동을 최소 하나 이상 추가해주세요.");
        return;
    }

    setStep(prev => prev + 1);
  };

  const handleAddAction = () => {
    if (tempInput.trim()) {
      setAgent(prev => ({
        ...prev,
        actions: [...(prev.actions || []), tempInput.trim()]
      }));
      setTempInput("");
    }
  };

  const handleComplete = () => {
    const finalAgent: Agent = {
      id: Date.now().toString(),
      name: agent.name || "이름 없는 봇",
      goal: agent.goal || "목표 미정",
      environment: agent.environment || "알 수 없음",
      sensors: agent.sensors || [],
      actions: agent.actions || [],
      characteristics: agent.characteristics || "기본 성격",
      avatarColor: agent.avatarColor || colors[Math.floor(Math.random() * colors.length)],
      createdAt: Date.now()
    };
    onSave(finalAgent);
    setStep(5); // Completion screen
  };

  const reset = () => {
    setStep(0);
    setAgent({ sensors: [], actions: [] });
    setTempInput("");
    setFeedback(null);
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="chat-bubble bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
              <p className="text-slate-800 font-medium text-lg">👋 안녕하세요! 저는 설계 도우미입니다.</p>
              <p className="text-slate-600 mt-2">먼저, 새로운 에이전트의 <strong>이름</strong>과 <strong>주요 목표(미션)</strong>를 정해볼까요?</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">에이전트 이름</label>
                <input 
                  type="text" 
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-lg"
                  placeholder="예: 숙제 도우미 9000"
                  value={agent.name || ''}
                  onChange={(e) => setAgent({...agent, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">목표 (Goal)</label>
                <textarea 
                  className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 text-base resize-none"
                  placeholder="예: 학생들이 숙제를 정리하고 마감일을 잊지 않도록 도와준다."
                  value={agent.goal || ''}
                  onChange={(e) => setAgent({...agent, goal: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="chat-bubble bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
              <p className="text-slate-800 font-medium text-lg">멋진 이름이네요!</p>
              <p className="text-slate-600 mt-2">그럼, <strong>{agent.name}</strong>(은)는 어디서 활동하나요? <strong>환경(Environment)</strong>을 정해주세요.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['집 (Home)', '학교 (School)', '우주 (Outer Space)', '바닷속 (Underwater)', '도시 거리 (City)', '병원 (Hospital)'].map((env) => (
                <button
                  key={env}
                  onClick={() => setAgent({...agent, environment: env})}
                  className={`p-6 rounded-xl border-2 font-bold transition-all text-center ${agent.environment === env ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}
                >
                  {env}
                </button>
              ))}
              <input 
                 type="text"
                 placeholder="직접 입력..."
                 className="col-span-2 md:col-span-3 p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-center"
                 value={agent.environment || ''}
                 onChange={(e) => setAgent({...agent, environment: e.target.value})}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
             <div className="chat-bubble bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
              <p className="text-slate-800 font-medium text-lg">활동 장소: {agent.environment}</p>
              <p className="text-slate-600 mt-2">이제 세상을 인식해야 합니다. 어떤 <strong>센서(Sensor)</strong>를 장착할까요?</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {Object.values(SensorType).map((sensor) => {
                   const isSelected = agent.sensors?.includes(sensor);
                   return (
                     <button
                        key={sensor}
                        onClick={() => {
                          const current = agent.sensors || [];
                          const next = isSelected ? current.filter(s => s !== sensor) : [...current, sensor];
                          setAgent({...agent, sensors: next});
                        }}
                        className={`flex items-center gap-3 p-4 text-left rounded-lg transition-colors border ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                     >
                       <div className={`w-6 h-6 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-400 bg-white'}`}>
                         {isSelected && <Check size={16} />}
                       </div>
                       {sensor}
                     </button>
                   )
                 })}
               </div>
               {agent.sensors && agent.sensors.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
                    <strong>선택됨:</strong> {agent.sensors.join(', ')}
                 </div>
               )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="chat-bubble bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
              <p className="text-slate-800 font-medium text-lg">센서 장착 완료: {agent.sensors?.map(s => s.split(' ')[0]).join(', ')}.</p>
              <p className="text-slate-600 mt-2">센서로 상황을 인식한 뒤, 구체적으로 어떤 <strong>행동(Action)</strong>을 하나요?</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
              <div className="flex gap-3 mb-6">
                <input 
                  type="text"
                  className="flex-1 p-4 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                  placeholder="예: 경보 울리기"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAction()}
                />
                <button 
                  onClick={handleAddAction}
                  className="bg-indigo-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-indigo-700 text-lg"
                >
                  추가
                </button>
              </div>
              
              <ul className="space-y-3">
                {agent.actions?.map((act, i) => (
                  <li key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-lg text-slate-700 border border-slate-200 font-medium">
                    <span>{act}</span>
                    <button 
                      onClick={() => setAgent({...agent, actions: agent.actions?.filter((_, idx) => idx !== i)})}
                      className="text-red-400 hover:text-red-600 font-bold px-2"
                    >
                      삭제
                    </button>
                  </li>
                ))}
                {(!agent.actions || agent.actions.length === 0) && (
                  <li className="text-slate-400 italic text-center py-8">아직 추가된 행동이 없습니다.</li>
                )}
              </ul>
            </div>
          </div>
        );
      case 4:
         return (
          <div className="space-y-6">
            <div className="chat-bubble bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200">
              <p className="text-slate-800 font-medium text-lg">거의 다 됐습니다!</p>
              <p className="text-slate-600 mt-2">마지막으로 에이전트의 <strong>성격(특성)</strong>을 정하고, 아바타 색상을 골라주세요.</p>
            </div>

             <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 space-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">아바타 색상 선택</label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map(c => (
                      <button 
                        key={c}
                        className={`w-10 h-10 rounded-full ${c} ${agent.avatarColor === c ? 'ring-4 ring-slate-300 scale-110 shadow-md' : 'hover:scale-105'} transition-all`}
                        onClick={() => setAgent({...agent, avatarColor: c})}
                      />
                    ))}
                  </div>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">성격 및 특성 (Characteristics)</label>
                 <textarea 
                   className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                   placeholder="예: 예의 바름, 빠름, 장애물을 조심함..."
                   value={agent.characteristics || ''}
                   onChange={(e) => setAgent({...agent, characteristics: e.target.value})}
                 />
               </div>
            </div>
          </div>
         );
      case 5:
        return (
           <div className="text-center space-y-8 py-10">
              <div className="bg-green-50 text-green-700 p-8 rounded-3xl inline-block mb-4 border border-green-100 shadow-sm">
                 <h2 className="text-3xl font-bold flex items-center gap-3 justify-center mb-2">
                   <Check size={32} /> 에이전트 생성 완료!
                 </h2>
                 <p className="text-lg opacity-90">제작한 에이전트가 갤러리에 저장되었습니다.</p>
              </div>
              <div className="flex justify-center">
                 <button onClick={reset} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors text-lg">
                    <RotateCcw size={22} /> 다른 에이전트 만들기
                 </button>
              </div>
           </div>
        )
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="flex justify-between mb-8 px-2">
            {[0, 1, 2, 3, 4].map(s => (
                <div key={s} className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-500' : 'bg-slate-200'}`} />
            ))}
        </div>
      )}

      {/* Main Content */}
      <div className="animate-fade-in">
        {renderStep()}
      </div>

      {/* Feedback & Navigation */}
      {step < 5 && (
        <div className="mt-8">
            {feedback && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-bold animate-pulse">
                    {feedback}
                </div>
            )}
            <div className="flex justify-end">
                {step === 4 ? (
                    <button 
                        onClick={handleComplete}
                        className="flex items-center gap-2 bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 text-lg"
                    >
                        <Save size={22} /> 저장 및 완료
                    </button>
                ) : (
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 text-lg"
                    >
                        다음 단계 <ArrowRight size={22} />
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default TabGenerator;