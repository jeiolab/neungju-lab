'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Hash, Info, BookOpen } from 'lucide-react';
import { EncryptionType } from './types';
import SymmetricDemo from './components/demos/SymmetricDemo';
import AsymmetricDemo from './components/demos/AsymmetricDemo';
import HashDemo from './components/demos/HashDemo';
import ComparisonTable from './components/ComparisonTable';

const CryptoLearnApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EncryptionType>(EncryptionType.SYMMETRIC);

  const tabs = [
    { id: EncryptionType.SYMMETRIC, label: '대칭키 암호화', icon: <Key size={18} />, color: 'bg-blue-500' },
    { id: EncryptionType.ASYMMETRIC, label: '공개키 암호화', icon: <Lock size={18} />, color: 'bg-purple-500' },
    { id: EncryptionType.HASH, label: '해시 함수', icon: <Hash size={18} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-12 px-4">
          {/* Header */}
          <header className="mb-10 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                  세 가지<span className="text-indigo-600"> 자물쇠</span>
                </h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">대칭키 암호화, 공개키 암호화, 해시 함수의 원리를 애니메이션으로 쉽게 배우는 교육 앱입니다.</p>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
                  ${activeTab === tab.id ? 'text-white shadow-md transform scale-105' : 'text-slate-500 hover:bg-slate-50'}
                  ${activeTab === tab.id ? tab.color : ''}
                `}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="w-full max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === EncryptionType.SYMMETRIC && <SymmetricDemo />}
                {activeTab === EncryptionType.ASYMMETRIC && <AsymmetricDemo />}
                {activeTab === EncryptionType.HASH && <HashDemo />}
              </motion.div>
            </AnimatePresence>

            {/* Comparison Section */}
            <section className="mt-16">
              <div className="flex items-center gap-2 mb-6">
                <Info className="text-indigo-500" />
                <h3 className="text-xl font-bold text-slate-700">한눈에 비교하기</h3>
              </div>
              <ComparisonTable />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CryptoLearnApp;

