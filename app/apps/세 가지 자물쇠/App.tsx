import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Hash, Info, BookOpen } from 'lucide-react';
import { EncryptionType } from './types';
import SymmetricDemo from './components/demos/SymmetricDemo';
import AsymmetricDemo from './components/demos/AsymmetricDemo';
import HashDemo from './components/demos/HashDemo';
import ComparisonTable from './components/ComparisonTable';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EncryptionType>(EncryptionType.SYMMETRIC);

  const tabs = [
    { id: EncryptionType.SYMMETRIC, label: '대칭키 암호화', icon: <Key size={18} />, color: 'bg-blue-500' },
    { id: EncryptionType.ASYMMETRIC, label: '공개키 암호화', icon: <Lock size={18} />, color: 'bg-purple-500' },
    { id: EncryptionType.HASH, label: '해시 함수', icon: <Hash size={18} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="text-center mb-10 max-w-2xl">
        <div className="inline-block p-3 bg-white rounded-full shadow-md mb-4">
           <BookOpen size={32} className="text-indigo-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          Crypto<span className="text-indigo-600">Learn</span>
        </h1>
        <p className="text-slate-500 text-lg">
          현대 암호학의 3대 기둥을 애니메이션으로 쉽게 배워보세요.
        </p>
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
      <main className="w-full max-w-5xl">
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
      </main>

      {/* Footer */}
      <footer className="mt-20 text-slate-400 text-sm">
        <p>© 2024 CryptoLearn. Educational Purpose Only.</p>
      </footer>
    </div>
  );
};

export default App;