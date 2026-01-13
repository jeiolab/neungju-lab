import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { TheorySection } from './components/TheorySection';
import { SimulationDashboard } from './components/SimulationDashboard';
import { QuizSection } from './components/QuizSection';
import { ThinkingSection } from './components/ThinkingSection';
import { UserState } from './types';
import { loadUserState, saveUserState } from './services/storageService';

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(loadUserState());

  const handleUpdateUser = (newState: UserState) => {
    setUserState(newState);
    saveUserState(newState);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header userState={userState} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        {/* Intro */}
        <section className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-black text-slate-900 leading-tight">
            어떤 정렬 알고리즘을<br className="sm:hidden" /> 선택해야 할까요?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            속도, 메모리, 안정성. 모든 것을 만족하는 완벽한 알고리즘은 없습니다.<br/>
            상황에 맞춰 <strong>Trade-off(트레이드오프)</strong>를 결정하는 훈련을 시작해봅시다.
          </p>
        </section>

        {/* 1. Theory Expandable */}
        <TheorySection />

        {/* 2. Main Simulation */}
        <SimulationDashboard userState={userState} onUpdateUser={handleUpdateUser} />

        <hr className="border-slate-200" />

        {/* 3. Quiz & Thinking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuizSection userState={userState} onUpdateUser={handleUpdateUser} />
          <div className="space-y-8">
             <ThinkingSection />
             {/* Rules Builder Placeholder / Mini Feature */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-3">🛠️ 나만의 선택 규칙</h3>
               <div className="space-y-2 text-sm text-slate-600">
                 <label className="flex items-center gap-2">
                   <input type="checkbox" className="rounded text-indigo-600" /> 
                   데이터가 거의 정렬됨 → 삽입 정렬 고려
                 </label>
                 <label className="flex items-center gap-2">
                   <input type="checkbox" className="rounded text-indigo-600" /> 
                   메모리 제한 엄격함 → 합병 정렬 제외
                 </label>
                 <label className="flex items-center gap-2">
                   <input type="checkbox" className="rounded text-indigo-600" /> 
                   최악의 경우 방지 → 퀵 정렬 사용 시 피벗 주의
                 </label>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;