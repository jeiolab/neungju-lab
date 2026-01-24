import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, RotateCcw, Save, Copy, Loader2, Star, Trash2 } from 'lucide-react';
import { IoTProject } from '../types';
import { evaluateIoTDesign, EvaluationResult } from '../services/geminiService';

const LOCATIONS = [
  { id: 'library', name: '도서관', problems: ['빈 자리가 있는지 모르겠어요', '너무 시끄러워요'] },
  { id: 'cafeteria', name: '급식실', problems: ['줄이 너무 길어요', '오늘 메뉴를 모르겠어요'] },
  { id: 'classroom', name: '교실', problems: ['공기가 탁해요 (환기 필요)', '너무 더워요/추워요'] },
];

const SENSORS = [
  { id: '압력 센서', name: '압력 센서 (무게 감지)' },
  { id: '인체 감지 센서', name: '인체 감지(PIR) 센서 (움직임)' },
  { id: '온도 센서', name: '온도 센서' },
  { id: '소음 센서', name: '소음 센서' },
  { id: '미세먼지 센서', name: '미세먼지 센서' },
];

const ACTUATORS = [
  { id: '전광판', name: 'LED 전광판 (텍스트 표시)' },
  { id: '앱 알림', name: '스마트폰 앱 알림' },
  { id: '서보 모터', name: '창문/문 열기 (모터)' },
  { id: '스피커', name: '경고음 울리기' },
  { id: '환풍기', name: '환풍기 가동' },
];

const TabWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<IoTProject[]>([]);
  
  // Selection State
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [problem, setProblem] = useState(LOCATIONS[0].problems[0]);
  const [sensor, setSensor] = useState(SENSORS[0]);
  const [actuator, setActuator] = useState(ACTUATORS[0]);
  const [logicThreshold, setLogicThreshold] = useState('');
  const [logicAction, setLogicAction] = useState('');

  // Result State
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('iot-projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (newProjects: IoTProject[]) => {
    localStorage.setItem('iot-projects', JSON.stringify(newProjects));
    setProjects(newProjects);
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const logicStr = `만약 [${sensor.name}]값이 [${logicThreshold}]라면, [${actuator.name}]로 [${logicAction}]한다.`;
    
    const result = await evaluateIoTDesign(location.name, problem, sensor.name, actuator.name, logicStr);
    setEvaluation(result);
    setLoading(false);
    handleNext(); // Move to result step
  };

  const handleSaveProject = () => {
    if (!evaluation) return;
    const logicStr = `만약 [${sensor.name}]값이 [${logicThreshold}]라면, [${actuator.name}]로 [${logicAction}]한다.`;
    
    const newProject: IoTProject = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      location: location.name,
      problem,
      sensor: sensor.name,
      actuator: actuator.name,
      logic: logicStr,
      rating: evaluation.rating,
      aiFeedback: evaluation.summary
    };

    saveToStorage([newProject, ...projects]);
    alert("프로젝트 갤러리에 저장되었습니다!");
  };

  const handleDeleteProject = (id: string) => {
    const filtered = projects.filter(p => p.id !== id);
    saveToStorage(filtered);
  };

  const handleCopyText = () => {
    if (!evaluation) return;
    const text = `[IoT 시스템 설계 수행평가]\n\n1. 장소: ${location.name}\n2. 해결하려는 문제: ${problem}\n3. 사용 센서: ${sensor.name}\n4. 출력 장치: ${actuator.name}\n5. 알고리즘: 만약 ${sensor.name}값이 ${logicThreshold}라면, ${actuator.name}로 ${logicAction}한다.\n\n[AI 평가 요약]\n${evaluation.summary}`;
    navigator.clipboard.writeText(text);
    alert("클립보드에 복사되었습니다. 과제 제출란에 붙여넣기 하세요.");
  };

  const resetWizard = () => {
    setStep(0);
    setEvaluation(null);
    setLogicThreshold('');
    setLogicAction('');
  };

  // Step Renders
  const renderStep0 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Step 1. 무엇이 문제인가요?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setLocation(loc);
              setProblem(loc.problems[0]);
            }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              location.id === loc.id
                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="font-bold text-lg mb-2">{loc.name}</div>
            <div className="text-sm text-slate-500">
              {loc.problems.map((p, i) => (
                <div key={i}>• {p}</div>
              ))}
            </div>
          </button>
        ))}
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">구체적인 문제 상황 선택</label>
        <select 
          className="w-full p-2 rounded-md border border-slate-300"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        >
          {location.problems.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button onClick={handleNext} className="btn-primary flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          다음 단계 <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Step 2. 무엇을 감지할까요?</h3>
      <p className="text-slate-600">문제 상황: <span className="font-semibold text-indigo-600">{problem}</span></p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {SENSORS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSensor(s)}
            className={`p-4 rounded-xl border transition-all text-left ${
              sensor.id === s.id
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold">{s.name}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handleBack} className="text-slate-500 hover:text-slate-800">이전</button>
        <button onClick={handleNext} className="btn-primary flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          다음 단계 <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Step 3. 어떻게 해결(알림/동작)할까요?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACTUATORS.map((a) => (
          <button
            key={a.id}
            onClick={() => setActuator(a)}
            className={`p-4 rounded-xl border transition-all text-left ${
              actuator.id === a.id
                ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="font-bold">{a.name}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handleBack} className="text-slate-500 hover:text-slate-800">이전</button>
        <button onClick={handleNext} className="btn-primary flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          다음 단계 <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Step 4. 작동 규칙(알고리즘) 설정</h3>
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-2 text-lg font-medium text-slate-700 flex-wrap">
          <span>만약(If)</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{sensor.name}</span>
          <span>값이</span>
          <input 
            type="text" 
            placeholder="예: 30도 이상, 사람이 감지됨" 
            className="border-b-2 border-slate-300 focus:border-indigo-500 outline-none px-2 py-1 w-48 text-center"
            value={logicThreshold}
            onChange={(e) => setLogicThreshold(e.target.value)}
          />
          <span>(이)라면,</span>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 text-lg font-medium text-slate-700 mt-4 flex-wrap">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">{actuator.name}</span>
          <span>(으)로</span>
          <input 
            type="text" 
            placeholder="예: 문을 연다, 경고음을 낸다" 
            className="border-b-2 border-slate-300 focus:border-indigo-500 outline-none px-2 py-1 w-64 text-center"
            value={logicAction}
            onChange={(e) => setLogicAction(e.target.value)}
          />
          <span>(한)다.</span>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={handleBack} className="text-slate-500 hover:text-slate-800">이전</button>
        <button 
          onClick={handleSubmit} 
          disabled={!logicThreshold || !logicAction || loading}
          className="btn-primary flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Check />} 
          설계 완료 및 평가받기
        </button>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!evaluation) return null;
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">🎉 설계가 완료되었습니다!</h2>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3].map((star) => (
              <Star 
                key={star} 
                className={`w-10 h-10 ${star <= evaluation.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
              />
            ))}
          </div>
          <p className="text-lg font-medium text-slate-600">
            {evaluation.rating === 3 ? "완벽한 설계입니다!" : evaluation.rating === 2 ? "좋은 시도입니다!" : "다시 한 번 생각해볼까요?"}
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
          <h4 className="font-bold text-indigo-900 mb-2">🤖 AI 선생님의 피드백</h4>
          <p className="text-indigo-800 leading-relaxed whitespace-pre-line">{evaluation.feedback}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-xl">
          <h4 className="font-bold text-slate-800 mb-4">내가 설계한 내용</h4>
          <ul className="space-y-2 text-slate-600">
            <li><strong>장소:</strong> {location.name} ({problem})</li>
            <li><strong>입력:</strong> {sensor.name}</li>
            <li><strong>출력:</strong> {actuator.name}</li>
            <li><strong>알고리즘:</strong> 만약 {sensor.name}값이 {logicThreshold}라면, {actuator.name}로 {logicAction}한다.</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={handleSaveProject} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
            <Save size={18} /> 갤러리에 저장
          </button>
          <button onClick={handleCopyText} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50">
            <Copy size={18} /> 제출 텍스트 복사
          </button>
          <button onClick={resetWizard} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">
            <RotateCcw size={18} /> 다시 만들기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wizard Area */}
      {step !== 5 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 mb-10">
          <div className="mb-6 flex justify-between items-center text-sm text-slate-400">
             <span>설계 진행도</span>
             <span>Step {step + 1} / 4</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mb-8">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(((step + 1) / 4) * 100, 100)}%` }}
            ></div>
          </div>
          
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderResult()}
        </div>
      )}

      {/* Gallery Section - Only show when not in active result view or simply always show at bottom */}
      <div className="border-t pt-10">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">📂 나의 프로젝트 갤러리</h3>
        {projects.length === 0 ? (
          <p className="text-slate-400 text-center py-8 bg-slate-50 rounded-xl">아직 저장된 프로젝트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
                <button 
                  onClick={() => handleDeleteProject(p.id)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">{p.location}</span>
                  <div className="flex">
                    {[1, 2, 3].map((s) => (
                       <Star key={s} size={14} className={s <= (p.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{p.problem}</h4>
                <p className="text-sm text-slate-500 mb-3">{p.logic}</p>
                <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                  AI 요약: {p.aiFeedback}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabWizard;