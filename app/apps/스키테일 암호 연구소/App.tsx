import React, { useState } from 'react';
import { Scroll, Box, Gamepad2, Sparkles, Feather, History, ShieldAlert } from 'lucide-react';
import { CipherMode } from './types';
import { ScytaleMode } from './components/ScytaleMode';
import { BoxMode } from './components/BoxMode';
import { PuzzleMode } from './components/PuzzleMode';
import { generateSecretMessage } from './services/geminiService';

const App: React.FC = () => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 leading-none">스키테일 암호 연구소</h1>
              <p className="text-xs text-slate-500 tracking-wide">Ancient Cryptography</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setMode('scytale')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'scytale' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Scroll className="w-4 h-4 mr-2" /> 스키테일
            </button>
            <button 
              onClick={() => setMode('box')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'box' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Box className="w-4 h-4 mr-2" /> 박스 암호
            </button>
            <button 
              onClick={() => setMode('puzzle')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'puzzle' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Gamepad2 className="w-4 h-4 mr-2" /> 퍼즐
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {mode !== 'puzzle' && (
          <section className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-grow w-full">
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  암호화할 메시지
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase())}
                    placeholder="여기에 입력하세요..."
                    maxLength={30}
                    className="w-full text-xl font-bold text-slate-800 border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none placeholder-slate-400 transition-colors"
                  />
                  <Feather className="absolute right-3 top-3 text-slate-400 w-5 h-5" />
                </div>
              </div>
              <button
                onClick={handleGenerateInput}
                disabled={isGenerating}
                className="flex items-center justify-center px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto break-keep"
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
        <footer className="mt-16 border-t border-slate-200 pt-8 grid md:grid-cols-2 gap-8 text-slate-700">
          <div>
            <h4 className="font-bold text-slate-800 mb-3 flex items-center">
              <History className="w-4 h-4 mr-2 text-indigo-600" />
              역사적 배경
            </h4>
            <p className="text-sm leading-relaxed mb-4 text-slate-600">
              <strong className="text-slate-800">스키테일(Scytale)</strong>은 고대 스파르타의 에포로스(Ephor)들이 군사 작전 중 비밀 메시지를 보내기 위해 사용했던 도구입니다. 정확히 같은 지름의 막대(키)가 없으면, 띠에 적힌 글자들은 무작위로 나열된 것처럼 보입니다. 이는 알려진 최초의 전치 암호 중 하나입니다.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-2 text-sm">
              전치 암호 vs 치환 암호
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-slate-600"><strong className="text-slate-800">전치(Transposition):</strong> 글자는 그대로 두고 위치만 바꿉니다 (아나그램). <br/><em className="text-xs text-slate-500">예: 안녕 -&gt; 녕안</em></span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                <span className="text-slate-600"><strong className="text-slate-800">치환(Substitution):</strong> 위치는 그대로 두고 글자를 다른 것으로 바꿉니다. <br/><em className="text-xs text-slate-500">예: 안녕 -&gt; 앋녇 (시저 암호)</em></span>
              </li>
            </ul>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;