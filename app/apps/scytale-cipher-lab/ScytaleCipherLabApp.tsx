'use client'

import React, { useState } from 'react';
import { Scroll, Box, Gamepad2, Sparkles, Feather, History, ShieldAlert } from 'lucide-react';
import { CipherMode } from './types';
import { ScytaleMode } from './components/ScytaleMode';
import { BoxMode } from './components/BoxMode';
import { PuzzleMode } from './components/PuzzleMode';
import { generateSecretMessage } from './services/geminiService';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const ScytaleCipherLabApp: React.FC = () => {
  const [mode, setMode] = useState<CipherMode>('scytale');
  const [input, setInput] = useState<string>('나는스파르타쿠스다');
  const [scytaleDiameter, setScytaleDiameter] = useState<number>(4);
  const [boxColumns, setBoxColumns] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInput = async () => {
    setIsGenerating(true);
    const msg = await generateSecretMessage();
    setInput(msg);
    setIsGenerating(false);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <button 
                onClick={() => {
                  setMode('scytale');
                  setInput('나는스파르타쿠스다');
                  setScytaleDiameter(4);
                  setBoxColumns(3);
                }} 
                className="flex items-center space-x-3 mb-4 md:mb-0 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">스키테일 암호 연구소</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">전치 암호를 탐구하는 대화형 교육 도구입니다.</p>
                </div>
              </button>
              
              <nav className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                <button 
                  onClick={() => setMode('scytale')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'scytale' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Scroll className="w-4 h-4 mr-2" /> 스키테일
                </button>
                <button 
                  onClick={() => setMode('box')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'box' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Box className="w-4 h-4 mr-2" /> 박스 암호
                </button>
                <button 
                  onClick={() => setMode('puzzle')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'puzzle' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" /> 퍼즐
                </button>
              </nav>
            </div>
          </header>

          {mode !== 'puzzle' && (
            <section className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow w-full">
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                    암호화할 메시지
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value.toUpperCase())}
                      placeholder="여기에 입력하세요..."
                      maxLength={30}
                      className="w-full text-2xl font-bold text-slate-900 border-b-2 border-slate-300 focus:border-blue-600 outline-none py-2 bg-transparent placeholder-slate-400 transition-colors"
                    />
                    <Feather className="absolute right-2 top-3 text-slate-400 w-6 h-6" />
                  </div>
                </div>
                <button
                  onClick={handleGenerateInput}
                  disabled={isGenerating}
                  className="flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto shadow-md"
                >
                  {isGenerating ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"/> : <Sparkles className="w-5 h-5 mr-2" />}
                  비밀 메시지 생성
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center">
                <ShieldAlert className="w-3 h-3 mr-1" />
                공백은 제거되며, 글자만 암호화됩니다.
              </p>
            </section>
          )}

          {/* Content Area */}
          <div className="min-h-[400px]">
            {mode === 'scytale' && (
              <ScytaleMode 
                input={input} 
                diameter={scytaleDiameter} 
                setDiameter={setScytaleDiameter} 
              />
            )}
            {mode === 'box' && (
              <BoxMode 
                input={input} 
                columns={boxColumns} 
                setColumns={setBoxColumns} 
              />
            )}
            {mode === 'puzzle' && (
              <PuzzleMode onGenerateMessage={generateSecretMessage} />
            )}
          </div>

          {/* Educational Footer */}
          <footer className="mt-16 border-t border-slate-200 pt-8 grid md:grid-cols-2 gap-8 text-slate-600">
            <div>
              <h4 className="font-bold text-slate-900 mb-3 flex items-center">
                <History className="w-4 h-4 mr-2" />
                역사적 배경
              </h4>
              <p className="text-sm leading-relaxed mb-4">
                <strong>스키테일(Scytale)</strong>은 고대 스파르타의 에포로스(Ephor)들이 군사 작전 중 비밀 메시지를 보내기 위해 사용했던 도구입니다. 정확히 같은 지름의 막대(키)가 없으면, 띠에 적힌 글자들은 무작위로 나열된 것처럼 보입니다. 이는 알려진 최초의 전치 암호 중 하나입니다.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">
                전치 암호 vs 치환 암호
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span><strong>전치(Transposition):</strong> 글자는 그대로 두고 위치만 바꿉니다 (아나그램). <br/><em className="text-xs text-slate-500">예: 안녕 → 녕안</em></span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  <span><strong>치환(Substitution):</strong> 위치는 그대로 두고 글자를 다른 것으로 바꿉니다. <br/><em className="text-xs text-slate-500">예: 안녕 → 앋녇 (시저 암호)</em></span>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScytaleCipherLabApp;

