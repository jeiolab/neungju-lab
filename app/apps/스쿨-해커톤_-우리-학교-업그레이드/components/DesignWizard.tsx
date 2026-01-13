import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, Lightbulb, Plus, Trash2, 
  Save, CheckCircle, AlertTriangle, RotateCcw, Cpu
} from 'lucide-react';
import { 
  Project, Step, AVAILABLE_SENSORS, AVAILABLE_ACTUATORS, 
  IoTComponent, ComponentType, LogicBlock 
} from '../types';
import * as GeminiService from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DesignWizardProps {
  onSave: (project: Project) => void;
}

const DesignWizard: React.FC<DesignWizardProps> = ({ onSave }) => {
  const [step, setStep] = useState<Step>('PROBLEM');
  const [loading, setLoading] = useState(false);
  
  // Project State
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [selectedSensors, setSelectedSensors] = useState<IoTComponent[]>([]);
  const [selectedActuators, setSelectedActuators] = useState<IoTComponent[]>([]);
  const [logicBlocks, setLogicBlocks] = useState<LogicBlock[]>([]);
  
  // AI State
  const [aiHint, setAiHint] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{ feedback: string, score: number } | null>(null);

  // Helper to find component name
  const getName = (id: string) => {
    const all = [...AVAILABLE_SENSORS, ...AVAILABLE_ACTUATORS];
    return all.find(c => c.id === id)?.name || id;
  };

  const handleGetHint = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    const hint = await GeminiService.getProblemHints(problem);
    setAiHint(hint);
    setLoading(false);
  };

  const handleAddComponent = (comp: IoTComponent) => {
    if (comp.type === ComponentType.SENSOR) {
      if (!selectedSensors.find(s => s.id === comp.id)) {
        setSelectedSensors([...selectedSensors, comp]);
      }
    } else {
      if (!selectedActuators.find(a => a.id === comp.id)) {
        setSelectedActuators([...selectedActuators, comp]);
      }
    }
  };

  const handleRemoveComponent = (id: string, type: ComponentType) => {
    if (type === ComponentType.SENSOR) {
      setSelectedSensors(selectedSensors.filter(s => s.id !== id));
      // Remove logic blocks dependent on this sensor
      setLogicBlocks(logicBlocks.filter(l => l.conditionSensorId !== id));
    } else {
      setSelectedActuators(selectedActuators.filter(a => a.id !== id));
      // Remove logic blocks dependent on this actuator
      setLogicBlocks(logicBlocks.filter(l => l.actionActuatorId !== id));
    }
  };

  const handleAddLogic = () => {
    if (selectedSensors.length === 0 || selectedActuators.length === 0) return;
    const newBlock: LogicBlock = {
      conditionSensorId: selectedSensors[0].id,
      operator: '>',
      threshold: '0',
      actionActuatorId: selectedActuators[0].id,
      actionType: 'ACTIVATE'
    };
    setLogicBlocks([...logicBlocks, newBlock]);
  };

  const updateLogic = (index: number, field: keyof LogicBlock, value: string) => {
    setLogicBlocks(prev => prev.map((block, i) => 
      i === index ? { ...block, [field]: value } : block
    ));
  };

  const handleFinalize = async () => {
    setLoading(true);
    const tempProject: Project = {
      id: Date.now().toString(),
      title: title || '제목 없는 프로젝트',
      problem,
      sensors: selectedSensors,
      actuators: selectedActuators,
      logic: logicBlocks,
      createdAt: Date.now(),
    };
    
    const evalResult = await GeminiService.evaluateProject(tempProject);
    setEvaluation(evalResult);
    setLoading(false);
  };

  const handleSaveProject = () => {
    if (!evaluation) return;
    const finalProject: Project = {
      id: Date.now().toString(),
      title: title || '제목 없는 프로젝트',
      problem,
      sensors: selectedSensors,
      actuators: selectedActuators,
      logic: logicBlocks,
      createdAt: Date.now(),
      aiFeedback: evaluation.feedback,
      score: evaluation.score
    };
    onSave(finalProject);
    // Reset or navigate
    alert("포트폴리오에 저장되었습니다!");
  };

  // --- Step Renders ---

  const renderProblemStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <label className="block text-lg font-bold text-slate-700 mb-2">1단계: 문제 정의</label>
        <p className="text-slate-500 mb-4 text-sm">학교 생활 중 불편하거나 해결하고 싶은 문제는 무엇인가요?</p>
        <input 
          type="text" 
          placeholder="프로젝트 제목 (예: 스마트 급식실)"
          className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none resize-none h-32"
          placeholder="예: 급식실 줄이 너무 길어서 언제 내려가야 할지 모르겠어요."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <div className="mt-4 flex justify-between items-center">
          <button 
            onClick={handleGetHint}
            disabled={loading || !problem}
            className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full hover:bg-yellow-100 transition-colors disabled:opacity-50"
          >
            <Lightbulb size={18} />
            <span>{loading ? '생각 중...' : 'AI 코치에게 힌트 얻기'}</span>
          </button>
        </div>
        {aiHint && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-800 text-sm flex items-start space-x-3">
             <Cpu className="shrink-0 mt-1" size={18}/>
             <p>{aiHint}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderDevicesStep = () => (
    <div className="flex flex-col md:flex-row gap-6 h-[500px] animate-fade-in">
      {/* Toolbox */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-y-auto">
        <h3 className="font-bold text-slate-700 mb-4">부품 상자</h3>
        
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">센서 (입력)</h4>
          <div className="space-y-2">
            {AVAILABLE_SENSORS.map(s => (
              <button key={s.id} onClick={() => handleAddComponent(s)} className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all group text-left">
                <div className="bg-white p-2 rounded-md shadow-sm mr-3 text-blue-500">
                  <div className="font-bold text-xs">입력</div>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.description}</p>
                </div>
                <Plus size={16} className="ml-auto text-blue-400 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">액추에이터 (출력)</h4>
          <div className="space-y-2">
            {AVAILABLE_ACTUATORS.map(a => (
              <button key={a.id} onClick={() => handleAddComponent(a)} className="w-full flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-all group text-left">
                <div className="bg-white p-2 rounded-md shadow-sm mr-3 text-green-500">
                  <div className="font-bold text-xs">출력</div>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{a.name}</p>
                  <p className="text-xs text-slate-500">{a.description}</p>
                </div>
                <Plus size={16} className="ml-auto text-green-400 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative">
        <h3 className="absolute top-4 left-4 font-bold text-slate-400">나의 시스템 설계도</h3>
        
        <div className="flex w-full items-center justify-center gap-8">
          {/* Inputs */}
          <div className="flex flex-col gap-3 items-center p-4 bg-white/50 rounded-xl min-w-[120px] min-h-[200px] border border-blue-200">
            <span className="text-xs font-bold text-blue-400">입력 장치 (INPUT)</span>
            {selectedSensors.length === 0 && <span className="text-xs text-slate-400 italic mt-10">센서를 선택하세요</span>}
            {selectedSensors.map(s => (
              <div key={s.id} className="relative group">
                <div className="p-3 bg-white border border-blue-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 w-32 text-center">
                  {s.name}
                </div>
                <button onClick={() => handleRemoveComponent(s.id, ComponentType.SENSOR)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-200">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="h-1 bg-slate-300 w-16"></div>
          
          <div className="bg-slate-800 text-white px-4 py-8 rounded-lg font-mono text-sm shadow-lg z-10">
            처리<br/>(PROCESS)
          </div>

          <div className="h-1 bg-slate-300 w-16"></div>

          {/* Outputs */}
          <div className="flex flex-col gap-3 items-center p-4 bg-white/50 rounded-xl min-w-[120px] min-h-[200px] border border-green-200">
             <span className="text-xs font-bold text-green-500">출력 장치 (OUTPUT)</span>
             {selectedActuators.length === 0 && <span className="text-xs text-slate-400 italic mt-10">액추에이터를 선택하세요</span>}
             {selectedActuators.map(a => (
              <div key={a.id} className="relative group">
                <div className="p-3 bg-white border border-green-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 w-32 text-center">
                  {a.name}
                </div>
                <button onClick={() => handleRemoveComponent(a.id, ComponentType.ACTUATOR)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-200">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogicStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-700 text-lg">알고리즘 설계</h3>
          <button onClick={handleAddLogic} className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
            <Plus size={16} />
            <span>블록 추가하기</span>
          </button>
        </div>

        {logicBlocks.length === 0 ? (
          <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Cpu size={48} className="mx-auto mb-4 opacity-50" />
            <p>아직 규칙이 없어요. "블록 추가하기"를 눌러보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logicBlocks.map((block, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                <span className="font-bold text-indigo-500">만약(IF)</span>
                
                <select 
                  className="p-2 border rounded-md text-sm bg-white"
                  value={block.conditionSensorId}
                  onChange={(e) => updateLogic(idx, 'conditionSensorId', e.target.value)}
                >
                  {selectedSensors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>

                <select 
                  className="p-2 border rounded-md text-sm bg-white font-mono"
                  value={block.operator}
                  onChange={(e) => updateLogic(idx, 'operator', e.target.value as any)}
                >
                  <option value=">">값이 큼(&gt;)</option>
                  <option value="<">값이 작음(&lt;)</option>
                  <option value="="">값이 같음(=)</option>
                  <option value="DETECTS">감지함</option>
                </select>

                <input 
                  type="text" 
                  className="p-2 border rounded-md text-sm w-24"
                  placeholder="값(숫자)"
                  value={block.threshold}
                  onChange={(e) => updateLogic(idx, 'threshold', e.target.value)}
                />

                <span className="font-bold text-indigo-500">라면(THEN)</span>

                <select 
                  className="p-2 border rounded-md text-sm bg-white"
                  value={block.actionActuatorId}
                  onChange={(e) => updateLogic(idx, 'actionActuatorId', e.target.value)}
                >
                  {selectedActuators.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>

                <span className="text-sm font-medium text-slate-600">작동시키기</span>
                
                <button 
                  onClick={() => {
                    const newBlocks = [...logicBlocks];
                    newBlocks.splice(idx, 1);
                    setLogicBlocks(newBlocks);
                  }}
                  className="ml-auto text-slate-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="animate-fade-in space-y-6">
      {!evaluation ? (
         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
           <Cpu className="animate-bounce text-blue-500 mb-4" size={48} />
           <p className="text-slate-600 font-medium text-lg">AI 코치가 프로젝트를 분석 중입니다...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Cpu size={120} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 mb-6 italic">"{problem}"</p>

            <div className="space-y-4 mb-8">
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase">입력 시스템</h4>
                <p className="text-sm font-medium">{selectedSensors.map(s => s.name).join(', ')}</p>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase">처리 알고리즘</h4>
                <ul className="text-sm list-disc list-inside text-slate-600">
                  {logicBlocks.map((l, i) => (
                    <li key={i}>만약 {getName(l.conditionSensorId)} {l.operator} {l.threshold} 이면, {getName(l.actionActuatorId)} 작동</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-400 uppercase">출력 시스템</h4>
                <p className="text-sm font-medium">{selectedActuators.map(a => a.name).join(', ')}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                 <Lightbulb size={16} className="text-yellow-500"/> AI 코치 피드백
               </h4>
               <p className="text-sm text-slate-600">{evaluation.feedback}</p>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex flex-col gap-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm flex-1 flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-slate-700 mb-4">논리적 타당성 점수</h3>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ name: 'Score', value: evaluation.score }]}>
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[0, 100]} hide />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-4xl font-bold text-indigo-600">{evaluation.score}<span className="text-lg text-slate-400">/100</span></div>
             </div>

             <button 
                onClick={handleSaveProject}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-md shadow-green-200 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                포트폴리오에 저장
             </button>
          </div>
        </div>
      )}
    </div>
  );

  const steps: {id: Step, label: string}[] = [
    {id: 'PROBLEM', label: '문제 정의'}, 
    {id: 'DEVICES', label: '장치 선택'}, 
    {id: 'ALGORITHM', label: '알고리즘'}, 
    {id: 'REVIEW', label: '최종 검토'}
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Wizard Progress */}
      <div className="flex justify-between mb-8 px-4">
        {steps.map((s, i) => {
          const isActive = step === s.id;
          const isPast = ['PROBLEM', 'DEVICES', 'ALGORITHM', 'REVIEW'].indexOf(step) > i;
          return (
            <div key={s.id} className="flex flex-col items-center relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 
                ${isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
                  isPast ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {isPast ? <CheckCircle size={18} /> : i + 1}
              </div>
              <span className={`text-xs mt-2 font-semibold ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {step === 'PROBLEM' && renderProblemStep()}
        {step === 'DEVICES' && renderDevicesStep()}
        {step === 'ALGORITHM' && renderLogicStep()}
        {step === 'REVIEW' && renderReviewStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
        <button 
          onClick={() => {
            if (step === 'DEVICES') setStep('PROBLEM');
            if (step === 'ALGORITHM') setStep('DEVICES');
            if (step === 'REVIEW') setStep('ALGORITHM');
          }}
          disabled={step === 'PROBLEM' || loading}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 disabled:opacity-0 transition-opacity font-bold"
        >
          <ArrowLeft size={20} />
          <span>이전</span>
        </button>

        <button 
          onClick={() => {
            if (step === 'PROBLEM') setStep('DEVICES');
            if (step === 'DEVICES') setStep('ALGORITHM');
            if (step === 'ALGORITHM') {
              setStep('REVIEW');
              handleFinalize();
            }
          }}
          disabled={
            (step === 'PROBLEM' && !problem) || 
            (step === 'DEVICES' && (selectedSensors.length === 0 || selectedActuators.length === 0)) ||
            loading || step === 'REVIEW'
          }
          className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all font-bold"
        >
          <span>{step === 'ALGORITHM' ? '완료 및 검토' : '다음 단계'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default DesignWizard;