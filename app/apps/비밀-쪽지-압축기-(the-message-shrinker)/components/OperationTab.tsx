import React, { useState, useEffect } from 'react';
import { AlgorithmType, CompressionResult } from '../types';
import { runLengthEncoding, lempelZivEncoding } from '../services/compressionService';
import { ArrowRight, AlertTriangle, CheckCircle, Terminal, Activity } from 'lucide-react';

interface OperationTabProps {
  onCompressSuccess: () => void;
}

const OperationTab: React.FC<OperationTabProps> = ({ onCompressSuccess }) => {
  const [input, setInput] = useState<string>('AAAAABBBCCAAAA');
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.RLE);
  const [result, setResult] = useState<CompressionResult | null>(null);

  useEffect(() => {
    let res: CompressionResult;
    if (algorithm === AlgorithmType.RLE) {
      res = runLengthEncoding(input);
    } else {
      res = lempelZivEncoding(input);
    }
    setResult(res);
  }, [input, algorithm]);

  useEffect(() => {
    if (result && result.isEfficient && input.length > 5) {
      // Small cooldown or check to prevent spamming XP
      const timer = setTimeout(() => {
        onCompressSuccess();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [result?.isEfficient]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-green-500 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Terminal className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-green-400">작전 개시: 메시지 압축 프로토콜</h2>
        </div>
        <p className="text-slate-300">
          요원, 선생님께 들키지 않으려면 메시지를 최대한 줄여야 하네. 도구를 선택하고 결과를 확인하게.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input & Controls */}
        <div className="space-y-4">
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <label className="block text-sm font-medium text-slate-400 mb-2">비밀 메시지 입력</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\s/g, ''))} // Removing spaces for simple RLE demo
              className="w-full h-32 bg-slate-900 border border-slate-600 rounded p-3 text-slate-100 focus:ring-2 focus:ring-green-500 focus:outline-none font-mono"
              placeholder="압축할 텍스트를 입력하세요 (예: AAAABBB)"
            />
            <p className="text-xs text-slate-500 mt-1">* 공백은 자동으로 제거됩니다 (교육용 단순화).</p>
          </div>

          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <label className="block text-sm font-medium text-slate-400 mb-3">압축 도구 선택</label>
            <div className="flex gap-4">
              <button
                onClick={() => setAlgorithm(AlgorithmType.RLE)}
                className={`flex-1 py-3 px-4 rounded font-bold transition-all ${
                  algorithm === AlgorithmType.RLE
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                RLE (반복 길이)
              </button>
              <button
                onClick={() => setAlgorithm(AlgorithmType.LZ)}
                className={`flex-1 py-3 px-4 rounded font-bold transition-all ${
                  algorithm === AlgorithmType.LZ
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                Lempel-Ziv (사전)
              </button>
            </div>
            <div className="mt-3 text-sm text-slate-400 p-3 bg-slate-900 rounded">
              {algorithm === AlgorithmType.RLE ? (
                <span><strong className="text-green-400">RLE:</strong> 연속된 문자를 묶어서 표현합니다. (예: AA -&gt; A2)</span>
              ) : (
                <span><strong className="text-blue-400">LZ:</strong> 이전에 나온 단어의 위치를 가리킵니다. (예: 학교...학교 -> &lt;5,2&gt;)</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Results & Visualization */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Compression Ratio Card */}
              <div className={`p-5 rounded-lg border ${result.isEfficient ? 'border-green-500/50 bg-green-900/10' : 'border-red-500/50 bg-red-900/10'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={20} />
                    압축 효율 분석
                  </h3>
                  <span className={`text-2xl font-mono font-bold ${result.ratio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.ratio}%
                  </span>
                </div>
                
                {!result.isEfficient && (
                  <div className="flex items-start gap-2 text-red-300 text-sm bg-red-900/20 p-2 rounded mb-4">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <p>앗! 너무 짧거나 반복이 없는 단어는 압축하면 오히려 용량이 커져요! (오버헤드 발생)</p>
                  </div>
                )}

                <div className="relative pt-6 pb-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                     <span>원본 ({new Blob([result.original]).size}B)</span>
                     <span>압축본 ({new Blob([result.compressed]).size}B)</span>
                  </div>
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                  <div className="mt-2 h-4 bg-slate-700 rounded-full overflow-hidden flex relative">
                     <div 
                        className={`h-full transition-all duration-500 ${result.isEfficient ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(100, (new Blob([result.compressed]).size / new Blob([result.original]).size) * 100)}%` }}
                     ></div>
                  </div>
                </div>
              </div>

              {/* Visualization Steps */}
              <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 h-80 overflow-y-auto">
                <h3 className="text-slate-300 font-bold mb-3 border-b border-slate-700 pb-2">처리 로그</h3>
                <div className="font-mono text-sm space-y-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>INPUT:</span>
                    <span className="text-white bg-slate-700 px-2 py-0.5 rounded break-all">{result.original}</span>
                  </div>
                  <div className="flex justify-center py-2">
                    <ArrowRight className="text-green-500 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2 text-green-400 mb-4">
                    <span>OUTPUT:</span>
                    <span className="text-white bg-green-900/50 px-2 py-0.5 rounded border border-green-500/30 break-all">{result.compressed}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {result.steps.length === 0 ? (
                        <p className="text-slate-500 italic">변경 사항 없음.</p>
                    ) : (
                        result.steps.map((step, idx) => (
                        <div key={idx} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-green-600 font-bold">{`>`}</span>
                            <span>{step}</span>
                        </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationTab;