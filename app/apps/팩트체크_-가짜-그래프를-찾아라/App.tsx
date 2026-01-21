import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Crosshair, BrainCircuit, Trophy, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [totalScore, setTotalScore] = useState(0);
  const [detectiveLevel, setDetectiveLevel] = useState('신입');

  useEffect(() => {
    // Simple level calculation
    if (totalScore >= 100) setDetectiveLevel('셜록');
    else if (totalScore >= 50) setDetectiveLevel('경감');
    else setDetectiveLevel('신입');
  }, [totalScore]);

  const handleScoreUpdate = (points: number) => {
    setTotalScore((prev) => prev + points);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryTab />;
      case Tab.SIMULATION:
        return <SimulationTab onScoreUpdate={handleScoreUpdate} />;
      case Tab.QUIZ:
        return <QuizTab onScoreUpdate={handleScoreUpdate} />;
      case Tab.REFLECTION:
        return <ReflectionTab onScoreUpdate={handleScoreUpdate} />;
      default:
        return (
            <div className="p-8 text-center bg-slate-800 rounded-xl">
                <h2 className="text-2xl text-white font-bold mb-4">데이터 리터러시에 대하여</h2>
                <p className="text-slate-400">
                    빅데이터 시대에 데이터를 정보로 읽고, 이해하고, 소통하는 능력은 매우 중요합니다. 
                    이 앱은 현대 정보 환경을 탐색하기 위한 비판적 사고력을 기르는 데 도움을 줍니다.
                </p>
            </div>
        )
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Crosshair className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">팩트 체크</h1>
              <span className="text-xs text-slate-400 uppercase tracking-wider">가짜 그래프를 찾아라</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <span className="block text-xs text-slate-500 uppercase">현재 등급</span>
              <span className="text-blue-400 font-bold">{detectiveLevel}</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-xs text-slate-500 uppercase mr-2">점수</span>
              <span className="text-white font-mono font-bold">{totalScore}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          <button
            onClick={() => setActiveTab(Tab.THEORY)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              activeTab === Tab.THEORY 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BookOpen size={18} /> 이론
          </button>
          <button
            onClick={() => setActiveTab(Tab.SIMULATION)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              activeTab === Tab.SIMULATION 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Crosshair size={18} /> 실습
          </button>
          <button
            onClick={() => setActiveTab(Tab.QUIZ)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              activeTab === Tab.QUIZ 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Trophy size={18} /> 퀴즈
          </button>
          <button
            onClick={() => setActiveTab(Tab.REFLECTION)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              activeTab === Tab.REFLECTION 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <BrainCircuit size={18} /> 성찰
          </button>
          <button
            onClick={() => setActiveTab(Tab.LEARN_MORE)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
              activeTab === Tab.LEARN_MORE 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Info size={18} /> 더보기
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;