import React, { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';
import { GLOSSARY_TERMS } from '../constants';

const Header: React.FC = () => {
  const [showGlossary, setShowGlossary] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
            <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">데이터 정제소</h1>
            <p className="text-sm text-slate-500 leading-tight mt-0.5">빅데이터 수집 및 전처리 파이프라인 시뮬레이션. 리뷰 수집, 이상치 탐지, 데이터 정제 등을 통해 데이터 분석가 역할을 체험해보세요.</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors bg-gray-50 px-3 py-2 rounded-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>용어 사전</span>
          </button>

          {showGlossary && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">데이터 용어</h3>
                <button onClick={() => setShowGlossary(false)} className="text-gray-400 hover:text-gray-600">
                  &times;
                </button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-1">
                {GLOSSARY_TERMS.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">{item.term}</p>
                    <p className="text-sm text-gray-600 leading-relaxed word-keep-all">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
