import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StepCard from './components/StepCard';
import ScrambleText from './components/ScrambleText';
import { encryptMessage, decryptMessage } from './services/cryptoUtils';
import { 
  Lock, 
  Unlock, 
  MessageSquare, 
  Key, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  Share2,
  AlertTriangle
} from 'lucide-react';
import { CryptoMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<CryptoMode>('encrypt');
  const [inputText, setInputText] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [resultText, setResultText] = useState('');
  
  // Animation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Reset result when inputs change to encourage "Re-running" the process
  useEffect(() => {
    if (showResult) {
      setShowResult(false);
      setResultText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText, inputKey]);

  const handleProcess = () => {
    if (!inputText || !inputKey) return;

    setIsProcessing(true);
    setShowResult(false);

    // Calculate result immediately but show it after animation
    const result = mode === 'encrypt' 
      ? encryptMessage(inputText, inputKey)
      : decryptMessage(inputText, inputKey);

    setResultText(result);

    // Simulate "processing" time
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const toggleMode = (newMode: CryptoMode) => {
    setMode(newMode);
    setInputText('');
    setResultText('');
    setShowResult(false);
    // Keep key as convenience
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Mode Toggles */}
        <div className="flex justify-center mb-10">
          <div className="bg-cyber-900 p-1 rounded-xl border border-cyber-700 inline-flex">
            <button
              onClick={() => toggleMode('encrypt')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'encrypt' 
                  ? 'bg-cyber-500 text-white shadow-lg shadow-cyber-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-cyber-800'
              }`}
            >
              <Lock className="w-4 h-4" /> 암호화 (잠금)
            </button>
            <button
              onClick={() => toggleMode('decrypt')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                mode === 'decrypt' 
                  ? 'bg-cyber-accent text-white shadow-lg shadow-cyber-accent/25' 
                  : 'text-slate-400 hover:text-white hover:bg-cyber-800'
              }`}
            >
              <Unlock className="w-4 h-4" /> 복호화 (해제)
            </button>
          </div>
        </div>

        {/* Workflow */}
        <div className="space-y-6">
          
          {/* Step 1: Input */}
          <StepCard 
            stepNumber={1} 
            title={mode === 'encrypt' ? "평문 메시지" : "암호문 메시지"} 
            description={mode === 'encrypt' ? "숨기고 싶은 비밀 메시지를 입력하세요." : "전달받은 알 수 없는 코드를 붙여넣으세요."}
            icon={<MessageSquare className="w-5 h-5" />}
          >
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encrypt' ? "예: 내일 12시에 도서관에서 만나" : "예: 004A 12F4 ..."}
              className="w-full bg-cyber-900 border border-cyber-700 rounded-lg p-4 text-white focus:ring-2 focus:ring-cyber-500 focus:outline-none transition-all placeholder-slate-600 font-mono min-h-[100px]"
            />
          </StepCard>

          {/* Step 2: Key */}
          <StepCard 
            stepNumber={2} 
            title="비밀 열쇠 (Key)" 
            description="메시지를 잠그거나 풀 때 사용할 비밀번호입니다."
            icon={<Key className="w-5 h-5" />}
          >
            <div className="relative">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="예: 1234"
                className="w-full bg-cyber-900 border border-cyber-700 rounded-lg p-4 pl-12 text-white focus:ring-2 focus:ring-cyber-500 focus:outline-none transition-all font-mono"
              />
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            </div>
            {mode === 'decrypt' && (
              <p className="text-xs text-amber-500 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                주의: 열쇠가 틀리면 글자가 깨져서 나옵니다!
              </p>
            )}
          </StepCard>

          {/* Action Area */}
          <div className="flex justify-center py-4">
             <button
               onClick={handleProcess}
               disabled={!inputText || !inputKey || isProcessing}
               className={`group relative overflow-hidden rounded-full px-10 py-4 font-bold text-lg transition-all ${
                 !inputText || !inputKey 
                   ? 'bg-cyber-700 text-slate-500 cursor-not-allowed' 
                   : mode === 'encrypt'
                     ? 'bg-cyber-500 hover:bg-cyber-400 text-white shadow-lg shadow-cyber-500/40 hover:scale-105 active:scale-95'
                     : 'bg-cyber-accent hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/40 hover:scale-105 active:scale-95'
               }`}
             >
               <span className="flex items-center gap-3 relative z-10">
                 {isProcessing ? (
                   <>
                     <RefreshCw className="w-6 h-6 animate-spin" /> 처리 중...
                   </>
                 ) : (
                   <>
                     {mode === 'encrypt' ? '메시지 잠그기' : '메시지 풀기'} 
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </span>
             </button>
          </div>

          {/* Step 3: Result */}
          {(showResult || isProcessing) && (
            <StepCard 
              stepNumber={3} 
              title="결과" 
              description={mode === 'encrypt' ? "암호화된 메시지(암호문)입니다." : "복호화된 원래 내용입니다."}
              icon={mode === 'encrypt' ? <Lock className="w-5 h-5 text-red-400" /> : <Unlock className="w-5 h-5 text-green-400" />}
              className="border-2 border-cyber-500"
            >
              <div className="relative bg-cyber-900 rounded-lg border border-cyber-700 p-6">
                
                {/* Visualizer Animation */}
                <div className={`font-mono text-lg md:text-xl leading-relaxed break-all min-h-[3rem] ${
                  mode === 'encrypt' ? 'text-cyber-400' : 'text-emerald-400'
                }`}>
                  <ScrambleText 
                    finalText={resultText} 
                    isAnimating={isProcessing} 
                    placeholder="생성 중..."
                  />
                </div>

                {!isProcessing && resultText && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-cyber-800">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-cyber-800 hover:bg-cyber-700 rounded-md text-sm font-medium transition-colors border border-cyber-600"
                    >
                      {copyFeedback ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copyFeedback ? "복사됨!" : "결과 복사"}
                    </button>
                    
                    {mode === 'encrypt' && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-900/30 text-indigo-300 rounded-md text-sm border border-indigo-900/50">
                        <Share2 className="w-4 h-4" />
                        <span>친구에게 암호문 보내기!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </StepCard>
          )}

        </div>

        {/* Education Section: Comparison */}
        <div className="mt-20 pt-10 border-t border-cyber-800">
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <span className="bg-cyber-700 w-8 h-8 rounded flex items-center justify-center text-sm">?</span>
            열쇠가 다르면 어떻게 될까요?
          </h2>
          <p className="text-slate-400 mb-6">
            같은 메시지라도 열쇠가 바뀌면 결과가 완전히 달라집니다. 이것이 비밀번호 관리가 중요한 이유입니다!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case A */}
            <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">시나리오 A</div>
              <div className="mb-2">
                <span className="text-slate-400 text-sm">메시지:</span> <span className="text-white">안녕</span>
              </div>
              <div className="mb-4">
                <span className="text-slate-400 text-sm">열쇠:</span> <span className="text-yellow-400 font-mono">1234</span>
              </div>
              <div className="bg-cyber-900 p-3 rounded font-mono text-sm text-cyber-400 border border-cyber-700">
                {encryptMessage("안녕", "1234")}
              </div>
            </div>

            {/* Case B */}
            <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">시나리오 B</div>
              <div className="mb-2">
                <span className="text-slate-400 text-sm">메시지:</span> <span className="text-white">안녕</span>
              </div>
              <div className="mb-4">
                <span className="text-slate-400 text-sm">열쇠:</span> <span className="text-red-400 font-mono">9999</span>
              </div>
              <div className="bg-cyber-900 p-3 rounded font-mono text-sm text-cyber-400 border border-cyber-700">
                {encryptMessage("안녕", "9999")}
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;