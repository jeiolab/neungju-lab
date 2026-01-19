import React, { useState } from 'react';
import { AgentDesign, AgentModule, ModuleType } from '../types';
import { evaluateAgent } from '../services/geminiService';
import { Camera, Brain, Database, Zap, Save, PlayCircle, Trash2, Cpu, Activity, Eye, HardDrive, RotateCcw } from 'lucide-react';

interface SimulationTabProps {
  onSaveAgent: (agent: AgentDesign) => void;
  initialTopic?: string;
}

const AVAILABLE_MODULES: AgentModule[] = [
  // Sensors
  { id: 's1', name: 'RGB 카메라', type: ModuleType.SENSOR, icon: 'camera', description: '시각 정보를 입력받습니다.' },
  { id: 's2', name: '마이크', type: ModuleType.SENSOR, icon: 'mic', description: '소리를 듣습니다.' },
  { id: 's3', name: 'LiDAR/거리센서', type: ModuleType.SENSOR, icon: 'radar', description: '물체와의 거리를 측정합니다.' },
  { id: 's4', name: '온/습도 센서', type: ModuleType.SENSOR, icon: 'thermometer', description: '환경 정보를 측정합니다.' },
  
  // Data
  { id: 'd1', name: '이미지 데이터셋', type: ModuleType.DATA, icon: 'image', description: '사물 인식을 위한 이미지 모음.' },
  { id: 'd2', name: '음성 데이터셋', type: ModuleType.DATA, icon: 'music', description: '언어 처리를 위한 음성 모음.' },
  { id: 'd3', name: '실내 지도 데이터', type: ModuleType.DATA, icon: 'map', description: '공간 네비게이션을 위한 지도.' },

  // Algorithms
  { id: 'a1', name: '객체 인식(CV)', type: ModuleType.ALGORITHM, icon: 'eye', description: '이미지에서 사물을 찾습니다.' },
  { id: 'a2', name: '자연어 처리(NLP)', type: ModuleType.ALGORITHM, icon: 'message', description: '사람의 말을 이해합니다.' },
  { id: 'a3', name: '경로 탐색', type: ModuleType.ALGORITHM, icon: 'navigation', description: '최적의 이동 경로를 계산합니다.' },
  { id: 'a4', name: '이상 탐지', type: ModuleType.ALGORITHM, icon: 'alert', description: '정상 범위를 벗어난 수치를 찾습니다.' },

  // Actuators
  { id: 'ac1', name: '바퀴 모터', type: ModuleType.ACTUATOR, icon: 'circle', description: '에이전트를 이동시킵니다.' },
  { id: 'ac2', name: '로봇 팔', type: ModuleType.ACTUATOR, icon: 'hand', description: '물건을 집거나 조작합니다.' },
  { id: 'ac3', name: '스피커', type: ModuleType.ACTUATOR, icon: 'speaker', description: '소리를 냅니다.' },
  { id: 'ac4', name: '디스플레이', type: ModuleType.ACTUATOR, icon: 'screen', description: '화면에 정보를 표시합니다.' },
];

export const SimulationTab: React.FC<SimulationTabProps> = ({ onSaveAgent, initialTopic }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(initialTopic || '');
  const [selectedModules, setSelectedModules] = useState<AgentModule[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{success: boolean, message: string} | null>(null);
  const [ctoFeedback, setCtoFeedback] = useState<string>('');

  const toggleModule = (module: AgentModule) => {
    if (selectedModules.find(m => m.id === module.id)) {
      setSelectedModules(selectedModules.filter(m => m.id !== module.id));
    } else {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const checkLogic = (): { success: boolean; message: string } => {
    // Basic hardcoded logic validation
    const hasSensor = selectedModules.some(m => m.type === ModuleType.SENSOR);
    const hasAlgorithm = selectedModules.some(m => m.type === ModuleType.ALGORITHM);
    const hasActuator = selectedModules.some(m => m.type === ModuleType.ACTUATOR);
    const hasData = selectedModules.some(m => m.type === ModuleType.DATA);

    if (!hasSensor) return { success: false, message: "⚠️ [인식 실패] 센서가 없어 외부 환경을 감지할 수 없습니다." };
    if (!hasData) return { success: false, message: "⚠️ [학습 부족] 판단 기준이 될 학습 데이터가 없습니다." };
    if (!hasAlgorithm) return { success: false, message: "⚠️ [추론 불가] 데이터를 처리할 뇌(알고리즘)가 없습니다." };
    if (!hasActuator) return { success: false, message: "⚠️ [행동 불가] 판단을 내렸지만 움직일 수 있는 장치가 없습니다." };

    return { success: true, message: "✅ 시스템 진단 완료: 모든 모듈이 정상적으로 연결되었습니다." };
  };

  const runSimulation = async () => {
    if (!name || !goal) {
      alert("에이전트 이름과 목표를 먼저 설정해주세요!");
      return;
    }

    setIsSimulating(true);
    setSimulationResult(null);
    setCtoFeedback('');

    // 1. Internal Logic Check
    const logicCheck = checkLogic();
    
    // 2. Simulate delay for "processing"
    setTimeout(async () => {
      setSimulationResult(logicCheck);
      
      if (logicCheck.success) {
        // 3. Get Gemini Feedback if structure is valid
        const agentDraft: AgentDesign = {
          id: Date.now().toString(),
          name,
          goal,
          sensors: selectedModules.filter(m => m.type === ModuleType.SENSOR),
          data: selectedModules.filter(m => m.type === ModuleType.DATA),
          algorithm: selectedModules.filter(m => m.type === ModuleType.ALGORITHM),
          actuators: selectedModules.filter(m => m.type === ModuleType.ACTUATOR),
          createdAt: Date.now(),
          status: 'tested'
        };

        const feedback = await evaluateAgent(agentDraft);
        setCtoFeedback(feedback);
        
        // Save automatically on success
        onSaveAgent({...agentDraft, feedback});
      }
      setIsSimulating(false);
    }, 2000);
  };

  const reset = () => {
    setSelectedModules([]);
    setSimulationResult(null);
    setCtoFeedback('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Goal Setting */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-600" /> 1단계: 목표 설정
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">에이전트 이름</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 청소봇 3000"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">해결하려는 문제 (목표)</label>
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: 거실의 강아지 털을 자동으로 청소한다."
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Assembly Room */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-blue-600" /> 2단계: 부품 조립
          </h2>
          <button onClick={reset} className="text-sm text-slate-500 hover:text-red-500 flex items-center">
            <RotateCcw className="w-4 h-4 mr-1" /> 초기화
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module Selection */}
          <div className="lg:col-span-3 space-y-6">
            {(['SENSOR', 'DATA', 'ALGORITHM', 'ACTUATOR'] as const).map((type) => (
              <div key={type} className="bg-slate-50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center">
                  {type === 'SENSOR' && <Eye className="w-4 h-4 mr-2" />}
                  {type === 'DATA' && <Database className="w-4 h-4 mr-2" />}
                  {type === 'ALGORITHM' && <Brain className="w-4 h-4 mr-2" />}
                  {type === 'ACTUATOR' && <Zap className="w-4 h-4 mr-2" />}
                  {type}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {AVAILABLE_MODULES.filter(m => m.type === type).map(module => {
                    const isSelected = selectedModules.find(m => m.id === module.id);
                    return (
                      <button
                        key={module.id}
                        onClick={() => toggleModule(module)}
                        className={`p-3 rounded-lg text-left transition-all border-2 relative overflow-hidden group
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                            : 'border-white bg-white hover:border-slate-300 shadow-sm'}`}
                      >
                        <div className="text-xs font-semibold text-slate-800 mb-1 truncate">{module.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{module.description}</div>
                        {isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Current Build Preview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 text-white p-5 rounded-2xl h-full flex flex-col sticky top-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <HardDrive className="w-5 h-5 mr-2" /> 현재 설계도
              </h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px]">
                {selectedModules.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-10">
                    왼쪽에서 부품을<br/>선택해주세요.
                  </p>
                )}
                
                {selectedModules.map(m => (
                  <div key={m.id} className="flex items-center justify-between bg-slate-700 p-2 rounded text-sm animate-pulse-once">
                    <span>{m.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded text-slate-300">{m.type}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className={`w-full py-3 rounded-xl font-bold text-white flex justify-center items-center shadow-lg transition-all
                    ${isSimulating 
                      ? 'bg-slate-600 cursor-wait' 
                      : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95'}`}
                >
                  {isSimulating ? (
                    <>시뮬레이션 가동 중...</>
                  ) : (
                    <><PlayCircle className="w-5 h-5 mr-2" /> 테스트 실행</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Results */}
      {simulationResult && (
        <div className={`p-6 rounded-2xl shadow-lg border-2 animate-slide-up ${
          simulationResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 ${
              simulationResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {simulationResult.success ? <Activity className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${
                simulationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {simulationResult.success ? '테스트 성공!' : '시스템 오류'}
              </h3>
              <p className="text-slate-700 mb-4 font-medium">{simulationResult.message}</p>
              
              {ctoFeedback && (
                <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-purple-600 mb-2 uppercase flex items-center">
                     <Brain className="w-4 h-4 mr-2" /> CTO의 피드백
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {ctoFeedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};