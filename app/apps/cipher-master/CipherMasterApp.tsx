'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import SymbolTab from './components/SymbolTab';
import { Tab } from './types';
import { BookOpen, Key, Shuffle } from 'lucide-react';

const CipherMasterApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          
          {/* Navbar */}
          <header className="border-b border-slate-200 bg-white mb-8 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab(Tab.SIMULATION)} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                     <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                   <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                 </div>
                 <div className="hidden sm:block">
                   <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                     카이사르의 <span className="text-purple-600">비밀 다이얼</span>
                   </h1>
                   <p className="text-sm text-slate-500 leading-tight mt-0.5">카이사르 암호와 치환 암호를 시뮬레이션, 퀴즈, 심볼 암호를 통해 배우는 인터랙티브 교육 도구입니다.</p>
                 </div>
              </button>
              
              <nav className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setActiveTab(Tab.SIMULATION)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === Tab.SIMULATION 
                      ? 'bg-purple-500 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Key size={16} />
                  <span className="hidden sm:inline">시뮬레이션</span>
                </button>
                <button
                  onClick={() => setActiveTab(Tab.QUIZ)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === Tab.QUIZ
                      ? 'bg-purple-500 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen size={16} />
                  <span className="hidden sm:inline">퀴즈</span>
                </button>
                <button
                  onClick={() => setActiveTab(Tab.SYMBOLS)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === Tab.SYMBOLS
                      ? 'bg-purple-500 text-white shadow-md' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shuffle size={16} />
                  <span className="hidden sm:inline">심볼 암호</span>
                </button>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <div>
            {activeTab === Tab.SIMULATION && <SimulationTab />}
            {activeTab === Tab.QUIZ && <QuizTab />}
            {activeTab === Tab.SYMBOLS && <SymbolTab />}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CipherMasterApp;

