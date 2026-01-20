'use client'

import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, BookOpen, PenTool, CheckSquare, Trophy, 
  ChevronRight, Save, RotateCcw, BarChart3 
} from 'lucide-react';
import { 
  Song, SortCriteria, UserProject, UserProgress, SortField, SortOrder 
} from './types';
import { INITIAL_SONGS, BADGES, QUIZ_QUESTIONS } from './constants';
import * as Storage from './services/storageService';
import { SortingVisualizer } from './components/SortingVisualizer';
import { ConceptCard } from './components/ConceptCard';
import { QuizSection } from './components/QuizSection';
import { SummaryReport } from './components/SummaryReport';

// Main Step Enum
enum WizardStep {
  INTRO = 0,
  DEFINE = 1,
  CONCEPT = 2,
  SIMULATION = 3,
  REVIEW = 4,
}

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<'wizard' | 'lab' | 'quiz'>('wizard');
  const [currentStep, setCurrentStep] = useState<WizardStep>(WizardStep.INTRO);
  
  // Project Data
  const [project, setProject] = useState<UserProject>(Storage.getProject());
  const [songs] = useState<Song[]>(INITIAL_SONGS);
  
  // Gamification
  const [progress, setProgress] = useState<UserProgress>(Storage.getProgress());
  const [tempCombo, setTempCombo] = useState(0);

  // Initialize
  useEffect(() => {
    const updatedProgress = { ...progress };
    updatedProgress.streak = Storage.checkDailyStreak(progress);
    updatedProgress.lastVisit = new Date().toISOString();
    Storage.saveProgress(updatedProgress);
    setProgress(updatedProgress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveProjectData = (updates: Partial<UserProject>) => {
    const newProject = { ...project, ...updates };
    setProject(newProject);
    Storage.saveProject(newProject);
  };

  const unlockBadge = (badgeId: string) => {
    if (!progress.badges.includes(badgeId)) {
      const newBadges = [...progress.badges, badgeId];
      const newProgress = { ...progress, badges: newBadges };
      setProgress(newProgress);
      Storage.saveProgress(newProgress);
      alert(`🎉 뱃지 획득: ${BADGES.find(b => b.id === badgeId)?.name}`);
    }
  };

  // --- Wizard Renderers ---

  const renderIntro = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="text-center space-y-4 py-10">
         <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
           삽입 정렬 프로젝트 위저드
         </h1>
         <p className="text-xl text-slate-600">
           시험기간 집중 플레이리스트를 내 손으로 정리하며 알고리즘을 마스터해보세요.
         </p>
         <button 
           onClick={() => {
             setCurrentStep(WizardStep.DEFINE);
             unlockBadge('first_step');
           }}
           className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-full text-lg font-bold shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all"
         >
           프로젝트 시작하기
         </button>
       </div>
    </div>
  );

  const renderDefine = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2"><PenTool /> 1단계: 문제 정의 & 기준 설정</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">이 정렬이 왜 필요한가요?</label>
          <textarea 
            className="w-full border border-slate-300 rounded-md p-3 h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="예: 시험 기간에 집중 흐름이 끊기지 않도록 BPM이 비슷한 곡끼리 모으고 싶다."
            value={project.problemDefinition}
            onChange={(e) => saveProjectData({ problemDefinition: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">정렬 기준 (Primary)</label>
            <select 
              className="w-full border border-slate-300 rounded-md p-2"
              value={project.criteria.primary}
              onChange={(e) => saveProjectData({ 
                criteria: { ...project.criteria, primary: e.target.value as SortField } 
              })}
            >
              <option value="bpm">BPM (템포)</option>
              <option value="duration">재생 길이</option>
              <option value="preference">나의 선호도</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">순서</label>
            <select 
              className="w-full border border-slate-300 rounded-md p-2"
              value={project.criteria.primaryOrder}
              onChange={(e) => saveProjectData({ 
                criteria: { ...project.criteria, primaryOrder: e.target.value as SortOrder } 
              })}
            >
              <option value="asc">오름차순 (작은 것부터)</option>
              <option value="desc">내림차순 (큰 것부터)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button onClick={() => setCurrentStep(WizardStep.CONCEPT)} className="btn-primary">
          다음: 개념 학습 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderConcept = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen /> 2단계: 삽입 정렬 이해하기</h2>
      
      <ConceptCard title="삽입 정렬이란?" type="info">
        데이터를 <strong>'이미 정렬된 영역'</strong>과 <strong>'아직 정렬되지 않은 영역'</strong>으로 나눕니다.
        정렬되지 않은 영역의 첫 번째 요소를 꺼내어, 정렬된 영역의 적절한 위치를 찾아 <strong>'끼워 넣는(Insert)'</strong> 방식입니다.
      </ConceptCard>

      <ConceptCard title="카드 게임 비유" type="tip">
        왼손에는 정렬된 카드들을 쥐고 있고, 오른손으로 바닥에 있는 카드를 한 장씩 집어 왼손의 <strong>알맞은 사이</strong>에 끼워 넣는 것과 완벽하게 동일합니다.
      </ConceptCard>

      <ConceptCard title="효율성 체크" type="warning">
        데이터가 거의 정렬되어 있다면 이동할 필요가 거의 없어 매우 빠릅니다(O(n)). 하지만 역순으로 되어 있다면 모든 카드를 비교해야 해서 느려집니다(O(n²)).
      </ConceptCard>

      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-1">나만의 언어로 '삽입 규칙'을 설명해보세요</label>
        <textarea 
          className="w-full border border-slate-300 rounded-md p-3 h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="예: 정렬된 앞부분을 뒤에서부터 훑으면서 나보다 큰 애들은 뒤로 한 칸씩 밀고 빈 자리에 들어간다."
          value={project.explanation}
          onChange={(e) => saveProjectData({ explanation: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <button onClick={() => setCurrentStep(WizardStep.DEFINE)} className="btn-secondary">이전</button>
        <button onClick={() => setCurrentStep(WizardStep.SIMULATION)} className="btn-primary">
          다음: 시뮬레이션 실습 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
         <h2 className="text-2xl font-bold flex items-center gap-2"><PlayCircle /> 3단계: 삽입 실습</h2>
         <div className="text-sm text-slate-500">
           현재 기준: <span className="font-bold text-indigo-600">{project.criteria.primary.toUpperCase()} ({project.criteria.primaryOrder})</span>
         </div>
      </div>

      <SortingVisualizer 
        songs={songs} 
        criteria={project.criteria}
        onCorrectMove={() => {
          setTempCombo(prev => prev + 1);
          if (tempCombo + 1 >= 3) unlockBadge('combo_master');
        }}
        onComplete={(success) => {
          if(success) {
            setTimeout(() => alert("실습 완료! 다음 단계로 넘어갑니다."), 500);
            setCurrentStep(WizardStep.REVIEW);
          }
        }}
      />

      <div className="flex justify-between mt-8">
        <button onClick={() => setCurrentStep(WizardStep.CONCEPT)} className="btn-secondary">이전</button>
        <button onClick={() => setCurrentStep(WizardStep.REVIEW)} className="btn-primary">
           (건너뛰기) 다음 단계 <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2"><CheckSquare /> 4단계: 결과 점검 및 보고서</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">점검 체크리스트</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 space-y-2">
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                    <span>정렬 기준이 명확한가?</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                    <span>정렬된 영역과 그렇지 않은 영역을 구분했는가?</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                    <span>데이터가 추가될 때 O(n) 효율성을 이해했는가?</span>
                </label>
            </div>

            <h3 className="font-bold text-lg mt-6">프로젝트 성찰</h3>
            <textarea 
                className="w-full border border-slate-300 rounded-md p-3 h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="이번 활동을 통해 느낀 점이나 삽입 정렬이 실제 생활(예: 카드 정리, 책장 정리)에 어떻게 쓰일지 적어보세요."
                value={project.reflection}
                onChange={(e) => saveProjectData({ reflection: e.target.value })}
            />
          </div>

          <div>
             <SummaryReport project={project} />
          </div>
      </div>
      
      <div className="flex justify-center pt-8">
          <button 
             onClick={() => {
                 unlockBadge('architect');
                 setActiveTab('quiz'); // Redirect to Quiz
             }}
             className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2"
          >
             <Save size={20} /> 프로젝트 완료 및 퀴즈 도전
          </button>
      </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-700">
             <BarChart3 /> SortWizard
          </div>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-lg">
             {['wizard', 'lab', 'quiz'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'wizard' ? '프로젝트 위저드' : tab === 'lab' ? '실험실' : '퀴즈 & 배지'}
                </button>
             ))}
          </nav>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-1 text-orange-500">
                🔥 {progress.streak}일 연속
             </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* TAB: WIZARD */}
        {activeTab === 'wizard' && (
          <div className="bg-white min-h-[600px] rounded-2xl shadow-xl border border-slate-100 p-8">
             {/* Wizard Progress Bar */}
             {currentStep !== WizardStep.INTRO && (
                 <div className="mb-8">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                        <span>Define</span>
                        <span>Concept</span>
                        <span>Simulate</span>
                        <span>Review</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                    </div>
                 </div>
             )}

             {currentStep === WizardStep.INTRO && renderIntro()}
             {currentStep === WizardStep.DEFINE && renderDefine()}
             {currentStep === WizardStep.CONCEPT && renderConcept()}
             {currentStep === WizardStep.SIMULATION && renderSimulation()}
             {currentStep === WizardStep.REVIEW && renderReview()}
          </div>
        )}

        {/* TAB: LAB (Simulation) */}
        {activeTab === 'lab' && (
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                 <h2 className="text-2xl font-bold mb-4">🧪 알고리즘 실험실</h2>
                 <p className="text-slate-600 mb-6">
                    데이터가 '거의 정렬된 상태'일 때와 '완전 무작위'일 때, 내가 삽입해야 할 횟수가 어떻게 달라지는지 느껴보세요.
                 </p>
                 <SortingVisualizer 
                    songs={songs} 
                    criteria={project.criteria} // Use user defined criteria
                    onCorrectMove={() => {}}
                    onComplete={() => {}}
                    isSimulationMode={true}
                 />
              </div>
           </div>
        )}

        {/* TAB: QUIZ & DASHBOARD */}
        {activeTab === 'quiz' && (
           <div className="space-y-8">
              {/* Badges */}
              <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                     <Trophy className="text-yellow-400" /> 나의 업적 (Badges)
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {BADGES.map(badge => {
                        const isUnlocked = progress.badges.includes(badge.id);
                        return (
                           <div key={badge.id} className={`p-4 rounded-xl border ${isUnlocked ? 'bg-indigo-800 border-indigo-600' : 'bg-indigo-950/50 border-indigo-900 opacity-50'}`}>
                               <div className="text-2xl mb-2">{isUnlocked ? '🏆' : '🔒'}</div>
                               <div className="font-bold text-sm">{badge.name}</div>
                               <div className="text-xs text-indigo-300">{badge.desc}</div>
                           </div>
                        );
                     })}
                  </div>
              </div>

              {/* Quiz */}
              <QuizSection 
                 questions={QUIZ_QUESTIONS}
                 onComplete={(score) => {
                    const newProgress = { ...progress, quizScore: score };
                    setProgress(newProgress);
                    Storage.saveProgress(newProgress);
                    if (score >= 8) unlockBadge('theory_master');
                 }}
              />
           </div>
        )}

      </main>

      {/* Global Styles for simple buttons */}
      <style>{`
        .btn-primary {
           @apply px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold;
        }
        .btn-secondary {
           @apply px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium;
        }
      `}</style>
    </div>
  );
};

export default App;