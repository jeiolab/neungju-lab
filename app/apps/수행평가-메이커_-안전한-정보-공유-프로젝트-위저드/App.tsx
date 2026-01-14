import React, { useState, useEffect } from 'react';
import { ProjectState, ProjectTopic, DisclosureScope } from './types';
import { DATA_ITEMS } from './constants';
import { TabConcepts } from './components/TabConcepts';
import { TabWizard } from './components/TabWizard';
import { TabQuiz } from './components/TabQuiz';
import { TabAdvanced } from './components/TabAdvanced';
import { ProjectPlanView } from './components/ProjectPlanView';
import { generateRiskScenario } from './services/geminiService';
import { Layout, ScrollText, PenTool, CheckSquare, Brain, Printer, Flame } from 'lucide-react';

const getDailyMission = () => {
  const missions = [
    "오늘의 미션: 퀴즈 100점 맞기",
    "오늘의 미션: 안전 점수 90점 이상 달성하기",
    "오늘의 미션: 가명 처리 3개 이상 사용하기",
    "오늘의 미션: 친구에게 개인정보 개념 설명하기"
  ];
  const today = new Date().toDateString();
  let seed = 0;
  for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i);
  return missions[seed % missions.length];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(2); // Default to Wizard
  const [showPrintView, setShowPrintView] = useState(false);
  const [aiScenario, setAiScenario] = useState<string>("");

  const [project, setProject] = useState<ProjectState>({
    topic: ProjectTopic.SAFETY,
    selectedDataIds: [],
    processingMethods: {},
    disclosureScope: DisclosureScope.CLASS,
    description: "",
    safetyScore: 100,
    utilityScore: 60
  });

  const [dailyMission] = useState(getDailyMission());

  const handlePrint = async () => {
    // Generate final AI feedback for the report before printing if empty
    if (!aiScenario && project.selectedDataIds.length > 0) {
      const scenario = await generateRiskScenario(project);
      setAiScenario(scenario || '');
    }
    setShowPrintView(true);
    setTimeout(() => {
      window.print();
      // Optional: setShowPrintView(false) after print; typically user closes print dialog.
    }, 500);
  };

  // If in print view mode, allow escaping back
  if (showPrintView) {
    return (
      <div>
        <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center no-print z-50">
           <span>인쇄 미리보기 모드</span>
           <div className="flex gap-4">
             <button onClick={() => window.print()} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">인쇄하기</button>
             <button onClick={() => setShowPrintView(false)} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">닫기</button>
           </div>
        </div>
        <div className="pt-20 bg-gray-100 min-h-screen">
          <ProjectPlanView project={project} dataItems={DATA_ITEMS} feedback={aiScenario} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Layout size={20} />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-slate-800">수행평가 메이커 <span className="text-xs text-slate-500 font-normal ml-1">Beta</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full text-orange-700 text-xs font-bold border border-orange-100">
                <Flame size={14} /> {dailyMission}
             </div>
             <button 
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-700 transition"
             >
                <Printer size={16} /> <span className="hidden sm:inline">계획서 출력</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="mb-6 flex overflow-x-auto no-scrollbar gap-2 pb-2">
          {[
            { id: 1, label: '개념 학습', icon: ScrollText },
            { id: 2, label: '프로젝트 위저드', icon: PenTool },
            { id: 4, label: '퀴즈', icon: CheckSquare },
            { id: 5, label: '심화 탐구(AI)', icon: Brain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fadeIn">
          {activeTab === 1 && <TabConcepts />}
          {activeTab === 2 && <TabWizard project={project} setProject={setProject} />}
          {activeTab === 4 && <TabQuiz />}
          {activeTab === 5 && <TabAdvanced project={project} />}
        </div>
      </main>
      
      {/* Mobile Footer Spacing is handled by pb-20 in main wrapper */}
    </div>
  );
};

export default App;