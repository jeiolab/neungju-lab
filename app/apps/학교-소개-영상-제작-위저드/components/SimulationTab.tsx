import React, { useState, useEffect, useCallback } from 'react';
import { ProjectConfig, Task, TeamMember, WizardStep } from '../types';
import { generateTasksFromConcept } from '../services/geminiService';
import { Plus, Trash2, ArrowRight, AlertTriangle, CheckCircle, Clock, Users, ArrowDown } from 'lucide-react';

interface SimulationTabProps {
  onScoreUpdate: (points: number, badge?: string) => void;
  saveData: (tasks: Task[], config: ProjectConfig) => void;
  savedTasks: Task[];
  savedConfig: ProjectConfig | null;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onScoreUpdate, saveData, savedTasks, savedConfig }) => {
  const [step, setStep] = useState<WizardStep>('analysis');
  const [loading, setLoading] = useState(false);
  
  const [config, setConfig] = useState<ProjectConfig>(savedConfig || {
    teamSize: 4,
    videoDuration: 3,
    concept: 'Informative',
    availableDays: 5
  });

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>(savedTasks.length > 0 ? savedTasks : []);
  const [warning, setWarning] = useState<string | null>(null);

  // Initialize team based on size
  useEffect(() => {
    if (team.length === 0) {
      const newTeam: TeamMember[] = Array.from({ length: config.teamSize }).map((_, i) => ({
        id: `m${i + 1}`,
        name: `팀원 ${i + 1}`,
        role: i === 0 ? 'Planning' : 'Camera'
      }));
      setTeam(newTeam);
    }
  }, [config.teamSize]);

  // --- Step 1: Analysis ---
  const handleConfigSubmit = () => {
    onScoreUpdate(10); // Points for analysis
    setStep('breakdown1');
  };

  // --- Step 2: 1st Breakdown (Auto Generation) ---
  const handleGenerateTasks = async () => {
    setLoading(true);
    const generated = await generateTasksFromConcept(config.concept, config.videoDuration);
    setTasks(generated);
    setLoading(false);
    onScoreUpdate(20, "First Breakdown");
    setStep('breakdown2');
  };

  // --- Step 3: 2nd Breakdown (Refinement) ---
  const addTask = () => {
    const newTask: Task = {
      id: `manual_${Date.now()}`,
      title: '새 작업',
      phase: 'Production',
      dependencies: []
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTaskTitle = (id: string, title: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const proceedToDependencies = () => {
    if (tasks.length < 5) {
      setWarning("작업이 너무 적습니다. 최소 5개 이상 만들어주세요.");
      return;
    }
    setWarning(null);
    onScoreUpdate(10);
    setStep('dependencies');
  };

  // --- Step 4: Dependencies ---
  const toggleDependency = (taskId: string, depId: string) => {
    if (taskId === depId) return;
    
    // Check for cycles
    if (createsCycle(taskId, depId)) {
        setWarning("순환 참조 발생! 작업이 자신의 후행 작업에 의존할 수 없습니다.");
        return;
    }
    setWarning(null);

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const isDep = t.dependencies.includes(depId);
      return {
        ...t,
        dependencies: isDep 
          ? t.dependencies.filter(d => d !== depId)
          : [...t.dependencies, depId]
      };
    }));
  };

  const createsCycle = (taskId: string, newDepId: string): boolean => {
    // Basic DFS to see if newDepId eventually points back to taskId
    const visited = new Set<string>();
    const stack = [newDepId];
    
    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === taskId) return true;
      if (!visited.has(current)) {
        visited.add(current);
        const task = tasks.find(t => t.id === current);
        if (task) {
          stack.push(...task.dependencies);
        }
      }
    }
    return false;
  };

  const checkDependencies = () => {
    // Validation logic
    const hasDependencies = tasks.some(t => t.dependencies.length > 0);
    if (!hasDependencies) {
        setWarning("팁: 논리적인 순서를 보여주기 위해 최소한 몇 개의 작업은 연결해보세요.");
        // We allow proceeding but warn
    } else {
        onScoreUpdate(50, "Dependency Master");
    }
    setStep('scheduling');
  };

  // --- Step 5: Scheduling ---
  const assignMember = (taskId: string, memberId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, assignedTo: memberId } : t));
  };

  const finishWizard = () => {
    const assignedCount = tasks.filter(t => t.assignedTo).length;
    if (assignedCount === tasks.length) {
        onScoreUpdate(30, "Schedule Complete");
    }
    saveData(tasks, config);
    alert("프로젝트 계획이 성공적으로 저장되었습니다!");
  };

  // --- Render Helpers ---
  const getPhaseLabel = (phase: string) => {
    switch(phase) {
      case 'Planning': return '기획';
      case 'Production': return '촬영/제작';
      case 'Post-Production': return '편집/후반';
      default: return phase;
    }
  };

  const renderStepAnalysis = () => (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-bold text-slate-800">1단계: 문제 분석 (Project Analysis)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow border border-slate-200">
          <label className="block text-sm font-medium text-slate-600 mb-1">영상 컨셉</label>
          <select 
            value={config.concept}
            onChange={(e) => setConfig({...config, concept: e.target.value as any})}
            className="w-full p-2 border rounded-md"
          >
            <option value="Informative">정보 전달 (뉴스/다큐)</option>
            <option value="Emotional">감성/드라마 (뮤직비디오/영화)</option>
            <option value="Humorous">유머/예능 (패러디/스킷)</option>
          </select>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-slate-200">
          <label className="block text-sm font-medium text-slate-600 mb-1">영상 길이 (분)</label>
          <input 
            type="number" 
            min="1" max="10"
            value={config.videoDuration}
            onChange={(e) => setConfig({...config, videoDuration: parseInt(e.target.value)})}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-slate-200">
            <label className="block text-sm font-medium text-slate-600 mb-1">팀원 수</label>
            <input 
                type="range" min="2" max="6"
                value={config.teamSize}
                onChange={(e) => setConfig({...config, teamSize: parseInt(e.target.value)})}
                className="w-full cursor-pointer"
            />
            <div className="text-center font-bold text-indigo-600">{config.teamSize} 명</div>
        </div>
      </div>
      <button 
        onClick={handleConfigSubmit}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        분석 완료 & 다음 단계 <ArrowRight size={18} />
      </button>
    </div>
  );

  const renderBreakdown = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">
        {step === 'breakdown1' ? '2단계: 1차 문제 분해 (AI 자동 생성)' : '3단계: 작업 상세 조정 (Refinement)'}
      </h3>
      
      {loading ? (
        <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">AI 코치가 문제를 분해하고 있습니다...</p>
        </div>
      ) : (
        <>
           {step === 'breakdown1' ? (
             <div className="text-center py-8">
               <p className="mb-4 text-lg text-slate-700"><strong>{config.concept === 'Informative' ? '정보 전달' : config.concept === 'Emotional' ? '감성/드라마' : '유머/예능'}</strong> 컨셉에 맞는 작업 목록을 생성합니다.</p>
               <button 
                onClick={handleGenerateTasks}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 font-bold"
               >
                 작업 목록 자동 생성하기
               </button>
             </div>
           ) : (
             <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                    <span className="font-semibold text-slate-700">작업 목록 ({tasks.length}개)</span>
                    <button onClick={addTask} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-green-200">
                        <Plus size={14} /> 작업 추가
                    </button>
                </div>
                <ul className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                    {tasks.map((task, idx) => (
                        <li key={task.id} className="p-3 flex items-center gap-3 hover:bg-slate-50">
                            <span className="text-xs font-mono text-slate-400 w-6">{idx + 1}</span>
                            <input 
                                value={task.title}
                                onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                                className="flex-1 p-1 border-b border-transparent focus:border-indigo-500 outline-none bg-transparent"
                            />
                            <span className={`text-xs px-2 py-0.5 rounded-full ${task.phase === 'Planning' ? 'bg-blue-100 text-blue-700' : task.phase === 'Production' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                {getPhaseLabel(task.phase)}
                            </span>
                            <button onClick={() => removeTask(task.id)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="p-4 border-t bg-slate-50">
                    <button onClick={proceedToDependencies} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        작업 확정 & 다음 단계
                    </button>
                    {warning && <p className="text-center text-red-500 text-sm mt-2">{warning}</p>}
                </div>
             </div>
           )}
        </>
      )}
    </div>
  );

  const renderDependencies = () => (
    <div className="space-y-4 h-full flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 flex justify-between items-center">
            4단계: 의존 관계 모델링 (Dependency)
            <button onClick={checkDependencies} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg">다음 단계</button>
        </h3>
        <p className="text-sm text-slate-600">체크박스를 선택하세요: "가로줄(Row) 작업은 세로줄(Column) 작업이 끝나야 시작할 수 있음"</p>
        
        {warning && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2">
                <AlertTriangle size={16} /> {warning}
            </div>
        )}

        <div className="overflow-auto border rounded-lg shadow bg-white flex-1">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr>
                        <th className="p-2 border-b font-medium text-slate-500">작업 \ 선행작업</th>
                        {tasks.map((colTask, i) => (
                            <th key={colTask.id} className="p-2 border-b font-medium text-slate-500 w-8 text-center" title={colTask.title}>
                                {i + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((rowTask, rowIndex) => (
                        <tr key={rowTask.id} className="hover:bg-slate-50">
                            <td className="p-2 border-b font-medium text-slate-800 border-r min-w-[200px]">
                                <span className="text-slate-400 mr-2 font-mono">{rowIndex + 1}.</span>
                                {rowTask.title}
                            </td>
                            {tasks.map((colTask, colIndex) => {
                                const isSelf = rowTask.id === colTask.id;
                                const isChecked = rowTask.dependencies.includes(colTask.id);
                                return (
                                    <td key={colTask.id} className={`p-2 border-b text-center border-r ${isSelf ? 'bg-slate-100' : ''}`}>
                                        {!isSelf && (
                                            <input 
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleDependency(rowTask.id, colTask.id)}
                                                className="cursor-pointer rounded text-indigo-600 focus:ring-indigo-500"
                                            />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderScheduling = () => (
    <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">5단계: 일정 및 역할 배정 (Scheduling)</h3>
        <p className="text-slate-600 text-sm">각 작업을 담당할 팀원을 배정하세요. 업무량이 한 사람에게 쏠리지 않도록 주의하세요.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-3 text-left">작업명</th>
                            <th className="p-3 text-left">선행 작업</th>
                            <th className="p-3 text-left">담당자 배정</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td className="p-3 font-medium text-slate-800">{task.title}</td>
                                <td className="p-3 text-slate-500">
                                    {task.dependencies.length === 0 ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">없음</span> : 
                                      task.dependencies.map(d => {
                                        const dep = tasks.find(t => t.id === d);
                                        return <span key={d} className="text-xs bg-slate-100 text-slate-600 px-1 rounded mr-1">{dep?.title.slice(0, 8)}...</span>
                                      })
                                    }
                                </td>
                                <td className="p-3">
                                    <select 
                                        value={task.assignedTo || ""}
                                        onChange={(e) => assignMember(task.id, e.target.value)}
                                        className={`w-full p-1.5 border rounded text-sm ${!task.assignedTo ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                                    >
                                        <option value="">담당자 선택...</option>
                                        {team.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Users size={18}/> 업무량 (Workload)
                </h4>
                <div className="space-y-3">
                    {team.map(m => {
                        const count = tasks.filter(t => t.assignedTo === m.id).length;
                        return (
                            <div key={m.id}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>{m.name}</span>
                                    <span className="font-bold">{count} tasks</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div 
                                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(100, (count / tasks.length) * 100 * 2)}%` }} // Scaling for visual
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-8 pt-4 border-t">
                    <button 
                        onClick={finishWizard}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} /> 계획 완료 및 저장
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-[600px] p-2 md:p-6 rounded-xl">
        {/* Progress Bar */}
        <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span className={step === 'analysis' ? 'text-indigo-600' : ''}>1. 분석</span>
                <span className={step.startsWith('breakdown') ? 'text-indigo-600' : ''}>2. 분해</span>
                <span className={step === 'dependencies' ? 'text-indigo-600' : ''}>3. 의존성</span>
                <span className={step === 'scheduling' ? 'text-indigo-600' : ''}>4. 일정</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                    style={{ 
                        width: step === 'analysis' ? '25%' : 
                               step === 'breakdown1' ? '40%' :
                               step === 'breakdown2' ? '50%' :
                               step === 'dependencies' ? '75%' : '100%'
                    }}
                ></div>
            </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="animate-fade-in-up">
            {step === 'analysis' && renderStepAnalysis()}
            {(step === 'breakdown1' || step === 'breakdown2') && renderBreakdown()}
            {step === 'dependencies' && renderDependencies()}
            {step === 'scheduling' && renderScheduling()}
        </div>
    </div>
  );
};

export default SimulationTab;