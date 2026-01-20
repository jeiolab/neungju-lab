'use client'

import React, { useState } from 'react';
import { Tab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import { BookOpen, Map, Brain, GraduationCap, Github } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryTab />;
      case Tab.SIMULATION:
        return <SimulationTab />;
      case Tab.QUIZ:
        return <QuizTab />;
      case Tab.ADVANCED:
        return (
            <div className="p-8 text-center text-gray-500">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-700">심화 학습 준비중</h2>
                <p>위상 수학과 지하철 노선도의 비밀에 대한 콘텐츠가 곧 업데이트됩니다.</p>
            </div>
        );
      case Tab.REFLECTION:
        return (
            <div className="p-8 text-center text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-700">생각해볼 문제</h2>
                <p>"우리 학교 건물을 점과 선으로만 표현한다면?"</p>
                <textarea className="w-full max-w-lg mt-4 p-4 border rounded-lg" placeholder="여기에 여러분의 생각을 적어보세요... (저장 기능 미구현)"></textarea>
            </div>
        );
      default:
        return <TheoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Map size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">길 찾기의 신</h1>
                    <p className="text-xs text-blue-600 font-medium">단순화의 힘 (Abstraction)</p>
                </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
                {Object.values(Tab).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeTab === tab 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {tab === Tab.THEORY && "이론 학습"}
                        {tab === Tab.SIMULATION && "시뮬레이션"}
                        {tab === Tab.QUIZ && "퀴즈"}
                        {tab === Tab.ADVANCED && "더 알아보기"}
                        {tab === Tab.REFLECTION && "생각하기"}
                    </button>
                ))}
            </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b overflow-x-auto">
        <div className="flex px-4 py-2 space-x-2 min-w-max">
            {Object.values(Tab).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        activeTab === tab 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                >
                     {tab === Tab.THEORY && "이론"}
                     {tab === Tab.SIMULATION && "실습"}
                     {tab === Tab.QUIZ && "퀴즈"}
                     {tab === Tab.ADVANCED && "심화"}
                     {tab === Tab.REFLECTION && "생각"}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>&copy; 2024 교과서 연계 SW 교육 앱 프로젝트</p>
            <p className="mt-2 text-xs">Based on Kyohak Textbook Concepts: Abstraction & Graph Theory</p>
        </div>
      </footer>
    </div>
  );
};

export default App;