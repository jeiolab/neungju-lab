import React from 'react';
import { ShieldCheck, Lock, Binary } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-cyber-800 border-b border-cyber-700 py-4 px-6 mb-8 sticky top-0 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
            <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">시크릿 메신저</h1>
            <p className="text-sm text-slate-300 leading-tight mt-0.5">고등학생을 위한 정보 보안 교육 도구. 평문이 키를 만나 암호문으로 변하는 과정을 시각화합니다.</p>
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