import React, { useState, useEffect, useRef } from 'react';
import { Step, ProjectState, SensorOption, ActionOption } from './types';
import { SENSOR_OPTIONS, ACTION_OPTIONS, RANDOM_IDEAS, EXAMPLE_PROJECTS } from './constants';
import { Button } from './components/Button';
import { ProjectCard } from './components/ProjectCard';
import { getSensorSuggestions, generateProjectDetails } from './services/geminiService';

const INITIAL_PROJECT_STATE: ProjectState = {
  problem: '',
  selectedSensors: [],
  selectedActions: [],
  generatedTitle: '',
  generatedEffect: '',
  ethicalIssue: '',
  studentName: ''
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO);
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string[]>([]);
  
  const [projectData, setProjectData] = useState<ProjectState>(INITIAL_PROJECT_STATE);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };

  // Step 1: Handle Random Idea
  const handleRandomIdea = () => {
    const random = RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)];
    setProjectData(prev => ({ ...prev, problem: random }));
  };

  // Step 2: AI Sensor Suggestion
  const handleAiSensorSuggest = async () => {
    if (!projectData.problem) return;
    setLoading(true);
    const suggestions = await getSensorSuggestions(projectData.problem);
    setAiSuggestion(suggestions);
    setLoading(false);
  };

  // Step 2 & 3: Selection Handlers
  const toggleSensor = (sensorName: string) => {
    setProjectData(prev => {
      const exists = prev.selectedSensors.includes(sensorName);
      return {
        ...prev,
        selectedSensors: exists 
          ? prev.selectedSensors.filter(s => s !== sensorName)
          : [...prev.selectedSensors, sensorName]
      };
    });
  };

  const toggleAction = (actionName: string) => {
    setProjectData(prev => {
      const exists = prev.selectedActions.includes(actionName);
      return {
        ...prev,
        selectedActions: exists 
          ? prev.selectedActions.filter(a => a !== actionName)
          : [...prev.selectedActions, actionName]
      };
    });
  };

  // Step 4: Finalize Project
  const handleFinalize = async () => {
    setLoading(true);
    const result = await generateProjectDetails(
      projectData.problem,
      projectData.selectedSensors,
      projectData.selectedActions
    );
    setProjectData(prev => ({
      ...prev,
      generatedTitle: result.title,
      generatedEffect: result.effect,
      ethicalIssue: result.ethical
    }));
    setLoading(false);
    nextStep(); // Go to RESULT
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setProjectData(INITIAL_PROJECT_STATE);
    setAiSuggestion([]);
    setCurrentStep(Step.INTRO);
    window.scrollTo(0, 0);
  };

  // Render components
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => {
              if(currentStep !== Step.INTRO && confirm('처음으로 돌아가시겠습니까? 작성 중인 내용은 사라집니다.')) handleReset();
          }}>
            <span className="text-2xl">💡</span>
            <h1 className="text-xl font-bold text-indigo-900 tracking-tight">프로젝트 기획 도우미</h1>
          </div>
          {currentStep > Step.INTRO && currentStep < Step.RESULT && (
            <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Step {currentStep} / 4
            </div>
          )}
        </div>
        {/* Progress Bar */}
        {currentStep > Step.INTRO && currentStep < Step.RESULT && (
          <div className="h-1 w-full bg-slate-100">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-8">
        
        {/* Step 0: INTRO */}
        {currentStep === Step.INTRO && (
          <div className="space-y-8 animate-fade-in text-center py-10">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                세상을 바꾸는 작은 아이디어, <br/>
                <span className="text-indigo-600">IoT</span>로 시작해보세요!
              </h2>
              <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
                학교나 집에서 겪는 불편함을 해결할 방법을 찾아볼까요? <br/>
                AI가 여러분의 기획을 도와줍니다.
              </p>
              <div className="flex justify-center gap-4">
                 <Button size="lg" onClick={nextStep} className="shadow-lg shadow-indigo-200">
                    시작하기 🚀
                 </Button>
              </div>
            </div>

            {/* Example Gallery */}
            <div className="pt-10 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">다른 친구들의 아이디어</h3>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                {EXAMPLE_PROJECTS.map((ex, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-slate-800 mb-2">{ex.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3">{ex.problem}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {ex.sensors.slice(0, 2).map((s, i) => (
                         <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: PROBLEM */}
        {currentStep === Step.PROBLEM && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-lg font-bold text-slate-800 mb-2">
                1. 어떤 불편함을 해결하고 싶나요?
              </label>
              <p className="text-slate-500 text-sm mb-4">
                "학교 급식실 줄이 너무 길어요", "화장실에 휴지가 없어서 곤란했어요" 처럼 구체적으로 적어주세요.
              </p>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none text-lg"
                placeholder="여기에 불편한 점을 적어보세요..."
                value={projectData.problem}
                onChange={(e) => setProjectData({...projectData, problem: e.target.value})}
              />
              <div className="mt-4 flex justify-between items-center">
                 <button 
                  onClick={handleRandomIdea}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                 >
                   🎲 아이디어가 안 떠오르나요?
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: SENSORS */}
        {currentStep === Step.SENSORS && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
                <span className="text-2xl">🧐</span>
                <div>
                   <p className="font-medium text-indigo-900 text-sm">우리가 해결하려는 문제:</p>
                   <p className="text-indigo-700 font-bold">"{projectData.problem}"</p>
                </div>
             </div>

             <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-slate-800">2. 어떤 센서가 필요할까요?</h2>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleAiSensorSuggest} 
                    loading={loading}
                    className="text-xs"
                  >
                    🤖 AI 추천받기
                  </Button>
                </div>

                {/* AI Suggestion Box */}
                {aiSuggestion.length > 0 && (
                   <div className="mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl animate-pulse-once">
                      <p className="text-xs font-bold text-emerald-600 mb-2 uppercase">AI 추천 센서</p>
                      <div className="flex gap-2 flex-wrap">
                        {aiSuggestion.map((s, i) => (
                           <button 
                             key={i}
                             onClick={() => toggleSensor(s)}
                             className={`px-3 py-1 rounded-full text-sm border transition-colors ${projectData.selectedSensors.includes(s) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                           >
                             + {s}
                           </button>
                        ))}
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {SENSOR_OPTIONS.map((sensor) => (
                      <div 
                        key={sensor.id}
                        onClick={() => toggleSensor(sensor.name)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${projectData.selectedSensors.includes(sensor.name) ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                      >
                         <span className="text-2xl">{sensor.icon}</span>
                         <div>
                            <div className="font-bold text-slate-800">{sensor.name}</div>
                            <div className="text-xs text-slate-500">{sensor.description}</div>
                         </div>
                         {projectData.selectedSensors.includes(sensor.name) && (
                            <div className="ml-auto text-indigo-600">✓</div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Step 3: ACTIONS */}
        {currentStep === Step.ACTIONS && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex gap-2 mb-2 text-sm">
                <div className="bg-slate-100 px-3 py-1 rounded-full text-slate-600">문제: {projectData.problem.substring(0, 15)}...</div>
                <div className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-700">센서: {projectData.selectedSensors.length}개 선택됨</div>
             </div>

             <div>
                <h2 className="text-lg font-bold text-slate-800 mb-4">3. 문제가 감지되면 어떻게 할까요?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {ACTION_OPTIONS.map((action) => (
                      <div 
                        key={action.id}
                        onClick={() => toggleAction(action.name)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${projectData.selectedActions.includes(action.name) ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 bg-white hover:border-green-300'}`}
                      >
                         <span className="text-2xl">{action.icon}</span>
                         <div>
                            <div className="font-bold text-slate-800">{action.name}</div>
                            <div className="text-xs text-slate-500">{action.description}</div>
                         </div>
                         {projectData.selectedActions.includes(action.name) && (
                            <div className="ml-auto text-green-600">✓</div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Step 4: REVIEW & NAME */}
        {currentStep === Step.REVIEW && (
          <div className="space-y-8 animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-800 text-center">거의 다 왔어요! 👏</h2>
             
             <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                <div>
                   <label className="text-sm font-bold text-slate-500 uppercase">기획자 이름</label>
                   <input 
                      type="text" 
                      className="w-full mt-1 p-2 border-b-2 border-slate-200 focus:border-indigo-500 outline-none transition-colors bg-transparent text-lg font-medium"
                      placeholder="이름을 입력하세요"
                      value={projectData.studentName}
                      onChange={(e) => setProjectData({...projectData, studentName: e.target.value})}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                   <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">선택한 센서</div>
                      <div className="text-slate-700 mt-1">{projectData.selectedSensors.join(', ')}</div>
                   </div>
                   <div>
                      <div className="text-xs text-slate-400 font-bold uppercase">선택한 동작</div>
                      <div className="text-slate-700 mt-1">{projectData.selectedActions.join(', ')}</div>
                   </div>
                </div>
             </div>

             <div className="bg-indigo-50 p-6 rounded-xl text-center">
                <p className="text-indigo-900 mb-4">
                   이제 AI가 내용을 정리해서 <br/>
                   <span className="font-bold">프로젝트 제목</span>과 <span className="font-bold">기대 효과</span>를 만들어줄게요.
                </p>
                <Button 
                   size="lg" 
                   onClick={handleFinalize} 
                   loading={loading}
                   className="w-full sm:w-auto shadow-xl shadow-indigo-200"
                >
                   ✨ 프로젝트 카드 생성하기
                </Button>
             </div>
          </div>
        )}

        {/* Step 5: RESULT */}
        {currentStep === Step.RESULT && (
          <div className="animate-fade-in pb-10">
             <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">기획이 완성되었습니다! 🎉</h2>
                <p className="text-slate-500 text-sm mt-1">아래 카드를 저장하거나 친구들에게 공유해보세요.</p>
             </div>

             <ProjectCard data={projectData} />

             <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
                <Button variant="outline" onClick={handlePrint}>
                   🖨️ 인쇄 / PDF 저장
                </Button>
                <Button variant="primary" onClick={handleReset}>
                   🔄 새로운 프로젝트 만들기
                </Button>
             </div>
          </div>
        )}

      </main>

      {/* Footer Navigation (Sticky) */}
      {currentStep !== Step.INTRO && currentStep !== Step.RESULT && (
        <footer className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-10 safe-area-pb">
           <div className="max-w-3xl mx-auto flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                 이전
              </Button>
              <Button 
                onClick={currentStep === Step.ACTIONS ? nextStep : nextStep}
                disabled={
                   (currentStep === Step.PROBLEM && !projectData.problem) ||
                   (currentStep === Step.SENSORS && projectData.selectedSensors.length === 0) ||
                   (currentStep === Step.ACTIONS && projectData.selectedActions.length === 0)
                }
              >
                 {currentStep === Step.ACTIONS ? '다음: 검토' : '다음'}
              </Button>
           </div>
        </footer>
      )}
      
    </div>
  );
}