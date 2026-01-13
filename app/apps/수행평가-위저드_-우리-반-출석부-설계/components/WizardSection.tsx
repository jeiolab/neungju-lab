import React, { useState, useEffect } from 'react';
import { WizardData, StudentInstance, StudentAttribute, StudentMethod } from '../types';
import { ATTRIBUTE_OPTIONS, METHOD_OPTIONS } from '../constants';
import { ArrowRight, CheckCircle, Code, Play, RefreshCw, UserPlus } from 'lucide-react';

interface WizardSectionProps {
  onComplete: () => void;
  updateData: (data: WizardData) => void;
  savedData: WizardData | null;
}

export const WizardSection: React.FC<WizardSectionProps> = ({ onComplete, updateData, savedData }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(savedData || {
    className: 'Student',
    selectedAttributes: [],
    selectedMethods: [],
    instances: []
  });

  // Simulation State
  const [simLog, setSimLog] = useState<{
    before: StudentInstance | null;
    after: StudentInstance | null;
    message: string[];
  } | null>(null);

  // Sync data up
  useEffect(() => {
    updateData(data);
  }, [data, updateData]);

  const handleNext = () => {
    if (step === 4) {
      onComplete();
    }
    setStep(prev => prev + 1);
  };

  const addInstance = () => {
    const newId = data.instances.length + 1;
    const initialValues: Record<string, any> = {};
    data.selectedAttributes.forEach(attr => {
      initialValues[attr.id] = attr.defaultValue;
    });
    // Set some sample names for variety
    if (data.selectedAttributes.find(a => a.id === 'name')) {
      initialValues['name'] = newId === 1 ? '김철수' : '이영희';
    }

    setData(prev => ({
      ...prev,
      instances: [...prev.instances, { id: newId, values: initialValues }]
    }));
  };

  const runSimulation = (instanceId: number, methodId: string) => {
    const instanceIndex = data.instances.findIndex(i => i.id === instanceId);
    if (instanceIndex === -1) return;

    const currentInstance = data.instances[instanceIndex];
    // Deep copy for "before" state
    const beforeState = JSON.parse(JSON.stringify(currentInstance));

    // Calculate new state logic manually since we can't serialize functions easily
    const newValues = { ...currentInstance.values };
    let feedback = [];

    if (methodId === 'markLate') {
      newValues.lateCount = (newValues.lateCount || 0) + 1;
      feedback = [
        `markLate() 메서드가 호출되었습니다.`,
        `${currentInstance.values.name || '학생'}의 '지각 횟수' 속성이 변경됩니다.`,
        `${beforeState.values.lateCount} -> ${newValues.lateCount}`
      ];
    } else if (methodId === 'submitAssignment') {
      newValues.assignmentScore = (newValues.assignmentScore || 0) + 10;
       feedback = [
        `submitAssignment() 메서드가 호출되었습니다.`,
        `${currentInstance.values.name || '학생'}의 '과제 점수' 속성이 변경됩니다.`,
        `${beforeState.values.assignmentScore} -> ${newValues.assignmentScore}`
      ];
    } else if (methodId === 'resetLate') {
      newValues.lateCount = 0;
       feedback = [
        `resetLate() 메서드가 호출되었습니다.`,
        `${currentInstance.values.name || '학생'}의 '지각 횟수' 속성이 0으로 초기화됩니다.`,
        `이전 값: ${beforeState.values.lateCount}`
      ];
    } else if (methodId === 'toggleLeader') {
      newValues.isLeader = !newValues.isLeader;
      feedback = [
        `toggleLeader() 메서드가 호출되었습니다.`,
        `${currentInstance.values.name || '학생'}의 '반장 여부' 속성이 토글되었습니다.`,
        `${beforeState.values.isLeader ? '반장 아님' : '반장'} 상태로 변경`
      ];
    }

    const updatedInstance = { ...currentInstance, values: newValues };
    
    // Update global state
    const newInstances = [...data.instances];
    newInstances[instanceIndex] = updatedInstance;
    setData(prev => ({ ...prev, instances: newInstances }));

    setSimLog({
      before: beforeState,
      after: updatedInstance,
      message: feedback
    });
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">1단계: 클래스 이름 짓기</h3>
      <p>우리 반 출석부를 관리할 클래스의 이름을 정해주세요. 보통 대문자로 시작하는 영어 단어를 사용합니다.</p>
      <input 
        type="text" 
        value={data.className} 
        onChange={(e) => setData({...data, className: e.target.value})}
        className="w-full p-3 border-2 border-slate-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
        placeholder="예: Student"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">2단계: 속성(Attribute) 추가</h3>
      <p>학생이 가져야 할 데이터(상태)를 선택하세요.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ATTRIBUTE_OPTIONS.map(attr => (
          <div 
            key={attr.id}
            onClick={() => {
              const exists = data.selectedAttributes.find(a => a.id === attr.id);
              if (exists) {
                setData(prev => ({...prev, selectedAttributes: prev.selectedAttributes.filter(a => a.id !== attr.id)}));
              } else {
                setData(prev => ({...prev, selectedAttributes: [...prev.selectedAttributes, attr]}));
              }
            }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.selectedAttributes.find(a => a.id === attr.id) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="font-bold">{attr.label}</div>
            <div className="text-sm text-slate-500">{attr.type}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">3단계: 메서드(Method) 추가</h3>
      <p>학생 객체가 할 수 있는 동작을 선택하세요.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {METHOD_OPTIONS.map(method => (
          <div 
            key={method.id}
            onClick={() => {
              const exists = data.selectedMethods.find(m => m.id === method.id);
              if (exists) {
                // Remove logic requires full object match in strictly typed setting, but here ID is enough
                setData(prev => ({...prev, selectedMethods: prev.selectedMethods.filter(m => m.id !== method.id)}));
              } else {
                 // Cast because we omitted 'action' in options for easier UI rendering logic
                 // In a real app we would merge the action back in
                 setData(prev => ({...prev, selectedMethods: [...prev.selectedMethods, method as any]}));
              }
            }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              data.selectedMethods.find(m => m.id === method.id) 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-slate-200 hover:border-slate-400'
            }`}
          >
            <div className="font-bold">{method.label}</div>
            <div className="text-sm text-slate-500">{method.description}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold">4단계: 인스턴스(Instance) 생성</h3>
      <p>설계도(클래스)를 바탕으로 실제 학생(인스턴스)을 2명 만들어보세요.</p>
      
      <button 
        onClick={addInstance}
        disabled={data.instances.length >= 2}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UserPlus size={20} />
        <span>인스턴스 생성하기 ({data.instances.length}/2)</span>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {data.instances.map((inst, idx) => (
          <div key={inst.id} className="border-2 border-slate-300 rounded-lg p-4 bg-white relative">
            <div className="absolute top-2 right-2 bg-slate-100 text-xs px-2 py-1 rounded">Addr: 0x{1000 + inst.id}</div>
            <h4 className="font-bold text-lg mb-2">인스턴스 #{idx + 1}</h4>
            <div className="space-y-2">
              {data.selectedAttributes.map(attr => (
                <div key={attr.id} className="flex justify-between text-sm">
                  <span className="text-slate-500">{attr.name}:</span>
                  <input 
                    type={attr.type === 'number' ? 'number' : 'text'}
                    value={inst.values[attr.id]}
                    onChange={(e) => {
                      const newInstances = [...data.instances];
                      newInstances[idx].values[attr.id] = attr.type === 'number' ? Number(e.target.value) : e.target.value;
                      setData({...data, instances: newInstances});
                    }}
                    className="border-b border-slate-300 w-1/2 text-right focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMicroExperiment = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-slate-800">마이크로 실험실</h3>
        <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">Interactive Simulation</span>
      </div>
      
      <p className="text-slate-600">
        아래 버튼을 눌러 메서드를 실행해보고, 선택한 인스턴스의 상태가 어떻게 변하는지 확인하세요.
      </p>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.instances.map((inst, idx) => (
          <div key={inst.id} className="bg-white border-2 border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-slate-700">{inst.values.name || `학생 ${idx+1}`}</h4>
              <span className="text-xs text-slate-400 font-mono">ID: {inst.id}</span>
            </div>
            
            {/* Current State Display (Mini) */}
            <div className="mb-4 bg-slate-50 p-3 rounded text-sm space-y-1">
               {data.selectedAttributes.map(attr => (
                 <div key={attr.id} className="flex justify-between">
                   <span className="text-slate-500">{attr.name}</span>
                   <span className="font-mono font-medium text-slate-800">
                     {typeof inst.values[attr.id] === 'boolean' 
                        ? (inst.values[attr.id] ? 'true' : 'false') 
                        : inst.values[attr.id]}
                   </span>
                 </div>
               ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase">Available Methods</p>
              <div className="grid grid-cols-1 gap-2">
                {data.selectedMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => runSimulation(inst.id, method.id)}
                    className="flex items-center justify-between w-full px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <span>{method.name}</span>
                    <Play size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulation Result Log */}
      {simLog && (
        <div className="mt-8 animate-fade-in-up">
          <div className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-800 px-4 py-2 flex items-center space-x-2 border-b border-slate-700">
              <Code size={18} className="text-green-400"/>
              <span className="font-mono text-sm font-bold">Execution Log</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Before */}
               <div className="border border-slate-700 rounded p-3 bg-slate-800/50">
                 <div className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Before State</div>
                 <pre className="text-sm font-mono text-red-300">
                   {JSON.stringify(simLog.before?.values, null, 2)}
                 </pre>
               </div>

               {/* Action/Feedback */}
               <div className="flex flex-col items-center justify-center space-y-3 text-center">
                 <ArrowRight className="text-yellow-400 w-8 h-8 hidden md:block" />
                 <div className="space-y-1">
                    {simLog.message.map((msg, i) => (
                      <p key={i} className={`text-sm ${i===0 ? 'text-yellow-300 font-bold' : 'text-slate-300'}`}>
                        {msg}
                      </p>
                    ))}
                 </div>
               </div>

               {/* After */}
               <div className="border border-slate-700 rounded p-3 bg-slate-800/50">
                 <div className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">After State</div>
                 <pre className="text-sm font-mono text-green-300">
                   {JSON.stringify(simLog.after?.values, null, 2)}
                 </pre>
               </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex items-start">
             <div className="mr-3 mt-0.5"><CheckCircle size={16} /></div>
             <div>
               <strong>핵심 포인트:</strong> 메서드는 선택된 특정 인스턴스(this)의 속성만 변경합니다. 
               다른 인스턴스에는 영향을 주지 않습니다.
             </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg min-h-[600px]">
      {/* Wizard Progress Header */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {step > 4 ? `설계 완료: ${data.className} 클래스` : '클래스 설계 위저드'}
        </h2>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map(s => (
             <div 
               key={s} 
               className={`w-3 h-3 rounded-full ${
                 step === s ? 'bg-blue-600 scale-125' : 
                 step > s ? 'bg-blue-400' : 'bg-slate-200'
               } transition-all`}
             />
          ))}
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderMicroExperiment()}

      <div className="mt-8 flex justify-between pt-4 border-t">
        <button 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-6 py-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500"
        >
          이전
        </button>
        
        {step < 5 && (
          <button 
            onClick={handleNext}
            disabled={step === 4 && data.instances.length < 2}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{step === 4 ? '설계 완료 및 실험실 입장' : '다음 단계'}</span>
            <ArrowRight size={18} />
          </button>
        )}
        
        {step === 5 && (
          <button 
             onClick={() => {
                setData({
                  className: 'Student',
                  selectedAttributes: [],
                  selectedMethods: [],
                  instances: []
                });
                setStep(1);
                setSimLog(null);
             }}
             className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>처음부터 다시 설계하기</span>
          </button>
        )}
      </div>
    </div>
  );
};
