import React from 'react';
import { ShieldCheck, Lock, Binary } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-cyber-800 border-b border-cyber-700 py-4 px-6 mb-8 sticky top-0 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyber-500 p-2 rounded-lg shadow-lg shadow-cyber-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Crypto<span className="text-cyber-400">Lab</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">정보 보안 교육 도구</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Binary className="w-4 h-4" />
            <span>XOR 논리</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            <span>대칭키 암호</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;