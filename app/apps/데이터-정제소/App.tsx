import React, { useState } from 'react';
import Header from './components/Header';
import CollectionStage from './components/CollectionStage';
import PreprocessingStage from './components/PreprocessingStage';
import ResultStage from './components/ResultStage';
import { Phase, DatasetStats, ScenarioType } from './types';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(Phase.HOME);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioType>('REVIEWS');

  const startSimulation = () => setPhase(Phase.COLLECTION);

  const handleCollectionComplete = (type: ScenarioType) => {
    setCurrentScenario(type);
    setPhase(Phase.PREPROCESSING);
  };

  const handlePreprocessingComplete = (finalStats: DatasetStats) => {
    setStats(finalStats);
    setPhase(Phase.RESULT);
  };

  const handleRestart = () => {
    setPhase(Phase.HOME);
    setStats(null);
  };
  
  const handleBackToHome = () => {
    setPhase(Phase.HOME);
    setStats(null);
  }

  const handleBackToCollection = () => {
    setPhase(Phase.COLLECTION);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Header />
      
      <main className="container mx-auto px-4">
        {phase === Phase.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <div className="mb-8 p-4 bg-blue-100 rounded-full text-blue-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight word-keep-all">
              데이터 분석가 <span className="text-blue-600">시뮬레이터</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed word-keep-all">
              날것의 데이터가 깨끗한 통찰력으로 변하는 과정을 경험해보세요. 이 인터랙티브 시뮬레이션에서 AI 모델을 위한 데이터를 수집, 정제, 준비하는 방법을 배워보세요.
            </p>
            <button
              onClick={startSimulation}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full shadow-xl transition-transform transform hover:-translate-y-1"
            >
              시뮬레이션 시작
            </button>
            
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-4xl w-full">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-2 text-slate-800">1. 수집</h3>
                    <p className="text-slate-500 text-sm word-keep-all">웹이나 센서에서 데이터를 수집하기 위한 올바른 도구를 선택하세요.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-2 text-slate-800">2. 전처리</h3>
                    <p className="text-slate-500 text-sm word-keep-all">결측치, 이상치, 중복과 같은 오류를 찾아 직접 수정하세요.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-2 text-slate-800">3. 분석</h3>
                    <p className="text-slate-500 text-sm word-keep-all">정제 작업이 AI 데이터 품질 점수를 어떻게 향상시켰는지 확인하세요.</p>
                </div>
            </div>
          </div>
        )}

        {phase === Phase.COLLECTION && (
          <CollectionStage 
            onComplete={handleCollectionComplete} 
            onBack={handleBackToHome}
          />
        )}

        {phase === Phase.PREPROCESSING && (
          <PreprocessingStage 
            scenarioType={currentScenario}
            onComplete={handlePreprocessingComplete} 
            onBack={handleBackToCollection}
          />
        )}

        {phase === Phase.RESULT && stats && (
          <ResultStage stats={stats} onRestart={handleRestart} />
        )}
      </main>
    </div>
  );
};

export default App;
