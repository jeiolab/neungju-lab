'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Tab } from './types';
import { BookOpen, Shield, ListTodo, HelpCircle, MessageCircle, Menu, X } from 'lucide-react';
import Theory from './components/Theory';
import Simulation from './components/Simulation';
import Checklist from './components/Checklist';
import Quiz from './components/Quiz';
import Discussion from './components/Discussion';

const InfoSecurityGuardianApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.THEORY);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentTab) {
      case Tab.THEORY: return <Theory />;
      case Tab.SIMULATION: return <Simulation />;
      case Tab.CHECKLIST: return <Checklist />;
      case Tab.QUIZ: return <Quiz />;
      case Tab.DISCUSSION: return <Discussion />;
      default: return <Theory />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 개념', icon: <BookOpen size={18} /> },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: <Shield size={18} /> },
    { id: Tab.CHECKLIST, label: '체크리스트', icon: <ListTodo size={18} /> },
    { id: Tab.QUIZ, label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: Tab.DISCUSSION, label: '생각해보기', icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-0 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">정보 보안 지킴이</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">학생들을 위한 실전 정보 보안 도구 모음. 비밀번호 안전도 검사, 2단계 인증 시뮬레이션, 보안 퀴즈 등을 통해 보안 습관을 기르세요.</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Navigation */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm mb-6">
              <div className="container mx-auto px-4">
                <div className="flex justify-center items-center h-1 py-2">
                  {/* Desktop Nav */}
                  <nav className="hidden md:flex space-x-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                          currentTab === item.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Menu Button */}
                  <button 
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                  </button>
                </div>
              </div>

              {/* Mobile Nav */}
              {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                        currentTab === item.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-5xl">
              <div className="mb-8">
                 {currentTab === Tab.THEORY && (
                   <h2 className="text-3xl font-bold text-slate-800">정보 보안, <span className="text-blue-600">아는 만큼 보입니다.</span></h2>
                 )}
                 {currentTab === Tab.SIMULATION && (
                   <h2 className="text-3xl font-bold text-slate-800">직접 체험해보는 <span className="text-emerald-600">보안 실습</span></h2>
                 )}
                 {currentTab === Tab.CHECKLIST && (
                   <h2 className="text-3xl font-bold text-slate-800">내 기기는 <span className="text-blue-600">안전할까요?</span></h2>
                 )}
                 {currentTab === Tab.QUIZ && (
                   <h2 className="text-3xl font-bold text-slate-800">보안 상식 <span className="text-indigo-600">퀴즈 챌린지</span></h2>
                 )}
                 {currentTab === Tab.DISCUSSION && (
                   <h2 className="text-3xl font-bold text-slate-800">보안에 대한 <span className="text-purple-600">깊이 있는 생각</span></h2>
                 )}
              </div>

              {renderContent()}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfoSecurityGuardianApp;

