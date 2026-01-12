'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Step, ProjectState, SensorOption, ActionOption } from './types';
import { SENSOR_OPTIONS, ACTION_OPTIONS, RANDOM_IDEAS, EXAMPLE_PROJECTS } from './constants';
import { Button } from './components/Button';
import { ProjectCard } from './components/ProjectCard';
import { getSensorSuggestions, generateProjectDetails } from './services/geminiService';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const INITIAL_PROJECT_STATE: ProjectState = {
  problem: '',
  selectedSensors: [],
  selectedActions: [],
  generatedTitle: '',
  generatedEffect: '',
  ethicalIssue: '',
  studentName: ''
};

export default function IoTProjectPlannerApp() {
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
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setCurrentStep(Step.INTRO);
                  setProjectData(INITIAL_PROJECT_STATE);
                  setAiSuggestion([]);
                  window.scrollTo(0, 0);
                }} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">IoT 프로젝트 기획</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">디자인 씽킹을 활용하여 실제 문제를 해결하는 IoT 솔루션을 기획하는 AI 기반 도구입니다.</p>
                </div>
              </button>
              {currentStep > Step.INTRO && currentStep < Step.RESULT && (
                <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Step {currentStep} / 4
                </div>
              )}
            </div>
            {/* Progress Bar */}
            {currentStep > Step.INTRO && currentStep < Step.RESULT && (
              <div className="h-1 w-full bg-slate-100 mt-4 rounded-full">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
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
                <span className="text-blue-600">IoT</span>로 시작해보세요!
              </h2>
              <p className="text-slate-600 text-lg mb-8 max-w-lg mx-auto">
                학교나 집에서 겪는 불편함을 해결할 방법을 찾아볼까요? <br/>
                AI가 여러분의 기획을 도와줍니다.
              </p>
              <div className="flex justify-center gap-4">
                 <Button size="lg" onClick={nextStep} className="shadow-md">
                    시작하기 🚀
                 </Button>
              </div>
            </div>

            {/* Example Gallery */}
            <div className="pt-10 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">다른 친구들의 아이디어</h3>
              <div className="grid md:grid-cols-3 gap-4 text-left">
                {EXAMPLE_PROJECTS.map((ex, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-sm transition-shadow">
                    <h4 className="font-bold text-slate-900 mb-2">{ex.title}</h4>
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
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-lg font-bold text-slate-900 mb-2">
                1. 어떤 불편함을 해결하고 싶나요?
              </label>
              <p className="text-slate-500 text-sm mb-4">
                "학교 급식실 줄이 너무 길어요", "화장실에 휴지가 없어서 곤란했어요" 처럼 구체적으로 적어주세요.
              </p>
              <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none text-lg"
                placeholder="여기에 불편한 점을 적어보세요..."
                value={projectData.problem}
                onChange={(e) => setProjectData({...projectData, problem: e.target.value})}
              />
              <div className="mt-4 flex justify-between items-center">
                 <button 
                  onClick={handleRandomIdea}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
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
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <span className="text-2xl">🧐</span>
                <div>
                   <p className="font-medium text-blue-900 text-sm">우리가 해결하려는 문제:</p>
                   <p className="text-blue-700 font-bold">"{projectData.problem}"</p>
                </div>
             </div>

             <div>
                <div className="flex justify-between items-end mb-4">
                  <h2 className="text-lg font-bold text-slate-900">2. 어떤 센서가 필요할까요?</h2>
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
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${projectData.selectedSensors.includes(sensor.name) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 bg-white hover:border-blue-300'}`}
                      >
                         <span className="text-2xl">{sensor.icon}</span>
                         <div>
                            <div className="font-bold text-slate-900">{sensor.name}</div>
                            <div className="text-xs text-slate-500">{sensor.description}</div>
                         </div>
                         {projectData.selectedSensors.includes(sensor.name) && (
                            <div className="ml-auto text-blue-600">✓</div>
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
                <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-700">센서: {projectData.selectedSensors.length}개 선택됨</div>
             </div>

             <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4">3. 문제가 감지되면 어떻게 할까요?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {ACTION_OPTIONS.map((action) => (
                      <div 
                        key={action.id}
                        onClick={() => toggleAction(action.name)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${projectData.selectedActions.includes(action.name) ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 bg-white hover:border-green-300'}`}
                      >
                         <span className="text-2xl">{action.icon}</span>
                         <div>
                            <div className="font-bold text-slate-900">{action.name}</div>
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
             <h2 className="text-2xl font-bold text-slate-900 text-center">거의 다 왔어요! 👏</h2>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <div>
                   <label className="text-sm font-bold text-slate-500 uppercase">기획자 이름</label>
                   <input 
                      type="text" 
                      className="w-full mt-1 p-2 border-b-2 border-slate-200 focus:border-blue-500 outline-none transition-colors bg-transparent text-lg font-medium"
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

             <div className="bg-blue-50 p-6 rounded-xl text-center border border-blue-100">
                <p className="text-blue-900 mb-4">
                   이제 AI가 내용을 정리해서 <br/>
                   <span className="font-bold">프로젝트 제목</span>과 <span className="font-bold">기대 효과</span>를 만들어줄게요.
                </p>
                <Button 
                   size="lg" 
                   onClick={handleFinalize} 
                   loading={loading}
                   className="w-full sm:w-auto shadow-md"
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
                <h2 className="text-2xl font-bold text-slate-900">기획이 완성되었습니다! 🎉</h2>
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
      </main>
      <Footer />
    </div>
  );
}